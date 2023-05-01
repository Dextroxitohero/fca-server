import jwt from 'jsonwebtoken'
import { SECRET } from '../config';



export const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token']

    if (!token) return res.status(401).json({
        message: 'No token provided'
    })

    try {
        const { uid, email } = jwt.verify(token, SECRET)

        req.uid = uid;
        req.email = email;

        

        next()

    } catch (err) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }

}
