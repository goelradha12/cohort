const createNewButton = document.querySelector("#create-btn");
const buttonContainer = document.querySelector("#button-container");
const inputCode = document.querySelector(`[name='color-code']`);

createNewButton.addEventListener("click",(e)=>{
    let newBtn = document.createElement("button");
    newBtn.innerHTML = `Click to Change Background`;
    newBtn.style.backgroundColor = inputCode.value;
    newBtn.style.marginBlock = "20px";
    newBtn.dataset.color = inputCode.value;

    newBtn.addEventListener("click",()=>{
        document.body.style.backgroundColor = newBtn.dataset.color
    });
    buttonContainer.append(newBtn);
}) 
