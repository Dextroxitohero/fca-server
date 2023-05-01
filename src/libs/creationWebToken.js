import jwt from 'jsonwebtoken';
import { SECRET } from '../config';

export const createAccessToken = async ({ _id, email }) => {
    const payLoad = {
        uid: _id,
        email
    }
    const token = jwt.sign(payLoad, SECRET, {
        expiresIn: '2h'
    })
    return token
}
