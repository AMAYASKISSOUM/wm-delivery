// Fonction de validation de la description

/**
 * Permet de vérifier si la description est valide (entre 10 et 500 caractères  et de type string)
 * @param {*} description
 * @returns {boolean} true si la description est valide, false sinon
 */
const isDescriptionValid = (description) =>
    typeof description === "string" &&
    description.trim().length >= 10 &&
    description.trim().length <= 500;

//fonction de validation de l'email
const isEmailValid = (email) => {
    const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
};

const isPhoneNumberValid = (phoneNumber) => {
    const phoneRegex =
        /^(\+?1[\s-]?)?(\(?[2-9][0-9]{2}\)?)[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}$/;
    return phoneRegex.test(phoneNumber);
};

export { isDescriptionValid, isEmailValid, isPhoneNumberValid };
