import User from '../models/User'
import jwt from 'jsonwebtoken';

import { createActivationToken, createAccessTokenForgotPasswordEmail } from '../libs/creationWebToken';
import { createCookieAccessAuth, createCookieLogout } from '../libs/jwtToken';
import { sendMail } from '../libs/sendMail';
import { BASE_URL_DEV, BASE_URL_PRODUCTION } from '../config'

export const signUp = async (req, res) => {
    try {
        const { email, password } = req.body

        const newUser = {
            email: email.toLowerCase(),
            password: await User.encryptPassword(password)
        }

        const activationToken = await createActivationToken(newUser);

        const activationUrl = `${BASE_URL_PRODUCTION}${activationToken}`;

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

export const forgotPasswordEmail = async (req, res) => {
    try {
        const { email } = req.body;

        const foundUser = await User.findOne({ email });

        if (!foundUser) {
            return res.status(400).json({
                message: "El email no esta registrado"
            })
        }

        const token = await createAccessTokenForgotPasswordEmail(email)

        const changePassword = `${BASE_URL_PRODUCTION}/forget-password/${token}`;

        await sendMail({
            email: email,
            subject: "Recuperar contraseña",
            message: `Para generar una nueva contrasena del correo electronico ${email}, da click en el siguiente enlace: ${changePassword}`,
        });

        return res.status(201).json({
            success: true,
            message: `Por favor revisa tu correo electronico:- ${email} para recuperar tu contrasena!`,
        })

    } catch (error) {
        res.status(500).json({
            message: "Server error, try again!!!"
        })
    }
}

export const updatedPassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const foundUser = await User.findOne({ email });

        if (!foundUser) {
            return res.status(400).json({
                message: "El correo electrinico no esta registrado"
            })
        }

        const passwordHash = await User.encryptPassword(password)

        await User.findOneAndUpdate({ email }, {
            password: passwordHash
        })

        await sendMail({
            email: email,
            subject: "Actualizacion contraseña",
            message: `Tu contraseña se actualizo correctamente. Tu nueva es: ${password} `,
        });

        return res.status(201).json({
            success: true,
            message: `La contraseña se actualizo correctamente`,
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


// export const login = async (req, res) => {
//     try {
//         const { email, password } = (req.body)
//         const foundUser = await User.findOne({ email })

//         if (!foundUser) {
//             return res.status(404).json({
//                 message: 'El correo electronico no esta registrado'
//             })
//         }


//         const matchPassword = await User.comparePassword(password, foundUser.password)


//         if (!matchPassword)
//             return res.status(203).json({
//                 message: 'La contraseña es incorrecta'
//             })

//         const token = await createAccessToken(foundUser)

//         console.log(token)
//         createCookieAccessAuth(foundUser, token, 200, res)

//     } catch (err) {
//         return res.status(500).json({
//             message: 'Ocurrio un errror'
//         })
//     }
// }

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

// export const login = async (req, res) => {
//     const cookies = req.cookies;

//     const { email, password } = (req.body)
//     const foundUser = await User.findOne({ email })

//     if (!foundUser) {
//         return res.status(404).json({
//             message: 'El correo electronico no esta registrado'
//         })
//     }


//     const matchPassword = await User.comparePassword(password, foundUser.password)


//     if (!matchPassword)
//         return res.status(203).json({
//             message: 'La contraseña es incorrecta'
//         })


//     if (matchPassword) {
//         const roles = Object.values(foundUser.roles).filter(Boolean);
//         // create JWTs
//         const accessToken = jwt.sign(
//             {
//                 "UserInfo": {
//                     "email": foundUser.email,
//                     "roles": roles
//                 }
//             },
//             ACCESS_TOKEN_SECRET,
//             { expiresIn: '60s' }
//         );
//         const newRefreshToken = jwt.sign(
//             { "email": foundUser.email },
//             REFRESH_TOKEN_SECRET,
//             { expiresIn: '120s' }
//         );

//         // Changed to let keyword
//         let newRefreshTokenArray =
//             !cookies?.jwt
//                 ? foundUser.refreshToken
//                 : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

//         if (cookies?.jwt) {
//             const refreshToken = cookies.jwt;
//             const foundToken = await User.findOne({ refreshToken }).exec();

//             // Detected refresh token reuse!
//             if (!foundToken) {
//                 // clear out ALL previous refresh tokens
//                 newRefreshTokenArray = [];
//             }

//             res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
//         }

//         // Saving refreshToken with current user
//         foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
//         const updatedUpdate = await foundUser.save();
//         const { _id, firstName, lastName, email } = updatedUpdate;
//         const user = { _id, firstName, lastName, email };
//         // Creates Secure Cookie with refresh token
//         res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

//         // Send authorization roles and access token to user
//         // res.json({ roles, accessToken });
//         res.json({ user, roles, accessToken });

//     } else {
//         res.sendStatus(401);
//     }
// }



// export const refreshToken = async (req, res) => {
//     const cookies = req.cookies;
//     if (!cookies?.jwt) return res.sendStatus(401);
//     const refreshToken = cookies.jwt;
//     res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

//     const foundUser = await User.findOne({ refreshToken }).exec();
//     // console.log(foundUser)
//     // Detected refresh token reuse!


//     if (!foundUser) {
//         jwt.verify(
//             refreshToken,
//             REFRESH_TOKEN_SECRET,
//             async (err, decoded) => {
//                 if (err) return res.sendStatus(403); //Forbidden
//                 // Delete refresh tokens of hacked user
//                 const hackedUser = await User.findOne({ email: decoded.email }).exec();
//                 hackedUser.refreshToken = [];
//                 const result = await hackedUser.save();
//             }
//         )
//         return res.sendStatus(403); //Forbidden
//     }

//     const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

//     jwt.verify(
//         refreshToken,
//         REFRESH_TOKEN_SECRET,
//         async (err, decoded) => {
//             if (err) {
//                 // expired refresh token
//                 foundUser.refreshToken = [...newRefreshTokenArray];
//                 const result = await foundUser.save();
//             }
//             if (err || foundUser.email !== decoded.email) return res.sendStatus(403);

//             // Refresh token was still valid
//             const roles = Object.values(foundUser.roles);

//             const accessToken = jwt.sign(
//                 {
//                     "UserInfo": {
//                         "email": decoded.email,
//                         "roles": roles
//                     }
//                 },
//                 ACCESS_TOKEN_SECRET,
//                 { expiresIn: '120s' }
//             );

//             const newRefreshToken = jwt.sign(
//                 { "email": foundUser.email },
//                 REFRESH_TOKEN_SECRET,
//                 { expiresIn: '180s' }
//             );
//             // Saving refreshToken with current user
//             foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
//             const updatedUpdate = await foundUser.save();
//             const { _id, firstName, lastName, email } = updatedUpdate;
//             const user = { _id, firstName, lastName, email };

//             // Creates Secure Cookie with refresh token
//             res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

//             res.json({ user, roles, accessToken })
//         }
//     );
// }

export const login = async (req, res) => {
    const { email, password } = req.body;

    // Validar que se proporcionen email y password
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Buscar al usuario por email en la base de datos
        const foundUser = await User.findOne({ email }).exec();

        // Validar que el usuario exista y la contraseña sea correcta
        // if (!user || !bcrypt.compareSync(password, user.password)) {
        //     return res.status(401).json({ error: 'Invalid email or password' });
        // }

        const matchPassword = await User.comparePassword(password, foundUser.password)
        if (!matchPassword)
            return res.status(203).json({
                message: 'La contraseña es incorrecta'
            })

        const roles = Object.values(foundUser.roles).filter(Boolean);
        // Generar un token de acceso
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": foundUser.email,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '120s' }
        );

        // Generar un refresh token
        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '180s' }
        );

        // Almacenar el refresh token en la base de datos (si es necesario)

        // Configurar la cookie con el refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        const user = { _id: foundUser._id, firstName: foundUser.firstName, lastName: foundUser.lastName, email: foundUser.email };

        // Enviar la respuesta con el token de acceso y cualquier otra información necesaria
        res.json({ user ,accessToken, roles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



export const refreshToken = async (req, res) => {
    console.log('refresh----Token')
    const cookies = req.cookies;
    const refreshToken = cookies.jwt;
    console.log(refreshToken)
    // Validar que se proporcione un refresh token
    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token not provided' });
    }

    try {
        // Verificar el refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log(decoded.email)
        // Buscar al usuario por username en la base de datos
        const foundUser = await User.findOne({ email: decoded.email }).exec();

        // Validar que el usuario exista
        if (!foundUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        const roles = Object.values(foundUser.roles).filter(Boolean);
        // Generar un nuevo token de acceso
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": foundUser.email,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '120s' }
        );

        // Generar un nuevo refresh token
        const newRefreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '180s' }
        );

        // Configurar la cookie con el nuevo refresh token
        res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        const user = { _id: foundUser._id, firstName: foundUser.firstName, lastName: foundUser.lastName, email: foundUser.email };

        // Enviar la respuesta con el nuevo token de acceso y cualquier otra información necesaria
        res.json({ user: foundUser ,accessToken, roles });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};

