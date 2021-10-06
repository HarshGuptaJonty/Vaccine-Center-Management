var email;
var toggel = 0;
var error = document.getElementById("error");
var oldName;
var centreList = [];
var centreList2 = [];
var activeCentre;
auth.onAuthStateChanged((user) => {
    if (!user)
        location.replace("Homepage.html");
});
firebaseApp.auth().onAuthStateChanged((user) => {
    email = user.email;
    document.getElementById("welcomeMessage").innerHTML = "Welcome, " + email;
    document.getElementById("email-d70e").value = email;
    email = email.replaceAll(".", "");
    database.ref(email + "/ActiveCentre").once("value", function (snapshot) {
        activeCentre = snapshot.val();
        console.log("Working on: " + email + "/" + activeCentre);
        document.getElementById("name-d70e").value = activeCentre;
        oldName = activeCentre;
        updateList();
    });
});
async function updateList() {
    centreList = [];
    var ID = 0;
    await database.ref(email + "/CentreList").once("value", function (snapshot) {
        $("#centretable tr").remove();
        var name = snapshot.val();
        name.forEach(element => {
            centreList.push(element);
            centreList2.push(element.toUpperCase());
            // console.log(element);
            addItemToTable(element, ++ID);
        });
        showPage();
    });
}
function addItemToTable(centreName, ID) {
    var tbody = document.getElementById("centretable");
    var trow = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    td1.innerHTML = ID;
    td2.innerHTML = centreName;
    td1.classList.add("u-border-2");
    td1.classList.add("u-border-grey-30");
    td1.classList.add("u-border-no-left");
    td1.classList.add("u-border-no-right");
    td1.classList.add("u-table-cell");
    td2.classList.add("u-border-2");
    td2.classList.add("u-border-grey-30");
    td2.classList.add("u-border-no-left");
    td2.classList.add("u-border-no-right");
    td2.classList.add("u-table-cell");
    trow.appendChild(td1);
    trow.appendChild(td2);
    tbody.appendChild(trow);
}
document.getElementById("toggleBlock").addEventListener("click", function toggleBlock() {
    // console.log("changed");
    if (toggel == 1) {
        var pass = document.getElementById("text-4556").value.trim();
        var cpass = document.getElementById("text-8ad3").value.trim();
        if (pass !== cpass)
            error.innerHTML = "Password does not match";
        else if (cpass.length > 0 && cpass.length < 8) {
            error.innerHTML = "Password must be atleast 8 characters";
        } else {
            error.innerHTML = "";
            if (cpass.length >= 8) {
                var user = firebase.auth().currentUser;
                user.updatePassword(cpass).then(function () {
                    alert("Password Updated!");
                }).catch(function (error) {
                    error.innerHTML = error.message.replace("Firebase:", "Error, ");
                });
            }
            toggel = 0;
            document.getElementById("password").style.display = "none";
            document.getElementById("confirmPassword").style.display = "none";
            document.getElementById("toggleBlock").innerHTML = "Change Password";
            if (window.innerWidth <= 767)
                document.getElementById("table").style = "margin-top: 20px;"
            else if (window.innerWidth <= 1060)
                document.getElementById("table").style = "margin-top: 4px;"
            else
                document.getElementById("table").style = "margin-top: -165px;"
        }
    } else {
        toggel = 1;
        document.getElementById("text-4556").value = "";
        document.getElementById("password").style.display = "inline-block";
        document.getElementById("confirmPassword").style.display = "inline-block";
        document.getElementById("toggleBlock").innerHTML = "Update Password";
        if (window.innerWidth <= 767)
            document.getElementById("table").style = "margin-top: 24.5px;"
        else if (window.innerWidth <= 1060)
            document.getElementById("table").style = "margin-top: 24px;"
        else
            document.getElementById("table").style = "margin-top: -293.5px;"
    }
});
document.getElementById("logouta").addEventListener("click", () => {
    auth.signOut().then(() => {
        location.replace("Homepage.html");
    }).catch((error) => {
        alert("Something went wrong, please try again!");
        console.log(error);
    });
});
document.getElementById("onlyThis").addEventListener("click",
    function updateName() {
        var newName = document.getElementById("name-d70e").value.trim();
        if (newName.length == 0)
            alert("Center Name cannot be empty");
        else if (newName.includes("#") || newName.includes("$") || newName.includes("[") || newName.includes("]") || newName.includes("."))
            alert("Name cant include the following characters: '#', '$', '[', ']', '.'");
        else if (centreList2.includes(newName.toUpperCase()))
            alert("A center of same name already exists.");
        else if (oldName !== newName) {
            centreList[centreList.indexOf(oldName)] = newName;
            database.ref(email + "/CentreList").set(centreList);
            updateList();
            database.ref(email + "/ActiveCentre").set(newName);
            alert("Center name updated");
        }
    });
