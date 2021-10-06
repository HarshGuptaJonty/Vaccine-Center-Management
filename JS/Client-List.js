var email;
var select = document.getElementById("select-9c1c");
var activeCentre;
var searched = false;
firebaseApp.auth().onAuthStateChanged((user) => {
    email = user.email;
    email = email.replaceAll(".", "");
    database.ref(email + "/ActiveCentre").on("value", function (snapshot) {
        activeCentre = snapshot.val();
        getAllData();
    });
});
auth.onAuthStateChanged((user) => {
    if (!user)
        location.replace("Homepage.html");
});
var vaccinearr = [];
async function updateList() {
    vaccinearr = [];
    $("#select-9c1c").empty();
    await database.ref(email + "/" + activeCentre + "/VaccineList").once("value", function (allrecord) {
        allrecord.forEach(function (currentrecord) {
            var vname = currentrecord.val().Name;
            vaccinearr.push(vname);
            // console.log(vname);
            let option = document.createElement("option");
            option.text = vname;
            option.value = vname;
            select.add(option);
        });
        showPage();
    });
    //add new c
    $("#select-45ff").empty();
    await database.ref(email + "/" + activeCentre + "/VaccineList").once("value", function (allrecord) {
        allrecord.forEach(function (currentrecord) {
            var vname = currentrecord.val().Name;
            let option = document.createElement("option");
            option.text = vname;
            select2.add(option);
        });
    });
    document.getElementById("date-f864").value = null;
    document.getElementById("date-2b92").value = null;
}
var ID = 0;
var clientarr = [];
async function getAllData() {
    clientarr = [];
    ID = 0;
    $("#clientTable tr").remove();
    var date = new Date().toISOString().slice(0, 10);
    $('#date-f864').attr('min', date);
    var date2 = new Date();
    date2.setDate(date2.getDate() + 1);
    $('#date-2b92').attr('min', date2.toISOString().slice(0, 10));
    console.log("Working on: " + email + "/" + activeCentre);
    await database.ref(email + "/" + activeCentre + "/ClientList").once("value", function (allrecord) {
        allrecord.forEach(function (currentrecord) {
            var nname = currentrecord.val().Name;
            var phone = currentrecord.val().Phone;
            var first = currentrecord.val().First;
            var second = currentrecord.val().Second;
            var vaccine = currentrecord.val().Vaccine;
            var client = { Name: nname, Phone: phone, First: first, Second: second, Vaccine: vaccine };
            clientarr.push(client);
            addItemsToTable(nname, phone, first, second, vaccine, ++ID);
        });
        if (ID == 0)
            alert("No client to show!");
    });
    await updateList();
}
function addItemsToTable(nname, phone, first, second, vaccine, ID) {
    var tbody = document.getElementById("clientTable");
    var trow = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");
    var td4 = document.createElement("td");
    var td5 = document.createElement("td");
    var td6 = document.createElement("td");
    td1.innerHTML = ID;
    td2.innerHTML = nname;
    td3.innerHTML = phone;
    td4.innerHTML = first;
    td5.innerHTML = second;
    td6.innerHTML = vaccine;
    td1.classList.add("defaultTable");
    td2.classList.add("defaultTable");
    td3.classList.add("defaultTable");
    td4.classList.add("defaultTable");
    td5.classList.add("defaultTable");
    td6.classList.add("defaultTable");
    trow.appendChild(td1);
    trow.appendChild(td2);
    trow.appendChild(td3);
    trow.appendChild(td4);
    trow.appendChild(td5);
    trow.appendChild(td6);
    tbody.appendChild(trow);
}

function editButton() {
    // console.log("Edit");
    document.getElementById("text-3d69").value = "";
    document.getElementById("name-22b9").value = "";
    document.getElementById("phone-0eea").value = "";
    document.getElementById("phone-0eea").readOnly = "";
    document.getElementById("select-9c1c").value = "";
    // await updateList();
    document.getElementById("edit").click();
}

