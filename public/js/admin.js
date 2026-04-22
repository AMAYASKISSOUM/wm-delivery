// Changer d'onglet
function showTab(name, btn) {
    document.querySelectorAll(".tab-pane").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.getElementById("tab-" + name).classList.add("active");
    btn.classList.add("active");
}

// Déconnexion
async function seDeconnecter() {
    await fetch("/api/deconnexion", { method: "POST" });
    window.location.href = "/";
}

// Candidatures
async function updateCandidature(id, statut) {
    await fetch(`/api/candidatures/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut })
    });
    location.reload();
}

// Employés
async function toggleEmploye(id, actifActuel) {
    await fetch(`/api/employes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actif: !actifActuel })
    });
    location.reload();
}

// Colis
async function addColis() {
    const description = document.getElementById("colis-description").value.trim();
    if (!description) return alert("Entre une description.");
    await fetch("/api/colis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description })
    });
    location.reload();
}

async function deleteColis(id) {
    if (!confirm("Supprimer ce colis ?")) return;
    await fetch(`/api/colis/${id}`, { method: "DELETE" });
    location.reload();
}

// Routes
async function addRoute() {
    const nom = document.getElementById("route-nom").value.trim();
    if (!nom) return alert("Entre un nom de route.");
    await fetch("/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom })
    });
    location.reload();
}

async function deleteRoute(id) {
    if (!confirm("Supprimer cette route ?")) return;
    await fetch(`/api/routes/${id}`, { method: "DELETE" });
    location.reload();
}