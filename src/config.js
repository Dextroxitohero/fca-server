import { config } from 'dotenv';
config();

export const PORT = process.env.PORT || 8000
export const MONGODB_URI = process.env.MONGODB_URI
export const SECRET = process.env.SECRET