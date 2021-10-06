var select = document.getElementById("select-45ff");
var email;
var activeCentre;
firebaseApp.auth().onAuthStateChanged((user) => {
    email = user.email;
    email = email.replaceAll(".", "");
    database.ref(email + "/ActiveCentre").on("value", function (snapshot) {
        activeCentre = snapshot.val();
        console.log("Working on: " + email + "/" + activeCentre);
        refreshVaccineSelect();
    });
});
auth.onAuthStateChanged((user) => {
    if (!user)
        location.replace("Homepage.html");
});
function refreshVaccineSelect() {
    $("#select-45ff").empty();
    database.ref(email + "/" + activeCentre + "/VaccineList").once("value", function (allrecord) {
        allrecord.forEach(function (currentrecord) {
            var vname = currentrecord.val().Name;
            let option = document.createElement("option");
            option.text = vname;
            select.add(option);
        });
        showPage();
    });
}
function uploadClient() {
    console.log("Client Uploaded");
    const nname = document.getElementById("name-5dbe").value;
    const phone = document.getElementById("phone-61be").value;
    const vaccineName = document.getElementById("select-45ff").value;
    nname.trim();
    phone.trim();
    vaccineName.trim();
    if (nname == "" || phone == "" || vaccineName == "")
        document.getElementById("error").innerHTML = "Please fill all the required fields";
    else if (phone.length != 10)
        document.getElementById("error").innerHTML = "Invalid Phone Number.";
    else if (nname.length > 30)
        document.getElementById("error").innerHTML = "Name too long.";
    else {
        document.getElementById("error").innerHTML = "";
        database.ref(email + "/" + activeCentre + "/ClientList/" + phone).once("value", function (snapshot) {
            // if(snapshot.exists())
            if (snapshot.exists() && phone == snapshot.val().Phone) {
                document.getElementById("error").innerHTML = "Cannot add 2 client on same phone number";
                // console.log(phone, snapshot.val().Phone);
                // alert(phone + " already exists");
            } else {
                database.ref(email + "/" + activeCentre + "/ClientList/" + phone).set({
                    Name: nname,
                    Phone: phone,
                    First: "No Data",
                    Second: "No Data",
                    Vaccine: vaccineName
                });
                alert("Client added successfully");
                document.getElementById("crossButton").click();
                document.getElementById("name-5dbe").value = "";
                document.getElementById("phone-61be").value = "";
                document.getElementById("select-45ff").value = "";
            }
        });
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