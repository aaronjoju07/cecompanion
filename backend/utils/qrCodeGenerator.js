const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

class QRCodeGenerator {
  /**
   * Generate QR Code for event registration
   * @param {Object} data - Registration data to encode
   * @param {string} eventId - Event ID
   * @param {string} userId - User ID
   * @returns {Promise<string>} Path to generated QR code
   */
  static async generateEventRegistrationQR(data, eventId, userId) {
    try {
      // Create QR code data
      const qrData = JSON.stringify({
        eventId,
        userId,
        ...data
      });

      // Define output directory
      const outputDir = path.join(__dirname, '../qr_codes');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Generate unique filename
      const filename = `event_reg_${eventId}_${userId}_${Date.now()}.png`;
      const filepath = path.join(outputDir, filename);

      // Generate QR Code
      await QRCode.toFile(filepath, qrData, {
        color: {
          dark: '#000',  // Black dots
          light: '#FFF'  // White background
        }
      });

      return filepath;
    } catch (error) {
      console.error('QR Code Generation Error:', error);
      throw new Error('Failed to generate QR Code');
    }
  }

  /**
   * Verify QR Code data
   * @param {string} qrString - Scanned QR code string
   * @returns {Object} Decoded QR data
   */
  static verifyQRCode(qrString) {
    try {
      const decodedData = JSON.parse(qrString);
      
      // Validate required fields
      if (!decodedData.eventId || !decodedData.userId) {
        throw new Error('Invalid QR Code');
      }

      return decodedData;
    } catch (error) {
      console.error('QR Code Verification Error:', error);
      throw new Error('Invalid QR Code format');
    }
  }
}

module.exports = QRCodeGenerator;