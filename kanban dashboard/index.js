// ----TOdo: update color of whole board as per selected
// -- --------Handling Modal Toggles----------------

const createTaskButton = document.querySelector("#create-task-btn");
const createBoardButton = document.querySelector("#create-board-btn");

const modalTask = document.querySelector(".modal1");
const modalBoard = document.querySelector(".modal2");

const submitModalTask = document.querySelector(".modal1 form button");
const submitModalBoard =  document.querySelector(".modal2 form button");

const closeModalBtns = [...document.querySelectorAll("[data-modal]")];

createTaskButton.addEventListener("click",(e)=>{
    // console.log(e.target);
    modalTask.classList.toggle("modal-toggle");
})
createBoardButton.addEventListener("click",(e)=>{
    // console.log(e.target);
    modalBoard.classList.toggle("modal-toggle");
})

closeModalBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        let name = btn.getAttribute("data-modal");
        if(name=="Task")
            modalTask.classList.toggle("modal-toggle");
        else if(name=="Board")
            modalBoard.classList.toggle("modal-toggle");
    })
})
// -------------Handling Modal Toggles Ends-------------




//------------Function for adding new task/boards------------
const boardsDiv = document.querySelector(".boards");
const boardList = ["Draft 1"]; // will add board's name as more gets created

const createNewBoard = (boardName, boardColor,boardDescription,dateCreated,taskCount=0) =>{

    boardList.push(boardName);
    // add a notification on top of screen  board created
    let myBoard = document.createElement("div");
    myBoard.classList.add("board");
    myBoard.dataset.name= boardName;
    myBoard.innerHTML = `
                <div class="board-header">
                    <div class="board-header-intro">
                        <span style="color:${boardColor}" class="board-color material-symbols-outlined">
                            circle
                        </span>
                        <span class="board-name">${boardName}</span>
                    </div>
                    <div class="board-control">
                        <button class="board-control-btn">
                            <span class="material-symbols-outlined">
                                edit_note
                            </span>
                        </button>
                        <button class="board-control-btn">
                            <span class="material-symbols-outlined">
                                close
                            </span>
                        </button>
                    </div>
                </div>
                <div class="board-desc">
                    ${boardDescription}
                </div>
                <div class="board-tasks">
                    
                </div>

                <div class="board-footer">
                    <span class="task-count-div">
                        Total Tasks: 
                        <span class="task-count">${taskCount}</span>
                    </span>
                    <span class="board-create-time-div">
                        Date Created:
                        <span class="board-create-time">${dateCreated}</span>
                    </span>
                </div>
    `;
    boardsDiv.append(myBoard);
}
const createNewTask = (taskName,taskBoard)=>{
    console.log(taskBoard,taskName);
}
//-----------Function for adding new Task/Boards ends-----------




// -------------Forms Handling for New Board/Task -------------
const formForBoard = document.querySelector("#boardForm");
const formForTask = document.querySelector("#taskForm");

formForBoard.addEventListener("submit",(e)=>{
    e.preventDefault();
    let boardName = String(e.target.querySelector("textarea#newBoard").value);
    boardName = boardName[0].toUpperCase() + boardName.slice(1);
    let boardDescription = e.target.querySelector("textarea#newBoardDesc").value;
    let boardColor = e.target.querySelector("select").value;
    let today = new Date();
    let dateCreated = today.getFullYear() + ":" + today.getMonth()+1 + ":"+ today.getDate();

    createNewBoard(boardName,boardColor,boardDescription,dateCreated);
})
formForTask.addEventListener("submit",(e)=>{
    e.preventDefault();
    let taskName = e.target.querySelector("textarea#newTask").value;
    let taskBoard = e.target.querySelector("select").value;
    createNewTask(taskName,taskBoard);
})

// ------------Forms Handling for New Board/Task Ends-------------
