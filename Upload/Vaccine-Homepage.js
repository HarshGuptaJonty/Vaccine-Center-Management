var email;
var activeCentre;
firebaseApp.auth().onAuthStateChanged((user) => {
    email = user.email;
    email = email.replaceAll(".", "");
    database.ref(email + "/ActiveCentre").on("value", function (snapshot) {
        activeCentre = snapshot.val();
	console.log("Working on: " + email+"/" + activeCentre );
    });
});
auth.onAuthStateChanged((user) => {
    if (!user)
        location.replace("Homepage.html");
});
async function uploadVaccine() {
    const vname = document.getElementById("name-79a0").value.trim();
    const doseType = document.getElementById("select-ddf4").value.trim();
    const duration = document.getElementById("text-81b5").value.trim();
    if(vname.includes("#") || vname.includes("$") || vname.includes("[") || vname.includes("]") || vname.includes("."))
        document.getElementById("error").innerHTML = "Name cant include the following characters: '#', '$', '[', ']', '.'";
    else if (vname.length > 30)
        document.getElementById("error1").innerHTML = "Name too long.";
    else if (duration != null && duration < 0)
        document.getElementById("error").innerHTML = "Duration cannot be negative";
    else if (doseType === "")
        document.getElementById("error").innerHTML = "Please select number of dose";
    else if (doseType == "Double Dose" && duration<=0)
        document.getElementById("error").innerHTML = "Please enter duration";
    else if (doseType == "Single Dose" && duration>0)
        document.getElementById("error").innerHTML = "No duration required for Single Dose vaccines";
    else
        await database.ref(email + "/" + activeCentre + "/VaccineList/" + vname).once("value", function (snapshot) {
            if (snapshot.exists() && vname == snapshot.val().Name) {
                document.getElementById("error").innerHTML = "Cannot add 2 vaccine of same name";
                alert(vname + " already exists");
            } else {
                database.ref(email + "/" + activeCentre + "/VaccineList/" + vname).set({
                    Name: vname,
                    Dose: doseType,
                    Duration: duration
                });
                alert("Vaccine added successfully");
                document.getElementById("crossButton").click();
                document.getElementById("name-79a0").value = "";
                document.getElementById("select-ddf4").value = "";
                document.getElementById("text-81b5").value = "";
            }
        });
}
document.getElementById("logouta").addEventListener("click",()=>{
    auth.signOut().then(()=>{
        location.replace("Homepage.html");
    }).catch((error)=>{
        alert("Something went wrong, please try again!");
        console.log(error);
    });
});
