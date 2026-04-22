const formulaire = document.getElementById("formulaire");

const connexion = async (event) => {
    event.preventDefault();
    try {
        const data = {
            email: formulaire.email.value,
            password: formulaire.password.value,
        };

        try {
            const response = await fetch("/api/connexion", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                // Rediriger vers le tableau de bord ou une autre page après la connexion réussie
                window.location.href = "/dashboard";
            } else {
                const error = await response.json();
                console.error("Erreur lors de la connexion : ", error);
                alert("Erreur lors de la connexion");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
        }
    } catch (error) {
        console.error("Erreur lors de la soumission du formulaire :", error);
    }
};

formulaire.addEventListener("submit", connexion);
