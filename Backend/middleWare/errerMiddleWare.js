const errorHandler = (err, req, res, next) => {

    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode)

    res.json({
        message: err.message,
        stack:  process.env.NODE_ENV==="development" ? err.stack : null
    })

  /*   if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({message: "The user is not authorized"})
    }

    if (err.name === 'ValidationError') {
        //  validation error
        return res.status(401).json({message: err})
    }

    // default to 500 server error
    return res.status(500).json(err);0
     */
};


module.exports = errorHandler;
