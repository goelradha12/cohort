const cartItems = document.querySelector("#cart-items");
const cart = document.querySelector(".cart");
const cartTotal = document.querySelector("#cart-total");
const increaseBtn = document.querySelector(".increase");
const decreaseBtn = document.querySelector(".decrease");

let itemCount =0;

cart.addEventListener("click",(e)=>{
    if(e.target.classList.contains("increase"))
        {
            // console.log(e.target);
            let prevQuantity = e.target.parentNode.querySelector(".item-quantity");
            let prevTotal = e.target.parentNode.parentNode.querySelector(".item-total-price");
            let prevPrice = e.target.parentNode.parentNode.querySelector(".item-price");
            prevQuantity.innerText = `${Number(prevQuantity.innerText) + 1}`;
            prevTotal.innerText = `${(Number(prevPrice.innerText)*(Number(prevQuantity.innerText))).toFixed(2)}`
            // console.log(prevPrice.innerText);
            updateCartTotal();
            
        }
        if(e.target.classList.contains("decrease"))
            {
                let prevQuantity = e.target.parentNode.querySelector(".item-quantity");
                if (prevQuantity.innerText != "1")
                    prevQuantity.innerText = `${Number(prevQuantity.innerText) - 1}`;
                let prevTotal = e.target.parentNode.parentNode.querySelector(".item-total-price");
                let prevPrice = e.target.parentNode.parentNode.querySelector(".item-price");
            
                prevTotal.innerText = `${(Number(prevPrice.innerText)*(Number(prevQuantity.innerText))).toFixed(2)}`
                // console.log(prevPrice.innerText);
                updateCartTotal();
                
            }
        if(e.target.classList.contains("item-remove"))
            {
                e.target.parentNode.remove();
                itemCount--;

                if(itemCount==0)
                {
                    cartItems.innerHTML = `<div class="empty-cart">Cart is empty</div>`;
                }
                updateCartTotal();
            }
})

function itemExistInCart(name){
    let itemList =  [...cart.querySelectorAll(".item-name")];
    itemList = itemList.map(item=>{
        return item.innerText;
    })
    // console.log(itemList);

    return itemList.includes(name);
}


// console.log(cartItems);
function addToCart(Name, value) 
{
  if (itemExistInCart(Name)) {
    alert(`${Name} Already exists in your cart!`);
  } 
  else {
      let itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");
      
      if(itemCount==0)
      {
          cartItems.innerHTML = "";
      }
    itemDiv.innerHTML = `<span class="item-name">${Name}</span>
  <div class="quantity">
  <button class="increase">+</button>
  <span class="item-quantity">1</span>
  <button class="decrease">-</button>
  </div>
  <span class="item-price">${value}</span>
  <span class="item-total-price">${value}</span>
  <button class="item-remove">Remove</button>`;
    cartItems.append(itemDiv);

    itemCount++; // update count
    //   const increaseBtn = itemDiv.querySelector(".increase");
    //   const decreaseBtn = itemDiv.querySelector(".decrease");
    updateCartTotal();
  }
}

function updateCartTotal() {
  let priceList = [...cart.querySelectorAll(".item-total-price")].map((price) => {
    return Number(price.innerText);
  });

  let carttotal = priceList.reduce((acc, curr) => acc + curr, 0);
  // console.log(priceList,carttotal);
  cartTotal.innerHTML = `<h3>Total: ${carttotal.toFixed(2)}</h3>`;
}

// const increase = (counter) => {
//   return counter++;
// };
// const decrease = (counter) => {
//   return counter--;
// };

// const buttons = [...document.querySelectorAll(".item-remove")];
// if (buttons) {
//   buttons.forEach((button) => {
//     button.addEventListener("click", () => {
//       button.parentElement.remove();
//       console.log(button);
//     });
//   });
// }
