document.addEventListener("DOMContentLoaded", () => {
    const badges = document.querySelectorAll("#colis-body .statut-badge");

    let livres = 0, enCours = 0, retournes = 0;

    badges.forEach(badge => {
        const statut = badge.classList[1];
        if (statut === "statut-livre") livres++;
        else if (statut === "statut-en_cours") enCours++;
        else if (statut === "statut-retourne") retournes++;
    });

    document.getElementById("nb-livres").textContent = livres;
    document.getElementById("nb-en-cours").textContent = enCours;
    document.getElementById("nb-retournes").textContent = retournes;
});

async function seDeconnecter() {
    await fetch("/api/deconnexion", { method: "POST" });
    window.location.href = "/";
}