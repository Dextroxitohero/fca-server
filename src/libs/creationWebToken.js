import jwt from 'jsonwebtoken';
import { SECRET, JWT_EXPIRES } from '../config';

export const createAccessToken = async ({ _id, email, password }) => {
    const payLoad = {
        _id,
        email,
        password
    }
    const token = jwt.sign(payLoad, SECRET, {
        expiresIn: JWT_EXPIRES
    })

    return token
}

export const createActivationToken = async ({ _id, email, password }) => {
    const payLoad = {
        _id,
        email,
        password
    }
    const token = jwt.sign(payLoad, SECRET, {
        expiresIn: '5m'
    })

    return token
}
