import QRCode from 'qrcode';

export class QRCodeGenerator {
    public async generateQRCode(data: string): Promise<string> {
        try {
            // Generate QR code as a data URL
            const qrCodeDataURL = await QRCode.toDataURL(data);
            return qrCodeDataURL;
        } catch (err) {
            console.error(err);
            throw new Error('Failed to generate QR code.');
        }
    }
}

export default new QRCodeGenerator();
