/**
 * Write your challenge solution here
 */

const buttons = [...document.querySelectorAll(".color-buttons>*")];
const Heading = document.querySelector("#mainHeading");

// console.log(buttons)

buttons.forEach(btn=>{
    btn.addEventListener("click",(e)=> {
    //    console.log(e.target.innerText);  
       const newColor = e.target.innerText;
       if(newColor=="Reset")
        {
            Heading.style.color = "black";
        } 
        else{
            Heading.style.color = newColor;
        }
    })
    
})