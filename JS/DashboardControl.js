var email;
firebaseApp.auth().onAuthStateChanged((user) => {
    email = user.email;
    email = email.replaceAll(".", "");
    console.log("Working on: "+email);
});
auth.onAuthStateChanged((user) => {
    if (!user)
        location.replace("Homepage.html");
});
function logout(){
    auth.signOut().then(()=>{
        location.replace("Homepage.html");
    }).catch((error)=>{
        alert("Something went wrong, please try again!");
        console.log(error);
    });
}
document.getElementById("logouta").addEventListener("click",()=>{
    logout();
});