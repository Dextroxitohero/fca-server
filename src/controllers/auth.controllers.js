import User from '../models/User'
import jwt from 'jsonwebtoken';

import { createAccessToken, createActivationToken } from '../libs/creationWebToken';
import { createCookieAccessAuth, createCookieLogout } from '../libs/jwtToken';
import { sendMail } from '../libs/sendMail';
import { SECRET } from '../config';
import PreRegister from '../models/PreRegister';


// export const signUp = async (req, res) => {

//     try {
//         const { email, password } = req.body
//         const newUser = new User({
//             email: email.toLowerCase(),
//             password: await User.encryptPassword(password)
//         })

//         const savedUser = await User.create(newUser)

//         if (!savedUser) {
//             return res.status(500).json({
//                 message: 'Server error, try again!!!'
//             })
//         }
//         const activationToken = createActivationToken(user);

//         const token = await createAccessToken(savedUser)

//         console.log(token)

//         return res.status(201).json({
//             uid: savedUser._id,
//             name: savedUser.email,
//             message: 'User created successfully',
//             token
//         })

//     } catch (error) {

//         res.status(500).json({
//             message: "Server error, try again!!!"
//         })
//     }
// }


export const signUp = async (req, res) => {

    try {
        const { email, password } = req.body

        const newUser = {
            email: email.toLowerCase(),
            password: await User.encryptPassword(password)
        }

        const activationToken = await createActivationToken(newUser);

        const activationUrl = `http://localhost:3000/activation/${activationToken}`;

        await sendMail({
            email: newUser.email,
            subject: "Activate your account",
            message: `Hello ${newUser.email}, please click on the link to activate your account: ${activationUrl}`,
        });

        return res.status(201).json({
            success: true,
            message: `please check your email:- ${newUser.email} to activate your account!`,
        })

    } catch (error) {

        res.status(500).json({
            message: "Server error, try again!!!"
        })
    }
}

export const activation = async (req, res) => {
    try {
        const { activation_token } = req.body;

        const newUserVerify = jwt.verify(
            activation_token,
            SECRET
        );
        
        if (!newUserVerify) {
            return res.status(400).json({
                message: "Invalid token"
            })
        }

        const { email, password } = newUserVerify;

        const foundUser = await User.findOne({ email });

        if (foundUser) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const newUser = await User.create({
            email,
            password,
        });

        const token = await createAccessToken(newUser)

        createCookieAccessAuth(newUser, token, 201, res)

    } catch (error) {
        res.status(500).json({
            message: "Server error, try again!!!"
        })
    }
}


export const login = async (req, res) => {
    try {

        const userFound = await User.findOne({
            email: req.body.email
        })
        
        if (!userFound) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const matchPassword = await User.comparePassword(req.body.password, userFound.password)

        if (!matchPassword)
            return res.status(203).json({
                message: 'Invalid password'
            })

        const token = await createAccessToken(userFound)

        createCookieAccessAuth(userFound, token, 200, res)

    } catch (err) {
        return res.status(500).json({
            message: 'Ocurrio un errror'
        })
    }
}

export const logout = async (req, res) => {
    try {
        createCookieLogout(res)
    } catch (err) {
        return res.status(500).json({
            message: 'Ocurrio un error'
        })
    }
}



export const refreshAccessToken = async (req, res) => {

    try {
        const { uid, email } = req

        const payLoad = {
            _id: uid,
            email
        }

        const token = await createAccessToken(payLoad)

        return res.status(200).json({
            uid: uid,
            name: email,
            token
        })

    } catch (err) {
        return res.status(500).json({
            message: err
        })
    }

}
