/**
 * Write your challenge solution here
 */

const bulb = document.querySelector(".bulb");
const button = document.querySelector("#toggleButton");
const statusText = document.querySelector("#status");

let isTurned = false;
button.addEventListener("click",()=>{
    isTurned = isTurned?(false):(true);

    updateBulb();
})

const updateBulb = ()=>{
    if(!isTurned)
    {
        // bulb is closed
        bulb.classList.add("off");
        button.innerHTML = "Turn On";  // bcz btn is closed now
        statusText.innerHTML = "Status: Off";
        document.body.classList.add("dark-mode");
    }
    else
    {
        // bulb is on
        bulb.classList.remove("off");
        button.innerHTML = "Turn Off";
        statusText.innerHTML = "Status: On";
        document.body.classList.remove("dark-mode");
    }

}

updateBulb();