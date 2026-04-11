require("dotenv").config();
const jwt = require("jsonwebtoken");

async function autenticar(req, res, next) {
    const auth = req.headers.authorization;
    if(!auth) {
        throw new Error("Não possui token");
    }

    const [,token] = auth.split(" ");
    
    try {
        jwt.verify(token, process.env.JWT_KEY,
            (error, decoded) => {
                if(error) {
                    throw new Error("Token inválido" + error.message);
                } else {
                    req.id = decoded.id;
                    req.role = decoded.role;
                    next();
                }
            });
    } catch (error) {
        res.status(401).json({ message: error.message }); 
    }
}

module.exports = autenticar;
