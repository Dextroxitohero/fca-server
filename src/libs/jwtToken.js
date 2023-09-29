export const createCookieAccessAuth = (user, token, statusCode, res) => {

    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "none",
        secure: true,
    };

    return res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user: user,
        token,
    });
    
}

export const createCookieLogout = (res) => {
    const options = {
        expires: new Date(Date.now() + 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "none",
        secure: true,
    };

    return res.status(200).cookie("token", 'none', options).json({
        success: true,
        message: 'User logged out successfully',

    });
}