function removeButton() {
    // console.log("remove");
    document.getElementById("text-3d69").value = "";
    document.getElementById("name-22b9").value = "";
    document.getElementById("phone-0eea").value = "";
    document.getElementById("phone-0eea").readOnly = "";
    document.getElementById("select-9c1c").value = "";
    // await updateList();
    document.getElementById("edit").click();
}

function updateButton() {
    updateClient();
}

function deleteButton() {
    if (!searched)
        document.getElementById("error").innerHTML = "Please search a client first.";
    else {
        let phone = document.getElementById("phone-0eea").value;
        let nname = document.getElementById("name-22b9").value;
        if (phone == "" || nname == "")
            document.getElementById("error").innerHTML = "Nothing selected to delete, please select a client first.";
        else if (confirm("Remove " + nname + " permanently?")) {
            database.ref(email + "/" + activeCentre + "/ClientList/" + phone).remove();
            alert("Client Removed");
            getAllData()
            document.getElementById("crossButton").click();
        }
        else
            document.getElementById("error").value = "Deletion aborted";
        searched = false;

    }
}
async function getVaccineType(vaccineName) {
    var value;
    await database.ref(email + "/" + activeCentre + "/VaccineList/" + vaccineName).once("value", function (data) {
        if (data.val()) {
            value = data.val().Dose.toString();
            // console.log(value);
        }
        else
            value = "NotFound";
    });
    return value;
}
function searchForEdit() {
    var searchText = document.getElementById("text-3d69").value;
    if (searchText.length == 0)
        document.getElementById("error").innerHTML = "Please enter Client ID";
    else if (searchText > clientarr.length || searchText <= 0)
        document.getElementById("error").innerHTML = "Invalid Client ID";
    else {
        searched = true;
        document.getElementById("error").innerHTML = "";
        var client = clientarr[searchText - 1];
        document.getElementById("name-22b9").value = client.Name;
        document.getElementById("phone-0eea").value = client.Phone;
        document.getElementById("phone-0eea").readOnly = true;
        document.getElementById("select-9c1c").value = client.Vaccine;
        if (client.First != "No Data") {
            document.getElementById("date-f864").value = client.First;
            document.getElementById("date-f864").readOnly = true;
            $('#select-9c1c').attr("disabled", true);
        } else {
            document.getElementById("date-f864").value = null;
            document.getElementById("date-f864").readOnly = false;
            $('#select-9c1c').attr("disabled", false);
        }
        if (client.Second != "No Data") {
            document.getElementById("date-2b92").value = client.Second;
            document.getElementById("date-2b92").readOnly = true;
            $('#select-9c1c').attr("disabled", true);
        } else {
            document.getElementById("date-2b92").value = null;
            document.getElementById("date-2b92").readOnly = false;
            $('#select-9c1c').attr("disabled", false);
        }
        database.ref(email + "/" + activeCentre + "/VaccineList/" + client.Vaccine).once("value", function (data) {
            if (data.val()) {
                var doseType = data.val().Dose;
                if (doseType == "Single Dose") {
                    document.getElementById("date-2b92").readOnly = true;
                    $('#select-9c1c').attr("disabled", true);
                    console.log("They got: " + doseType + " From: " + client.Vaccine);
                } else {
                    document.getElementById("date-2b92").readOnly = false;
                    console.log("They all got: " + doseType + " From: " + client.Vaccine);
                }
            }
        });
        let found = false;
        for (i = 0; i < vaccinearr.length; ++i)
            if (vaccinearr[i] == client.Vaccine)
                found = true;
        if (!found)
            document.getElementById("error").innerHTML = "Vaccine showed in client file is deleted from vaccine list";
        else
            document.getElementById("error").innerHTML = "";
    }
}

