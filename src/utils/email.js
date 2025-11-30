const nodemailer = require('nodemailer');
const config = require('../config');

// Créer un transporteur
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: config.email.host,
    port: config.email.port,
    secure: false, // true pour 465, false pour autres ports
    auth: {
      user: config.email.user,
      pass: config.email.password,
    },
  });
};

// Envoyer un email
exports.sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `Event App Pro <${config.email.from}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    throw new Error('Erreur lors de l\'envoi de l\'email');
  }
};

// Template email de bienvenue
exports.sendWelcomeEmail = async (user) => {
  const html = `
    <h1>Bienvenue sur Event App Pro !</h1>
    <p>Bonjour ${user.name},</p>
    <p>Merci de vous être inscrit sur Event App Pro, votre plateforme événementielle au Sénégal.</p>
    <p>Vous pouvez maintenant découvrir et réserver vos billets pour les meilleurs événements.</p>
    <br>
    <p>À bientôt !</p>
    <p>L'équipe Event App Pro</p>
  `;
  
  await exports.sendEmail({
    to: user.email,
    subject: 'Bienvenue sur Event App Pro',
    html,
  });
};

// Template email de confirmation de commande
exports.sendOrderConfirmation = async (order, user) => {
  const html = `
    <h1>Confirmation de commande</h1>
    <p>Bonjour ${user.name},</p>
    <p>Votre commande <strong>${order.orderNumber}</strong> a été confirmée avec succès.</p>
    <p><strong>Montant total:</strong> ${order.total} FCFA</p>
    <p>Vous recevrez vos billets par email dans quelques instants.</p>
    <br>
    <p>Merci de votre confiance !</p>
    <p>L'équipe Event App Pro</p>
  `;
  
  await exports.sendEmail({
    to: user.email,
    subject: `Confirmation de commande ${order.orderNumber}`,
    html,
  });
};

// Template email de réinitialisation de mot de passe
exports.sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${config.cors.origin}/reset-password/${resetToken}`;
  
  const html = `
    <h1>Réinitialisation de mot de passe</h1>
    <p>Bonjour ${user.name},</p>
    <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
    <p>Cliquez sur le lien ci-dessous pour définir un nouveau mot de passe:</p>
    <a href="${resetUrl}" style="padding: 10px 20px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">
      Réinitialiser mon mot de passe
    </a>
    <p>Ce lien expirera dans 30 minutes.</p>
    <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    <br>
    <p>L'équipe Event App Pro</p>
  `;
  
  await exports.sendEmail({
    to: user.email,
    subject: 'Réinitialisation de mot de passe',
    html,
  });
};

// Template email de billet
exports.sendTicketEmail = async (ticket, user, event) => {
  const html = `
    <h1>Votre billet</h1>
    <p>Bonjour ${user.name},</p>
    <p>Voici votre billet pour l'événement <strong>${event.title}</strong></p>
    <div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 10px;">
      <p><strong>Numéro de billet:</strong> ${ticket.ticketNumber}</p>
      <p><strong>Type:</strong> ${ticket.ticketType}</p>
      <p><strong>Événement:</strong> ${event.title}</p>
      <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString('fr-FR')}</p>
      <p><strong>Heure:</strong> ${event.time}</p>
      <p><strong>Lieu:</strong> ${event.location}</p>
    </div>
    <p>Présentez ce billet à l'entrée (QR code).</p>
    <br>
    <p>Bon événement !</p>
    <p>L'équipe Event App Pro</p>
  `;
  
  await exports.sendEmail({
    to: user.email,
    subject: `Votre billet pour ${event.title}`,
    html,
  });
};
