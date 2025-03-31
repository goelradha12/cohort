
const nav_btn = document.querySelector(".close-btn");
const nav_open_btn = document.querySelector(".open-btn");
nav_btn.addEventListener("click",()=>{
  document.querySelector(".menu").style.transform = "translateX(100%)";
})
nav_open_btn.addEventListener("click",()=>{
  document.querySelector(".menu").style.transform = "translateX(0)";       
})