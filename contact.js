const express = require('express');
const validator = require('validator');
const rateLimit = require('express-rate-limit');
const db = require('../database/db');

const router = express.Router();

// Rate limiting spécifique pour les soumissions de formulaire
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Maximum 5 soumissions par IP toutes les 15 minutes
    message: {
        success: false,
        message: 'Trop de soumissions de formulaire. Veuillez attendre avant de réessayer.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware de validation des données
const validateContactData = (req, res, next) => {
    const { name, email, service, message } = req.body;
    const errors = [];

    // Validation du nom
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
        errors.push('Le nom doit contenir au moins 2 caractères');
    }
    if (name && name.length > 100) {
        errors.push('Le nom ne peut pas dépasser 100 caractères');
    }

    // Validation de l'email
    if (!email || !validator.isEmail(email)) {
        errors.push('Veuillez fournir une adresse email valide');
    }
    if (email && email.length > 255) {
        errors.push('L\'adresse email est trop longue');
    }

    // Validation du service
    const validServices = ['consulting', 'ia', 'web', 'autre'];
    if (!service || !validServices.includes(service)) {
        errors.push('Veuillez sélectionner un service valide');
    }

    // Validation du message
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
        errors.push('Le message doit contenir au moins 10 caractères');
    }
    if (message && message.length > 2000) {
        errors.push('Le message ne peut pas dépasser 2000 caractères');
    }

    // Vérification de contenu suspect (anti-spam basique)
    const suspiciousPatterns = [
        /https?:\/\//gi, // URLs
        /\b(viagra|casino|lottery|winner|congratulations)\b/gi, // Mots suspects
        /(.)\1{10,}/gi, // Répétition excessive de caractères
    ];

    const fullText = `${name} ${email} ${message}`.toLowerCase();
    const hasSuspiciousContent = suspiciousPatterns.some(pattern => pattern.test(fullText));
    
    if (hasSuspiciousContent) {
        errors.push('Le contenu semble suspect. Veuillez vérifier votre message.');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Données invalides',
            errors: errors
        });
    }

    // Nettoyer et normaliser les données
    req.body.name = validator.escape(name.trim());
    req.body.email = validator.normalizeEmail(email);
    req.body.message = validator.escape(message.trim());
    req.body.service = service;

    next();
};

// Route POST pour soumettre un nouveau contact
router.post('/', contactLimiter, validateContactData, async (req, res) => {
    try {
        const { name, email, service, message } = req.body;
        
        // Récupérer les informations de la requête
        const ipAddress = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
        const userAgent = req.get('User-Agent') || '';

        // Préparer les données pour la base de données
        const contactData = {
            name,
            email,
            service,
            message,
            ipAddress,
            userAgent
        };

        // Ajouter le contact à la base de données
        const result = await db.addContact(contactData);

        // Log pour le suivi
        console.log(`Nouveau contact reçu: ${name} (${email}) - Service: ${service}`);

        // Réponse de succès
        res.status(201).json({
            success: true,
            message: 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.',
            contactId: result.id
        });

        // TODO: Ici vous pouvez ajouter l'envoi d'email de notification
        // await sendNotificationEmail(contactData);

    } catch (error) {
        console.error('Erreur lors de la soumission du contact:', error);
        
        res.status(500).json({
            success: false,
            message: 'Une erreur est survenue lors de l\'envoi de votre message. Veuillez réessayer plus tard.'
        });
    }
});

// Route GET pour récupérer tous les contacts (pour l'administration)
router.get('/', async (req, res) => {
    try {
        // Cette route devrait être protégée par une authentification en production
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const contacts = await db.getAllContacts(limit, offset);
        
        res.json({
            success: true,
            data: contacts,
            pagination: {
                page,
                limit,
                total: contacts.length
            }
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des contacts:', error);
        
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des contacts'
        });
    }
});

// Route GET pour récupérer un contact spécifique
router.get('/:id', async (req, res) => {
    try {
        const contactId = parseInt(req.params.id);
        
        if (!contactId || contactId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'ID de contact invalide'
            });
        }

        const contact = await db.getContactById(contactId);
        
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact non trouvé'
            });
        }

        res.json({
            success: true,
            data: contact
        });

    } catch (error) {
        console.error('Erreur lors de la récupération du contact:', error);
        
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du contact'
        });
    }
});

// Route PUT pour mettre à jour le statut d'un contact
router.put('/:id/status', async (req, res) => {
    try {
        const contactId = parseInt(req.params.id);
        const { status } = req.body;
        
        const validStatuses = ['nouveau', 'en_cours', 'traité', 'fermé'];
        
        if (!contactId || contactId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'ID de contact invalide'
            });
        }

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Statut invalide. Statuts valides: ' + validStatuses.join(', ')
            });
        }

        const result = await db.updateContactStatus(contactId, status);
        
        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Contact non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Statut mis à jour avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la mise à jour du statut:', error);
        
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du statut'
        });
    }
});

// Route DELETE pour supprimer un contact
router.delete('/:id', async (req, res) => {
    try {
        const contactId = parseInt(req.params.id);
        
        if (!contactId || contactId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'ID de contact invalide'
            });
        }

        const result = await db.deleteContact(contactId);
        
        if (result.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Contact non trouvé'
            });
        }

        res.json({
            success: true,
            message: 'Contact supprimé avec succès'
        });

    } catch (error) {
        console.error('Erreur lors de la suppression du contact:', error);
        
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du contact'
        });
    }
});

// Route pour obtenir les statistiques des contacts
router.get('/admin/stats', async (req, res) => {
    try {
        const stats = await db.getContactStats();
        
        res.json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques'
        });
    }
});

module.exports = router;