import { Router } from "express";
import passport from "passport";
import authorize from "./middlewares/authorize.js";
import { isDescriptionValid } from "./middlewares/validation.js";
import { addUser, getUserById } from "./model/user.js";
import { getColis, getColisByLivreur, addColis, updateStatutColis, deleteColis } from "./model/colis.js";
import { getRoutes, addRoute, updateRoute, deleteRoute } from "./model/route.js";
import { getStops, getStopsByRoute, addStop, deleteStop } from "./model/stop.js";
import { getPaiements, getPaiementsByLivreur, addPaiement } from "./model/paiement.js";
import { getCandidatures, addCandidature, updateStatutCandidature } from "./model/candidature.js";
import { prisma } from "./lib/prisma.js";

const router = Router();

// ─── SSE ────────────────────────────────────────────────
router.get("/stream", (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Non autorisé" });
    res.initStream();
});

// ─── PAGES ──────────────────────────────────────────────
router.get("/", (req, res) => {
    res.render("index", {
        styles: ["/css/style.css"],
        scripts: ["/js/main.js"],
        title: "Accueil",
        user: req?.session?.user,
        isAdmin: req?.session?.user?.role === "admin",
    });
});

router.get("/dashboard", authorize(), async (req, res) => {
    const colis = await getColisByLivreur(req.session.user.id);
    const paiements = await getPaiementsByLivreur(req.session.user.id);
    res.render("dashboard", {
        styles: ["/css/style.css", "/css/dashboard.css"],
        scripts: ["/js/dashboard.js"],
        title: "Mon tableau de bord",
        user: req.session.user,
        isAdmin: req.session.user.role === "admin",
        colis,
        paiements,
    });
});

router.get("/inscription", (req, res) => {
    res.render("inscription", {
        styles: ["/css/style.css", "/css/inscription.css"],
        scripts: ["/js/inscription.js"],
        title: "Inscription",
    });
});

router.get("/connexion", (req, res) => {
    res.render("connexion", {
        styles: ["/css/style.css", "/css/connexion.css"],
        scripts: ["/js/connexion.js"],
        title: "Connexion",
    });
});

router.get("/admin", authorize("admin"), async (req, res) => {
    const candidatures = await getCandidatures();
    const employes = await prisma.user.findMany({ where: { role: "employe" } });
    const colis = await getColis();
    const routes = await getRoutes();
    const paiements = await getPaiements();
    res.render("admin", {
        styles: ["/css/style.css", "/css/dashboard.css"],
        scripts: ["/js/admin.js"],
        title: "Administration",
        user: req.session.user,
        isAdmin: true,
        candidatures,
        employes,
        colis,
        routes,
        paiements,
    });
});

// ─── AUTH ────────────────────────────────────────────────
router.post("/api/add-user", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const user = await addUser(email, password, name);
        res.status(201).json({ user, message: "Utilisateur ajouté avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'ajout de l'utilisateur", errorMessage: error.message });
    }
});

router.post("/api/connexion", (req, res, next) => {
    passport.authenticate("local", (error, user, info) => {
        if (error) return next(error);
        if (!user) return res.status(401).json(info);
        req.logIn(user, (error) => {
            if (error) return next(error);
            req.session.user = { id: user.id, email: user.email, name: user.name, role: user.role };
            res.status(200).json({ message: "Connexion réussie", user: req.session.user });
        });
    })(req, res, next);
});

router.post("/api/deconnexion", (req, res, next) => {
    req.logOut((err) => {
        if (err) return next(err);
        res.status(200).end();
    });
});

// ─── API CANDIDATURES ────────────────────────────────────
router.get("/api/candidatures", authorize("admin"), async (req, res) => {
    try {
        res.status(200).json(await getCandidatures());
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post("/api/candidatures", async (req, res) => {
    try {
        const { nom, email, cv } = req.body;
        const c = await addCandidature(nom, email, cv);
        res.status(201).json(c);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.patch("/api/candidatures/:id", authorize("admin"), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { statut } = req.body;
        const c = await updateStatutCandidature(id, statut);
        res.status(200).json(c);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ─── API EMPLOYÉS ─────────────────────────────────────────
router.get("/api/employes", authorize("admin"), async (req, res) => {
    try {
        const employes = await prisma.user.findMany({ where: { role: "employe" } });
        res.status(200).json(employes);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.patch("/api/employes/:id", authorize("admin"), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { actif } = req.body;
        const employe = await prisma.user.update({ where: { id }, data: { actif } });
        res.status(200).json(employe);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ─── API COLIS ───────────────────────────────────────────
router.get("/api/colis", authorize("admin"), async (req, res) => {
    try {
        res.status(200).json(await getColis());
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get("/api/mes-colis", authorize(), async (req, res) => {
    try {
        res.status(200).json(await getColisByLivreur(req.session.user.id));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post("/api/colis", authorize("admin"), async (req, res) => {
    try {
        const { description, livreurId, stopId } = req.body;
        const c = await addColis(description, livreurId, stopId);
        res.status(201).json(c);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.patch("/api/colis/:id", authorize("admin"), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { statut, causeRetour } = req.body;
        const c = await updateStatutColis(id, statut, causeRetour);
        res.status(200).json(c);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.delete("/api/colis/:id", authorize("admin"), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await deleteColis(id);
        res.status(200).json({ message: "Colis supprimé" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ─── API ROUTES ──────────────────────────────────────────
router.get("/api/routes", authorize(), async (req, res) => {
    try {
        res.status(200).json(await getRoutes());
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post("/api/routes", authorize("admin"), async (req, res) => {
    try {
        const { nom } = req.body;
        const r = await addRoute(nom);
        res.status(201).json(r);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.delete("/api/routes/:id", authorize("admin"), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await deleteRoute(id);
        res.status(200).json({ message: "Route supprimée" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ─── API STOPS ───────────────────────────────────────────
router.get("/api/stops", authorize(), async (req, res) => {
    try {
        res.status(200).json(await getStops());
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post("/api/stops", authorize("admin"), async (req, res) => {
    try {
        const { adresse, ordre, routeId } = req.body;
        const s = await addStop(adresse, ordre, routeId);
        res.status(201).json(s);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.delete("/api/stops/:id", authorize("admin"), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await deleteStop(id);
        res.status(200).json({ message: "Stop supprimé" });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ─── API PAIEMENTS ───────────────────────────────────────
router.get("/api/paiements", authorize("admin"), async (req, res) => {
    try {
        res.status(200).json(await getPaiements());
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get("/api/mes-paiements", authorize(), async (req, res) => {
    try {
        res.status(200).json(await getPaiementsByLivreur(req.session.user.id));
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post("/api/paiements", authorize("admin"), async (req, res) => {
    try {
        const { montant, livreurId, periode } = req.body;
        const p = await addPaiement(montant, livreurId, periode);
        res.status(201).json(p);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ─── 404 ─────────────────────────────────────────────────
export default router;