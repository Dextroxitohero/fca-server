import jwt from 'jsonwebtoken';
import { SECRET } from '../config';

export const createAccessToken = async ({ email, password }) => {
    const payLoad = {
        email,
        password
    }
    const token = jwt.sign(payLoad, SECRET, {
        expiresIn: '5m'
    })
    return token
}
