//set Data in localstorage
export function storeUserDetails(userDetails) {
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
}

//Get User Data from localstorage
export function getUserDetails() {
    return JSON.parse(localStorage.getItem('userDetails'));
}

//Format the Date
export const formatDate = (timestamp) => {
    const now = new Date(timestamp);
    const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = now.toLocaleDateString(undefined, dateOptions);
    const formattedTime = now.toLocaleTimeString(undefined, options);

    return formattedDate + " " + formattedTime.toUpperCase()
};

//Return the first Character
export const firstCharacter = (name) => {

    const words = name.split(" ");
    const firstCharacters = words.map(word => word[0]);

    return firstCharacters.join("");
}