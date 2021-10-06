var email;
var activeCentre;
var teamNo, messageNumber;
auth.onAuthStateChanged((user) => {
    if (!user)
        location.replace("Homepage.html");
});
firebaseApp.auth().onAuthStateChanged((user) => {
    email = user.email;
    email = email.replaceAll(".", "");
    database.ref(email + "/ActiveCentre").once("value", function (snapshot) {
        activeCentre = snapshot.val();
        console.log("Working on: " + email + "/" + activeCentre);
    });
});
function contactTo(teamNumber) {
    teamNo = teamNumber;
}
function sendMessage() {
    var close = document.getElementById("closebutton");
    var error = document.getElementById("error");
    var nname = document.getElementById("name-0401").value;
    var email = document.getElementById("email-a136").value;
    var message = document.getElementById("message-3c75").value;
    nname=nname.trim();
    email=email.trim();
    message=message.trim();
    if (nname.length > 30)
        error.innerHTML = "Name too long.";
    else if (message.length > 150)
        error.innerHTML = "Message must be atmost 150 characters.";
    else if (nname == "" || email == "" || message == "")
        error.innerHTML = "Please fill all the fields.";
    else {
        var object = {
            Name: nname,
            Email: email,
            Message: message
        };
        error.innerHTML = "";
        if (teamNo == 1) {
            database.ref("Aditi Prasad/MessageNumber").once("value", function (snapshot) {
                if (snapshot.val())
                    messageNumber = snapshot.val();
                else
                    messageNumber = 0;
            }).then(() => {
                ++messageNumber;
                database.ref("Aditi Prasad/" + messageNumber).set(object);
                database.ref("Aditi Prasad/MessageNumber").set(messageNumber);
            });
        } else if (teamNo == 2) {
            database.ref("Harsh Gupta/MessageNumber").once("value", function (snapshot) {
                if (snapshot.val())
                    messageNumber = snapshot.val();
                else
                    messageNumber = 0;
            }).then(() => {
                ++messageNumber;
                database.ref("Harsh Gupta/" + messageNumber).set(object);
                database.ref("Harsh Gupta/MessageNumber").set(messageNumber);
            });
        } else {
            database.ref("Rudradeep/MessageNumber").once("value", function (snapshot) {
                if (snapshot.val())
                    messageNumber = snapshot.val();
                else
                    messageNumber = 0;
            }).then(() => {
                ++messageNumber;
                database.ref("Rudradeep/" + messageNumber).set(object);
                database.ref("Rudradeep/MessageNumber").set(messageNumber);
            });
        }
        alert("Message sent!");
        document.getElementById("name-0401").value="";
        document.getElementById("email-a136").value="";
        document.getElementById("message-3c75").value="";
        close.click();
    }
}
document.getElementById("logouta").addEventListener("click", () => {
    auth.signOut().then(() => {
        location.replace("Homepage.html");
    }).catch((error) => {
        alert("Something went wrong, please try again!");
        console.log(error);
    });
});