/**
 * Write your challenge solution here
 */
// Image data
const images = [
  {
    url: 'https://plus.unsplash.com/premium_photo-1666863909125-3a01f038e71f?q=80&w=1986&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    caption: 'Beautiful Mountain Landscape',
  },
  {
    url: 'https://plus.unsplash.com/premium_photo-1690576837108-3c8343a1fc83?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    caption: 'Ocean Sunset View',
  },
  {
    url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2041&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    caption: 'Autumn Forest Path',
  },
  {
    url: 'https://plus.unsplash.com/premium_photo-1680466057202-4aa3c6329758?q=80&w=2138&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    caption: 'Urban City Skyline',
  },
];

// Picking up required items
const prevBtn = document.querySelector("#prevButton")
const nextBtn = document.querySelector("#nextButton")
const carouselSlide = document.querySelector(".carousel-slide");
const captionText = document.querySelector("#caption");
const carouselNav = document.querySelector("#carouselNav");
const autoPlayButton = document.querySelector("#autoPlayButton");
const timerDisplay = document.querySelector("#timerDisplay");

let totalSlide = images.length;
let activeSlideIndex = 0;
let isAutoPlay = true;
const autoPlayTime = 3;


function updateImage() {

  carouselSlide.style.backgroundImage = `url(${images[activeSlideIndex].url})`;
  captionText.innerHTML = `${images[activeSlideIndex].caption}`;
  // remove prev selected one and update new

  let activeNav = document.querySelector(".carousel-indicator.active");
  if(activeNav)
    activeNav.classList.remove("active");

  carouselNav.children[activeSlideIndex].classList.add("active");
}

function displayCarousalNav() {
  for(let i =0;i<images.length;i++)
  {
      const newBox = document.createElement("div");
      newBox.setAttribute("class","carousel-indicator");
      // console.log(newBox)
      carouselNav.appendChild(newBox);

      // adding on click event
      newBox.addEventListener("click",()=>{
        activeSlideIndex = i;
        updateImage();
      })
  }
  // highlight selected image one in updateImage

}

prevBtn.addEventListener("click",()=>{
  // console.log(activeSlideIndex);
  activeSlideIndex--;
  if(activeSlideIndex==-1) activeSlideIndex = 3;
  updateImage();
})

nextBtn.addEventListener("click",()=>{
  activeSlideIndex = (activeSlideIndex + 1) % images.length;
  updateImage();
  
})
let timer = autoPlayTime;
function updateTimer(){
  timerDisplay.innerText = `Next Image in: ${timer}`;
  timer = timer-1;
  
    // abhi image kp bhi change krna h
    if(timer<0)
      {
        
        activeSlideIndex = (activeSlideIndex + 1) % images.length;
        updateImage();
        timer = autoPlayTime;
      }

  // console.log(timer);
};

autoPlayButton.addEventListener("click",()=>{
  if(isAutoPlay)
  {
    // auto play chalu h use rok do]
    isAutoPlay = false;
    // dobara chalane ka option dedo
    autoPlayButton.innerText = "Start Auto Play";
    timerDisplay.innerText = "";
    clearInterval(myInterval);
  }
  else
  {
    isAutoPlay = true;
    // setInterval(myInterval(timer),1000)
    timer = autoPlayTime;
    myInterval = setInterval(updateTimer,1000)
  }
})

displayCarousalNav();
updateImage();
let myInterval = setInterval(updateTimer,1000)