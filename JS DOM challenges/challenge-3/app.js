/**
 * Write your challenge solution here
 */

const formDivs = [...document.querySelectorAll(".form-group")];
const previewDivs = [...document.querySelectorAll(".profile-info>*")]
formDivs.forEach(formDiv =>{
    let formElem = formDiv.children[1];
    formElem.addEventListener("input",()=>{
        const valueIdentifier = formDiv.children[0].innerHTML;
        // console.log(formElem.value,valueIdentifier);
        const foundDiv = previewDivs.filter((previewDiv)=>{
            let valueElem = previewDiv.children[0].innerHTML;
            
            return valueIdentifier == valueElem;
        })
        
        if(formElem.value=="")
        {
            foundDiv[0].children[1].innerHTML = "Not provided";

        }
        // console.log(foundDiv[0].children[0].innerHTML);
        else
        foundDiv[0].children[1].innerHTML = formElem.value;
        // find the same text in preview box

    })
    // console.log(formElem)
})

// console.log(previewDivs)