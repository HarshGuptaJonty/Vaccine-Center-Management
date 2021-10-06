var email;
var select = document.getElementById("select-f76e");
var activeCentre;
var canGoAhead=false;
firebaseApp.auth().onAuthStateChanged((user) => {
    email = user.email;
    email = email.replaceAll(".", "");
    database.ref(email + "/ActiveCentre").on("value", function (snapshot) {
        activeCentre = snapshot.val();
        getAllData();
    });
});
var centreList = [];
async function getAllData() {
    console.log("Working on: " + email+"/" + activeCentre );
    $("#select-f76e").empty();
    await database.ref(email + "/CentreList").once("value", function (snapshot) {
        var name = snapshot.val();
        if (name != null){
            name.forEach(element => {
                centreList.push(element);
                let option = document.createElement("option");
                option.value = element;
                option.text = element;
                select.add(option);
            });
            canGoAhead=true;
            document.getElementById("error").innerHTML = "";
        } else
            document.getElementById("error").innerHTML = "No center found, please create new one";
            showPage();
    });
}
function proceed() {
    var centerSelected = document.getElementById("select-f76e").value;
    if(centreList.length==0)
        document.getElementById("error").innerHTML = "No center found, please create new one";
    else if(!canGoAhead)
        document.getElementById("error").innerHTML = "Please wait until we fetch your center details.";
    else if (centerSelected == "")
        document.getElementById("error").innerHTML = "Please select a center from the list or create new one";
    else {
        location.replace("Dashboard.html");
        database.ref(email + "/ActiveCentre").set(centerSelected);
    }
}
document.getElementById("logout").addEventListener("click", () => {
    auth.signOut().then(()=>{
        location.replace("Homepage.html");
    }).catch((error)=>{
        alert("Something went wrong, please try again!");
        console.log(error);
    });
});
function addNewCentre() {
    console.log("New Project created successfully");
    var newName = document.getElementById("phone-61be").value;
    newName=newName.trim();
    if (newName == "")
        document.getElementById("error2").innerHTML = "Please enter a name.";
    else if (newName.length>30)
        document.getElementById("error2").innerHTML = "Name Too Long.";
    else if (centreList.includes(newName))
        document.getElementById("error2").innerHTML = "A center of same already exists.";
    else {
        document.getElementById("error2").innerHTML = "";
        document.getElementById("error").innerHTML = "";
        document.getElementById("phone-61be").value = "";
        centreList.push(newName);
        database.ref(email + "/CentreList").set(centreList);
        let option = document.createElement("option");
        option.value = newName;
        option.text = newName;
        select.add(option);
        canGoAhead=true;
        document.getElementById("closeButton").click();
        alert("New Center is added to your project");
    }
}