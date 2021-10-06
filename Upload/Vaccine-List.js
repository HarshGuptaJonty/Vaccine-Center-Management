var email;
var activeCentre;
var centerList = [];
firebaseApp.auth().onAuthStateChanged((user) => {
    email = user.email;
    email = email.replaceAll(".", "");
    database.ref(email + "/ActiveCentre").once("value", function (snapshot) {
        activeCentre = snapshot.val();
        getAllData();
        loadImportList();
    });
});
auth.onAuthStateChanged((user) => {
    if (!user)
        location.replace("Homepage.html");
});
var ID = 0;
var vaccinearr = [];
async function getAllData() {
    ID = 0;
    vaccinearr = [];
    $("#vaccineTable tr").remove();
    console.log("Working on: " + email + "/" + activeCentre);
    await database.ref(email + "/" + activeCentre + "/VaccineList").once("value", function (allrecord) {
        allrecord.forEach(function (currentrecord) {
            var vname = currentrecord.val().Name;
            var doseType = currentrecord.val().Dose;
            var duration = currentrecord.val().Duration;
            var vaccine = { Name: vname, Dose: doseType, Duration: duration };
            vaccinearr.push(vaccine);
            addItemsToTable(vname, duration, doseType, ++ID);
        });
        if (ID == 0)
            alert("No vaccine to show!");
        showPage();
    });
}
async function loadImportList() {
    centerList = [];
    var select = document.getElementById("select-cdd9");
    $("#select-cdd9").empty();
    await database.ref(email + "/CentreList").once("value", function (snapshot) {
        var name = snapshot.val();
        if (name != null) {
            name.forEach(element => {
                if (element != activeCentre) {
                    centerList.push(element);
                    let option = document.createElement("option");
                    option.value = element;
                    option.text = element;
                    select.add(option);
                }
            });
            document.getElementById("error2").innerHTML = "";
        } else
            document.getElementById("error2").innerHTML = "Failed to get center list from database, please contact the support.";
        if (centerList.length == 0)
            document.getElementById("error2").innerHTML = "You have only one center, cannot import vaccines.";
    });
}
function addItemsToTable(vname, duration, dose, ID) {
    var tbody = document.getElementById("vaccineTable");
    var trow = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");
    var td4 = document.createElement("td");
    td1.innerHTML = ID;
    td2.innerHTML = vname;
    td3.innerHTML = duration;
    td4.innerHTML = dose;
    td1.classList.add("defaultTable");
    td2.classList.add("defaultTable");
    td3.classList.add("defaultTable");
    td4.classList.add("defaultTable");
    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    tbody.appendChild(trow);
}
function editButton() {
    document.getElementById("name-4542").value = "";
    document.getElementById("text-59c1").value = "";
    document.getElementById("select-d8f6").value = "";
    document.getElementById("error").innerHTML = "";
    document.getElementById("edit").click();
}
function removeButton() {
    document.getElementById("name-4542").value = "";
    document.getElementById("text-59c1").value = "";
    document.getElementById("select-d8f6").value = "";
    document.getElementById("error").innerHTML = "";
    document.getElementById("edit").click();
}
function updateButton() {
    let vname = document.getElementById("name-4542").value.trim();
    let duration = document.getElementById("text-59c1").value.trim();
    // let dose = document.getElementById("select-d8f6").value;
    database.ref(email + "/" + activeCentre + "/VaccineList/" + vname).update({
        Duration: duration
    });
    getAllData();
    document.getElementById("crossButton").click();
    alert("Details Updated");
}
function deleteButton() {
    let vname = document.getElementById("name-4542").value.trim();
    if (vname == "")
        document.getElementById("error").value = "No vaccine selected, please select the vaccine first.";
    else if (confirm("Remove " + vname + " permanently?"))
        database.ref(email + "/" + activeCentre + "/VaccineList/" + vname).remove();
    else
        document.getElementById("error").value = "Deletion aborted";
    document.getElementById("crossButton").click();
    // alert("Vaccine Removed");
    getAllData();
}
function searchForEdit() {
    var searchText = document.getElementById("name-4543").value.trim();
    // console.log("searching for:"+document.getElementById("name-4543").value);
    if (searchText.length == 0)
        document.getElementById("error").innerHTML = "Please enter Vaccine ID";
    else if (searchText > vaccinearr.length || searchText <= 0)
        document.getElementById("error").innerHTML = "Invalid Vaccine ID";
    else {
        document.getElementById("error").innerHTML = "";
        var vaccine = vaccinearr[searchText - 1];
        document.getElementById("name-4542").value = vaccine.Name;
        document.getElementById("text-59c1").value = vaccine.Duration;
        if (vaccine.Dose == "Single Dose") {
            document.getElementById("text-59c1").readOnly = true;
            document.getElementById("error").innerHTML = "This vaccine details cannot be edited";
        }
        else {
            document.getElementById("text-59c1").readOnly = false;
            document.getElementById("error").innerHTML = "";
        }
        document.getElementById("select-d8f6").value = vaccine.Dose;
        document.getElementById("name-4542").readOnly = true;
        $('#select-d8f6').attr("disabled", true);
    }
}
document.getElementById("searchform1").addEventListener("submit", (event) => {
    event.preventDefault();
});
document.getElementById("searchform").addEventListener("submit", (event) => {
    event.preventDefault();
});
let previousText = document.getElementById("searchText").value.trim();
var interval = setInterval(() => {
    let currentText = document.getElementById("searchText").value.trim();
    if (previousText != currentText) {
        searchInTable(currentText);
        // console.log(currentText);
        previousText = currentText;
    }
}, 1000);
function searchInTable(text) {
    $("#vaccineTable tr").remove();
    for (i = 0; i < vaccinearr.length; ++i) {
        var vaccineobj = vaccinearr[i];
        if (vaccineobj.Name.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
            addItemsToTable(vaccineobj.Name, vaccineobj.Duration, vaccineobj.Dose, (i + 1));
        }
    }
}
function addButton() {
    document.getElementById("addNew").click();
}
async function uploadVaccine() {
    const vname = document.getElementById("name-79a0").value.trim();
    const doseType = document.getElementById("select-ddf4").value.trim();
    const duration = document.getElementById("text-81b5").value.trim();
    if(vname.includes("#") || vname.includes("$") || vname.includes("[") || vname.includes("]") || vname.includes("."))
        document.getElementById("error1").innerHTML = "Name cant include the following characters: '#', '$', '[', ']', '.'";
    else if (vname.length > 30)
        document.getElementById("error1").innerHTML = "Name too long.";
    else if (duration != null && duration < 0)
        document.getElementById("error1").innerHTML = "Duration cannot be negative";
    else if (doseType === "")
        document.getElementById("error1").innerHTML = "Please select number of dose";
    else if (doseType == "Double Dose" && duration <= 0)
        document.getElementById("error1").innerHTML = "Please enter duration";
    else if (doseType == "Single Dose" && duration > 0)
        document.getElementById("error1").innerHTML = "No duration required for Single Dose vaccines";
    else
        await database.ref(email + "/" + activeCentre + "/VaccineList/" + vname).once("value", function (snapshot) {
            if (snapshot.exists() && vname == snapshot.val().Name) {
                document.getElementById("error1").innerHTML = "Cannot add 2 vaccine of same name";
                alert(vname + " already exists");
            } else {
                database.ref(email + "/" + activeCentre + "/VaccineList/" + vname).set({
                    Name: vname,
                    Dose: doseType,
                    Duration: duration
                });
                alert("Vaccine added successfully");
                getAllData();
                document.getElementById("crossButton1").click();
                document.getElementById("name-79a0").value = "";
                document.getElementById("select-ddf4").value = "";
                document.getElementById("text-81b5").value = "";
            }
        });
}
document.getElementById("logouta").addEventListener("click", () => {
    auth.signOut().then(() => {
        location.replace("Homepage.html");
    }).catch((error) => {
        alert("Something went wrong, please try again!");
        console.log(error);
    });
});
function importButton() {
    document.getElementById("import").click();
}
function importVaccine() {
    var error = document.getElementById("error2");
    var center = document.getElementById("select-cdd9").value.trim();
    var start = document.getElementById("email-a136").value.trim();
    var end = document.getElementById("text-a6a6").value.trim();
    if (center == "" || start == "" || end == "")
        error.innerHTML = "Please fill all the required fields.";
    else {
        start = start - 1;
        end = end - 1;
        error.innerHTML = "";
        var vaccines = [];
        database.ref(email + "/" + center + "/VaccineList").once("value", function (allrecord) {
            allrecord.forEach(function (currentrecord) {
                var vname = currentrecord.val().Name;
                var doseType = currentrecord.val().Dose;
                var duration = currentrecord.val().Duration;
                var vaccine = { Name: vname, Dose: doseType, Duration: duration };
                vaccines.push(vaccine);
            });
            if (vaccines.length == 0)
                error.innerHTML = "No vaccine found in the selected center.";
            else if (start < 0 || start >= vaccines.length)
                error.innerHTML = "Invalid starting ID";
            else if (end < 0 || end >= vaccines.length)
                error.innerHTML = "Invalid ending ID";
            else if (end < start)
                error.innerHTML = "ERROR: Ending ID is less than starting ID.";
            else {
                var errorcount = 0, changeall = 0, ask;
                for (i = start; i <= end; ++i) {
                    var index = vaccinearr.findIndex(e => e.Name === vaccines[i].Name);
                    if (index >= 0) {
                        if (changeall == 0)
                            ask = confirm(vaccinearr[index].Name + " is already present.\nReplace the present vaccine with new one?");
                        else
                            ask = changeall;
                        if (ask == 1) {
                            vaccinearr.slice(index, 1);
                            vaccinearr.push(vaccines[i]);
                            database.ref(email + "/" + activeCentre + "/VaccineList/" + vaccines[i].Name).set(vaccines[i]);
                        }
                        ++errorcount;
                        if (errorcount == 3 && changeall == 0 && i != end) {
                            if (confirm("Replace all vaccines in present list?"))
                                changeall = 1;
                            else {
                                if (confirm("Skip all vaccines that appear twice?"))
                                    changeall = 2;
                                else
                                    errorcount = 0;
                            }
                        }
                    } else {
                        vaccinearr.push(vaccines[i]);
                        database.ref(email + "/" + activeCentre + "/VaccineList/" + vaccines[i].Name).set(vaccines[i]);
                    }
                }
                document.getElementById("closeButton2").click();
                hidepage();
                setTimeout(() => { getAllData(); }, 1000);
            }
        });
    }
}