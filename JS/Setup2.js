function showPage() {
    document.getElementById("load").style.display = "none";
    document.getElementById("fader").style.display = "none";
}

function hidepage(){
    document.getElementById("load").style.display = "block";
    document.getElementById("fader").style.display = "block";
}

function goTop(){
    document.body.scrollTop = 0; //for safari
    document.documentElement.scrollTop = 0;
}
