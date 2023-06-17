import nodemailer from 'nodemailer';
import {
    MAIL_HOST,
    MAIL_PORT,
    MAIL_SERVICE,
    MAIL_USER,
    MAIL_PASSWORD
} from '../config';

export const sendMail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: MAIL_HOST,
            port: MAIL_PORT,
            service: MAIL_SERVICE,
            auth: {
                user: MAIL_USER,
                pass: MAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: MAIL_USER,
            to: options.email,
            subject: options.subject,
            text: options.message,
        };
        // Enviamos el correo electrónico
        const info = await transporter.sendMail(mailOptions);

        return info;
    } catch (error) {
        console.log('Error al enviar el correo electrónico:', error);
        throw error;
    }
}