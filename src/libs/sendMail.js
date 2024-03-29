import nodemailer from 'nodemailer';
import {
    MAIL_HOST,
    MAIL_PORT,
    MAIL_SERVICE,
    MAIL_USER,
    MAIL_PASSWORD
} from '../config';
import { validationPayment } from './emails/templateValidationPayment';
import { paymentData } from './emails/templatePaymentData';
import { templeWelcome } from './emails/templateWelcome';
import { templateRequestPassword } from './emails/requestPassword';
import { updatedPassword } from './emails/templateUpdatePassword';
import { templateCreateInvitation } from './emails/templateCreateInvitation';
import { templateCreateByInvitation } from './emails/templateCreateByInvitation';

const chooseTemplate = (template, data) => {
    switch (template) {
        case 'templateWelcome':
            return templeWelcome(data);
        case 'templateUpdatePassword':
            return updatedPassword(data);
        case 'templateRequestPassword':
            return templateRequestPassword(data);
        case 'templateDataPayment':
            return paymentData();
        case 'templateValidationPayment':
            return validationPayment();
        case 'templateCreateInvitation':
            return templateCreateInvitation(data);
        case 'templateCreateByInvitation':
            return templateCreateByInvitation(data);
        default:
            return null;
    }

}


export const sendMail = async ({ email, subject, template, data }) => {

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
            to: email,
            subject: subject,
            html: chooseTemplate(template, data),
        };
        // Enviamos el correo electrónico
        const info = await transporter.sendMail(mailOptions);

        return info;
    } catch (error) {
        console.log('Error al enviar el correo electrónico:', error);
        throw error;
    }
}