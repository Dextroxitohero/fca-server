import { config } from 'dotenv';
config();

export const PORT = process.env.PORT || 8000
export const MONGODB_URI = process.env.MONGODB_URI
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
export const SECRET = process.env.SECRET
export const JWT_EXPIRES = process.env.JWT_EXPIRES

export const MAIL_HOST = process.env.MAIL_HOST
export const MAIL_PORT = process.env.MAIL_PORT
export const MAIL_SERVICE = process.env.MAIL_SERVICE
export const MAIL_USER = process.env.MAIL_USER
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD

export const BASE_URL_DEV = process.env.BASE_URL_DEV
export const BASE_URL_PRODUCTION = process.env.BASE_URL_PRODUCTION


export const REACT_APP_CLOUD_NAME = process.env.REACT_APP_CLOUD_NAME
export const REACT_APP_API_KEY = process.env.REACT_APP_API_KEY
export const REACT_APP_API_SECRET = process.env.REACT_APP_API_SECRET

