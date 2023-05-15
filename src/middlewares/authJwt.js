import jwt from 'jsonwebtoken'
import { SECRET,  } from '../config';
import User from '../models/User';



// export const verifyToken = (req, res, next) => {
//     const token = req.headers['x-access-token']

//     if (!token) return res.status(401).json({
//         message: 'No token provided'
//     })

//     try {
//         const { uid, email } = jwt.verify(token, SECRET)

//         req.uid = uid;
//         req.email = email;

//         next()

//     } catch (err) {
//         return res.status(401).json({
//             message: 'Unauthorized'
//         })
//     }
// }

export const verifyToken = async (req, res, next) => {
    const {token} = req.cookies;
    
    if (!token) return res.status(401).json({
        message: 'Please login to continue'
    })
    
    try {

        const decoded = jwt.verify(token, SECRET);

        req.user = await User.findById(decoded._id);
    
        next()

    } catch (err) {
        return res.status(401).json({
            message: 'Please login to continue'
        })
    }
}


