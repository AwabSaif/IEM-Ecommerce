// Error handler middleware function
const errorHandler = (err, req, res, next) => {
    // Determine status code from response or default to 500
    const statusCode = res.statusCode ? res.statusCode : 500;
    // Set response status code
    res.status(statusCode);
    
    // Send JSON response with error message and stack trace (if in development mode)
    res.json({
        message: err.message, // Error message
        stack: process.env.NODE_ENV === "development" ? err.stack : null // Stack trace (if in development mode)
    });
};

// Export the errorHandler middleware function
module.exports = errorHandler;
