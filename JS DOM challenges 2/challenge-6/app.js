/**
 * Write your challenge solution here
*/

const timeDiv = document.querySelector(".digital-clock");
const dateDiv = document.querySelector(".date");
const hourHand = document.querySelector(".hour");
const minuteHand = document.querySelector(".minute");
const secondHand = document.querySelector(".second");

// console.log(today.toDateString(), hour);

function format(str)
{
    if(str.length <2)
        {
        str = "0" + str;
    }
    return str;
}

function updateDate() {
    let today = new Date();
    dateDiv.innerText = `${today.getDate()}-${format(today.getMonth())+1}-${today.getFullYear()}`;
}

function updateTime() {   
    let today = new Date();
    let hour = today.getHours();
    let minute = today.getMinutes();
    let second = today.getSeconds();
    if(hour>=12)
        hour -= 12;
    
    hour = format(String(hour));
    minute = format(String(minute));
    second = format(String(second));
    
    timeDiv.innerText = `${hour}:${minute}:${second}`;

    if(hour=='00' && minute=='00' && second=='00')
    {
        // check if date changed and update
        updateDate();
    }
    // console.log(hour)
}

function updateSecond() {
    let today = new Date();
    let secondDeg = today.getSeconds();
    secondHand.style.transform = `rotate(${secondDeg * 6}deg)`
    // console.log(secondHand.style.transform);
    
}
function updateMinute() {
    let today = new Date();
    let minuteDeg = today.getMinutes();
    minuteHand.style.transform = `rotate(${minuteDeg * 6}deg)`
   
}
function updateHour() {
    let today = new Date();
    let hourDeg = today.getHours();
    if(hourDeg>=12)
        hour -= 12;
    hourHand.style.transform = `rotate(${hourDeg * 30}deg)`
   
}

function updateClock() {
    updateHour();
    updateMinute();
    updateSecond();
}
let myInterval = setInterval(updateTime,1000);
let myInterval2 = setInterval(updateSecond,1000);
let myInterval3 = setInterval(updateMinute,1000*60);
let myInterval4 = setInterval(updateHour,1000*60*60);
// let myInterval2 = setInterval(updateSecond,1000);

// updateSecond();
updateClock();
console.log()
updateDate();