import User from '../models/User'

export const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    const email = await User.findOne({ email: req.body.email.toLowerCase() })

    if (email){
        return res.status(202).json({
            message: 'The email already exist'
        })
    }
    next()
}

export const existsEmail = async (req, res, next) => {
    const email = await User.findOne({ email: req.body.email.toLowerCase() })

    if (!email){
        return res.status(202).json({
            message: 'The email no exist'
        })
    }
    next()
}

export const checkPassword = async (req, res, next) => {
    if (req.body.password.length <= 5) {

        return res.status(202).json({
            message: 'Password no valid'
        })
    } else {
        next()
    }
}