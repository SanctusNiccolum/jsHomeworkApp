const UserNamespase = {
    currentUser: null,

    loginUser() {
        console.log(`User "${this.currentUser}" logged in`);
    },
    logoutUser(){
        console.log(`User "${this.currentUser}" logged out`)
    },
    getCurrentUser(){
        return this.currentUser;
    }
}

export default UserNamespase;