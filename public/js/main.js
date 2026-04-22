const deconnexionButton = document.getElementById("deconnexion");

if (deconnexionButton) {
    deconnexionButton.addEventListener("submit", async (event) => {
        event.preventDefault();
        console.log("Déconnexion...");
        try {
            const response = await fetch("/api/deconnexion", {
                method: "POST",
            });
            if (response.ok) {
                window.location.href = "/";
            } else {
                console.error("Erreur lors de la déconnexion");
            }
        } catch (error) {
            console.error("Erreur lors de la déconnexion :", error);
        }
    });
}
