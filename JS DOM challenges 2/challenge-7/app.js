const accordHeader = [...document.querySelectorAll(".accordion-button")];

const handleHeaderClick = (e) => {
    let button = e.currentTarget; // Ensures the click is always on `.accordion-button`
    let arrow = button.querySelector(".arrow"); // Select arrow correctly
    let content = button.parentNode.children[1]; // Target the accordion content

    // Check if any other accordion is open and close it
    if (!arrow.classList.contains("active")) {
        let checkArrow = document.querySelector(".arrow.active");
        if (checkArrow && checkArrow !== arrow) {
            checkArrow.classList.remove("active");
        }

        let checkContent = document.querySelector(".active-accordion-content");
        if (checkContent && checkContent !== content) {
            checkContent.classList.remove("active-accordion-content");
        }
    }

    // Toggle active class
    arrow.classList.toggle("active");
    content.classList.toggle("active-accordion-content");
};

// Attach event listeners
accordHeader.forEach((header) => {
    header.addEventListener("click", handleHeaderClick);
});

// Open first accordion by default
if (accordHeader.length > 0) {
    let firstArrow = accordHeader[0].querySelector(".arrow");
    let firstContent = accordHeader[0].parentNode.children[1];

    if (firstArrow) firstArrow.classList.add("active");
    if (firstContent) firstContent.classList.add("active-accordion-content");
}