var selectedID;
var selected = false;
function searchCentre() {
    selectedID = document.getElementById("name-79a1").value.trim();
    var error = document.getElementById("error2");
    if (selectedID == "")
        error.innerHTML = "Please enter the center ID";
    else if (selectedID <= 0 || selectedID > centreList.length)
        error.innerHTML = "Invalie ID";
    else {
        error.innerHTML = "";
        selectedID = selectedID - 1;
        document.getElementById("name-79a0").value = centreList[selectedID];
        selected = true;
    }
}
var close = document.getElementById("closeButton");
function updateData() {
    var value = document.getElementById("name-79a0").value.trim();
    var error = document.getElementById("error2");
    if (!selected)
        error.innerHTML = "Please search a center with its respective ID";
    else if (value.includes("#") || value.includes("$") || value.includes("[") || value.includes("]") || value.includes("."))
        error.innerHTML = "Name cant include the following characters: '#', '$', '[', ']', '.'";
    else if (centreList2.includes(value.toUpperCase()))
        error.innerHTML = "A center of same name already exists.";
    else {
        database.ref(email + "/CentreList/" + selectedID).set(value);
        if (centreList[selectedID] == oldName) {
            oldName = value;
            document.getElementById("name-d70e").value = value;
            database.ref(email + "/ActiveCentre").set(value);
        }
        // console.log("Going to: " + email + "/" + centreList[selectedID]);
        database.ref(email + "/" + centreList[selectedID]).once("value", function (snapshot) {
            database.ref(email + "/" + value).set(snapshot.val());
        }).then(() => {
            database.ref(email + "/" + centreList[selectedID]).remove();
            close.click();
            updateList();
            alert("Center details updated");
        });
    }
}
function removeData() {
    var error = document.getElementById("error2");
    if (!selected)
        error.innerHTML = "Please search a center with its respective ID";
    else if (selectedID < 0 || selectedID >= centreList.length)
        error.innerHTML = "Invalid ID";
    else {
        if (centreList[selectedID] == oldName) {
            alert("You cannot delete the active center, please change the active center then try again!");
        } else {
            if (!confirm("Deleting center will erase all data of the selected center.\nAre you sure?"))
                close.click();
            else {
                database.ref(email + "/" + centreList[selectedID]).remove();
                centreList.splice(selectedID, 1);
                database.ref(email + "/CentreList").set(centreList);
                close.click();
                updateList();
                alert("Center removed");
            }
        }
    }
}
function modelOn() {
    selected = false;
    document.getElementById("name-79a1").value = "";
    document.getElementById("name-79a0").value = "";
}
document.getElementById("name-79a0").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        updateData();
    }
});
document.getElementById("name-79a1").addEventListener("keyup", function (event) {
    if (event.keyCode === 13)
        searchCentre()
});
document.getElementById("name-d70e").addEventListener("keyup", function (event) {
    if (event.keyCode === 13)
        document.getElementById("onlyThis").click();
});