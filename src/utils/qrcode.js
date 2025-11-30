const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

// Générer un QR code unique
exports.generateQRCode = async (ticketId) => {
  try {
    const qrData = {
      ticketId: ticketId,
      timestamp: Date.now(),
      uuid: uuidv4(),
    };
    
    const qrString = JSON.stringify(qrData);
    const qrCodeDataURL = await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 300,
      margin: 1,
    });
    
    return qrCodeDataURL;
  } catch (error) {
    throw new Error('Erreur lors de la génération du QR code');
  }
};

// Décoder un QR code
exports.decodeQRCode = (qrString) => {
  try {
    return JSON.parse(qrString);
  } catch (error) {
    throw new Error('QR code invalide');
  }
};

// Valider un QR code
exports.validateQRCode = (qrData) => {
  if (!qrData.ticketId || !qrData.timestamp || !qrData.uuid) {
    return false;
  }
  return true;
};