function updateClient() {
    if (!searched)
        document.getElementById("error").innerHTML = "Please search a client first.";
    else {
        let nname = document.getElementById("name-22b9").value;
        let phone = document.getElementById("phone-0eea").value;
        let first = document.getElementById("date-f864").value;
        let second = document.getElementById("date-2b92").value;
        let vaccine = document.getElementById("select-9c1c").value;
        if (nname.length > 30)
            document.getElementById("error").innerHTML = "Name too long.";
        if (first.length == 0)
            first = "No Data";
        if (second.length == 0)
            second = "No Data";
        if (nname == "" || phone == "" || vaccine == "") {
        } else {
            document.getElementById("error").innerHTML = "";
            console.log(nname, phone, first, second, vaccine);
            database.ref(email + "/" + activeCentre + "/ClientList/" + phone).update({
                Name: nname,
                Phone: phone,
                First: first,
                Second: second,
                Vaccine: vaccine
            });
            getAllData();
            alert("Details Updated");
            document.getElementById("crossButton").click();
            searched = false;
        }
    }
}
document.getElementById("searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
});
document.getElementById("searchForm1").addEventListener("submit", (event) => {
    event.preventDefault();
});
document.getElementById("searchIcon").addEventListener("click", () => {
    console.log("Searching for: " + document.getElementById("searchText").value);
    searchInTable(document.getElementById("searchText").value.toLowerCase());
});
let previousText = document.getElementById("searchText").value;
var interval = setInterval(() => {
    let currentText = document.getElementById("searchText").value;
    if (previousText != currentText) {
        searchInTable(currentText);
        // console.log(currentText);
        previousText = currentText;
    }
}, 1000);
// clearInterval(interval);
function searchInTable(text) {
    $("#clientTable tr").remove();
    for (i = 0; i < clientarr.length; ++i) {
        var clientobject = clientarr[i];
        if (clientobject.Name.toLowerCase().indexOf(text.toLowerCase()) >= 0 || clientobject.Phone.indexOf(text) >= 0) {
            addItemsToTable(clientobject.Name, clientobject.Phone, clientobject.First, clientobject.Second, clientobject.Vaccine, (i + 1));
        }
        // else {
        //     // console.log("got: "+clientobject.Name+" searching for: "+text+" found: "+(clientobject.Name.indexOf(text)>=0));
        // }
    }
}
function addButton() {
    document.getElementById("addNewC").click();
}
function uploadClient() {
    // console.log("kjbdf");
    const nname = document.getElementById("name-5dbe").value.trim();
    const phone = document.getElementById("phone-61be").value.trim();
    const vaccineName = document.getElementById("select-45ff").value;
    if (nname == "" || phone == "" || vaccineName == "")
        document.getElementById("error1").innerHTML = "Please fill all the required fields";
    else if (phone.length != 10)
        document.getElementById("error1").innerHTML = "Invalid Phone Number.";
    else if (nname.length > 30)
        document.getElementById("error1").innerHTML = "Name too long.";
    else {
        document.getElementById("error1").innerHTML = "";
        database.ref(email + "/" + activeCentre + "/ClientList/" + phone).once("value", function (snapshot) {
            // if(snapshot.exists())
            if (snapshot.exists() && phone == snapshot.val().Phone) {
                document.getElementById("error1").innerHTML = "Cannot add 2 client on same phone number";
                // console.log(phone, snapshot.val().Phone);
                // alert(phone+" already exists");
            } else {
                database.ref(email + "/" + activeCentre + "/ClientList/" + phone).set({
                    Name: nname,
                    Phone: phone,
                    First: "No Data",
                    Second: "No Data",
                    Vaccine: vaccineName
                });
                alert("Client added successfully");
                document.getElementById("crossButton1").click();
                document.getElementById("name-5dbe").value = "";
                document.getElementById("phone-61be").value = "";
                document.getElementById("select-45ff").value = "";
                getAllData();
            }
        });
    }
}
var select2 = document.getElementById("select-45ff");
function refreshVaccineSelect() {
    $("#select-45ff").empty();
    database.ref(email + "/" + activeCentre + "/VaccineList").once("value", function (allrecord) {
        allrecord.forEach(function (currentrecord) {
            var vname = currentrecord.val().Name;
            let option = document.createElement("option");
            option.text = vname;
            select2.add(option);
        });
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