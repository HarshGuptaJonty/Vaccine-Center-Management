var email, password;
loginButton = document.getElementById("loginButton");
function readyForLogin() {
    email = document.getElementById("email-a136").value.trim();
    password = document.getElementById("text-d7f9").value.trim();
}
function readyForSignUp() {
    email = document.getElementById("email-a1360").value.trim();
    password = document.getElementById("text-47c2").value.trim();
}
auth.onAuthStateChanged((user) => {
    if (user)
        location.replace("HTML/Select-Centre.html");
    else{
        console.log("No user found");
        showPage();
    }
});
function loginUser() {
    readyForLogin();
    if (email == "") {
        document.getElementById("error").innerHTML = "Please enter email";
    } else if (password == "") {
        document.getElementById("error").innerHTML = "Please enter password";
    } else {
        document.getElementById("error").innerHTML = "";
        console.log(email, password);
        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                document.getElementById("closeButton").click();
                document.getElementById("error").innerHTML = "";
                // location.replace("Dashboard.html");
                location.replace("Select-Centre.html");
            })
            .catch((error) => {
                document.getElementById("error").innerHTML = error.message;
            });
    }
}
function signupUser() {
    readyForSignUp();
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById("closeButton2").click();
            document.getElementById("error2").innerHTML = "";
            // location.replace("Dashboard.html");
            location.replace("Select-Centre.html");
        })
        .catch((error) => {
            document.getElementById("error2").innerHTML = error.message;
        });
}
function forgetPassword() {
    readyForLogin();
    if (email == "") {
        document.getElementById("error").innerHTML = "Please enter email";
    } else {
        document.getElementById("error").innerHTML = "";
        auth.sendPasswordResetEmail(email)
            .then(() => {
                alert("Password reset link sent to your email id");
                document.getElementById("error").innerHTML = "";
            })
            .catch((error) => {
                document.getElementById("error").innerHTML = error.message.replace("Firebase:", "Error,");
            });
    }
}
document.getElementById("text-d7f9").addEventListener("keyup", function (event) {
    if (event.keyCode === 13)
        loginUser();
});
document.getElementById("email-a136").addEventListener("keyup", function (event) {
    if (event.keyCode === 13)
        loginUser();
});
document.getElementById("text-47c2").addEventListener("keyup", function (event) {
    if (event.keyCode === 13)
        signupUser();
});
document.getElementById("togglePassword1").addEventListener("click",function(event){
    var password =document.getElementById("text-47c2");
    const type=password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    this.classList.toggle('fa-eye-slash');
});
document.getElementById("togglePassword2").addEventListener("click",function(event){
    var password =document.getElementById("text-d7f9");
    const type=password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    this.classList.toggle('fa-eye-slash');
});