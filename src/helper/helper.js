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
    return new Date(timestamp).toLocaleString();
};

//Return the first Character
export const firstCharacter = (name) => {
    console.log("name: - ", name);
    return name.charAt(0).toUpperCase()
}