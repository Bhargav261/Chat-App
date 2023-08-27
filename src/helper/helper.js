
export function storeUserDetails(userDetails) {
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
}

export function getUserDetails() {
    return JSON.parse(localStorage.getItem('userDetails'));
}

export const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
};

export const firstCharacter = (name) => {
    console.log("name: - ", name);
    return name.charAt(0).toUpperCase()
}