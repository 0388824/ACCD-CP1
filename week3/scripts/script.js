let cStage = document.getElementById("colorStage");
let cButton = document.getElementById("colorButton")

let changeColor = function()

{
    let rComp = Math.random()*255
    let gComp = Math.random()*255
    let bComp = Math.random()*255

    cStage.style.backgroundColor = "rgb(" + rComp + ", " + gComp + ", " + bComp + ")";

}

cButton.addEventListener("click", changeColor);