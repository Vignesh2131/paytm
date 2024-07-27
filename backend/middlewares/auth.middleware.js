const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");
const authMiddleware = async (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(404).json({message:"No token"});
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.userId;
        
        next();
    } catch (err) {
        res.status(403).json({message:"Token error"})
    }
};

module.exports = authMiddleware ;
