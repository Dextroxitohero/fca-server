import { config } from 'dotenv';
config();

export const PORT = process.env.PORT || 8000
export const MONGODB_URI = process.env.MONGODB_URI
export const SECRET = process.env.SECRET
export const JWT_EXPIRES = process.env.JWT_EXPIRES

export const MAIL_HOST = process.env.MAIL_HOST
export const MAIL_PORT = process.env.MAIL_PORT
export const MAIL_SERVICE = process.env.MAIL_SERVICE
export const MAIL_USER = process.env.MAIL_USER
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD


