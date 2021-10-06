// var myVar;

// function myFunction() {
//     myVar = setTimeout(showPage, 3000);
// }

function showPage() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("fader").style.display = "none";
}

function hidepage(){
    document.getElementById("loader").style.display = "block";
    document.getElementById("fader").style.display = "block";
}