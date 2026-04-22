const formulaire = document.getElementById("inscription");

const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        const data = {
            email: formulaire.email.value,
            password: formulaire.password.value,
            name: formulaire.name.value,
        };

        const response = await fetch("/api/add-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Utilisateur ajouté : ", result.user);
            alert(result.message);
        } else {
            const error = await response.json();
            console.error("Erreur lors de l'ajout de l'utilisateur : ", error);
            alert("Erreur lors de l'ajout de l'utilisateur");
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur : ", error);
        alert("Erreur lors de l'ajout de l'utilisateur");
    }
};

formulaire.addEventListener("submit", handleSubmit);
