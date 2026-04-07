async function adminAuth(req, res, next) {
    try {
        if (req.role !== 'admin') {
            return res.status(403).json({ 
                message: "Acesso negado. Esta operação exige privilégios de administrador."
            });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Erro ao verificar permissões." });
    }
}

module.exports = adminAuth;