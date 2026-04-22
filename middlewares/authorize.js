const authorize = (role) => {
    return (req, res, next) => {
        if (!req.session.user) {
            res.redirect("/connexion");
            return;
        }
        if (role && req.session.user.role !== role) {
            return res.status(403).json({ message: "Accès refusé" });
        }
        next();
    };
};

export default authorize;
