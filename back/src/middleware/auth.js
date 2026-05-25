require("dotenv").config();
const jwt = require("jsonwebtoken");

async function autenticar(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) {
        return res.status(401).json({ message: "Não possui token" });
    }

    const [, token] = auth.split(" ");
    if (!token) {
        return res.status(401).json({ message: "Token ausente" });
    }

    jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: "Token inválido" });
        }

        req.id = decoded.id;
        req.role = decoded.role;
        next();
    });
}

module.exports = autenticar;
