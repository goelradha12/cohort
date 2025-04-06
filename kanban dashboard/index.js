// check if board is already created with that name


// ------Utility function ----------

function getADate() {
    let today = new Date();
    let dateCreated = today.getFullYear() + ":" + String(Number(today.getMonth())+1) + ":"+ today.getDate();
    return dateCreated;
}




function updateTaskCount(boardName)
{
    let myTaskBoard = document.querySelector(`[data-name="${boardName}"]`);
    let countDiv = myTaskBoard.querySelector(".task-count");

    let newCount = myTaskBoard.querySelectorAll(".task").length;

    countDiv.innerText = `${newCount}`;
}


// -------------Handling Modal Toggles----------------

const createTaskButton = document.querySelector("#create-task-btn");
const createBoardButton = document.querySelector("#create-board-btn");

const modalTask = document.querySelector(".modal1");
const modalBoard = document.querySelector(".modal2");

const submitModalTask = document.querySelector(".modal1 form button");
const submitModalBoard =  document.querySelector(".modal2 form button");

const closeModalBtns = [...document.querySelectorAll("[data-modal]")];

createTaskButton.addEventListener("click",(e)=>{
    console.log(e.target);

    // update available board list first
    let boardList = document.querySelector("#boardOptions");
    boardList.innerHTML = "";
    let boardListName = [...document.querySelectorAll(".board")]
    boardListName.forEach(board=>{

        let boardName = board.getAttribute("data-name");
        let newOption = document.createElement("option");
        newOption.setAttribute("value",boardName);
        newOption.innerText = boardName;
        boardList.prepend(newOption);
    })

    // show up the modal
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



// ---------Handling flying cards and updates -------------

const boardsDiv = document.querySelector(".boards");
const boardList = []; // will add board's name as more gets created
const addDragEventOnBoard = (board)=>{
    board.addEventListener("dragover",(e)=>{
        // console.log(e);
        const closestCard = findClosestCard(board, e.clientY);
        const flyingCard = document.querySelector(".moving");
        
        // update count of parent of flyingcard before it flies away
        const prevBoardName = flyingCard.parentNode.parentNode.getAttribute("data-name");
        const presentBoardName = board.getAttribute("data-name");
        
        if(closestCard){
            closestCard.parentNode.insertBefore(flyingCard,closestCard)
        }else{
            board.querySelector(".board-tasks").append(flyingCard);
        }
        
        // update counts now, when transfer is done
        updateTaskCount(prevBoardName);
        updateTaskCount(presentBoardName);
        
        // need to update board name on the task
        flyingCard.querySelector(".board-name").innerText = presentBoardName;
        updateLocalStorage();
    })

}
function findClosestCard(container, Ypos){
    const NonFlyingCards = [...container.querySelectorAll(".task:not(.moving)")];
    const value = NonFlyingCards.reduce((closest, childCard) => {
        const childCardBox = childCard.getBoundingClientRect();
        const offset = Ypos - childCardBox.top - (childCardBox.height / 2);
        if(offset < 0 && offset > closest.offset2)
            return {offset2: offset, cardElement: childCard}
        else
        return closest;
}, {offset2: Number.NEGATIVE_INFINITY})
return value.cardElement;
}

// ----------End of flying cards and updates






//------------Function for adding new boards + event listeners ------------
const editBoardModal = document.querySelector(".modal4");
const editBoardForm = document.querySelector("#editBoardForm");

editBoardForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    // get values to update
    const newBoardName = e.target.querySelector("#updated-name").value;
    const prevBoardName = e.target.querySelector("#prev-board-name").value;
    const boardDesc = e.target.querySelector("#updated-description").value;

    // console.log(newBoardName,prevBoardName,boardDesc);
    // upadte those values
    const board = document.querySelector(`[data-name="${prevBoardName}"]`);
    board.querySelector(".board-name").innerText = newBoardName;
    board.querySelector(".board-desc").innerText = boardDesc;
    board.setAttribute("data-name",newBoardName);

    // update value of new Name in all tasks
    let tasks = [...board.querySelectorAll(".task")];
    if(tasks)
        {
            tasks.forEach(task=>{
                task.querySelector(".board-name").innerText = newBoardName;
            })
        }
        // remove modal
    editBoardModal.classList.remove("modal-toggle");

    // updating board list
    boardList.splice(boardList.indexOf(prevBoardName),1);
    boardList.push(newBoardName);
    // update local storage in the end
    updateLocalStorage();
})

editBoardModal.querySelector(".close-modal4").addEventListener("click",()=>{
    editBoardModal.classList.toggle("modal-toggle");
})

function addEditBoardEvent(board){
    let btn = board.querySelector("#editBoardBtn");
    btn.addEventListener("click",()=>{

        // getting Present values
        let boardName = board.querySelector(".board-name").innerText;
        let boardDescription = board.querySelector(".board-desc").innerText

        // show modal
        editBoardModal.classList.toggle("modal-toggle");

        // show values in modal
        editBoardForm.querySelector("#updated-name").value = boardName;
        editBoardForm.querySelector("#prev-board-name").value = boardName;
        editBoardForm.querySelector("#updated-description").value = boardDescription;

    })
} 

const createNewBoard = (boardName, boardColor,boardDescription,dateCreated,taskCount=0) =>{

    // checking if boardname already exists
    let found = boardList.findIndex((val)=>{
        // console.log(val.toUpperCase(),boardName.toUpperCase())
        return val.toUpperCase() == boardName.toUpperCase();
    })

    if(found==-1)
    {
        boardList.push(boardName);
        // add a notification on top of screen  board created
        let myBoard = document.createElement("div");
        myBoard.classList.add("board");
        myBoard.dataset.name= boardName;
        myBoard.dataset.color = boardColor;
        myBoard.innerHTML = `
                <div class="board-header">
                <div class="board-header-intro">
                        <span style="color:${boardColor}" class="board-color material-symbols-outlined">
                        trip_origin
                        </span>
                        <span class="board-name">${boardName}</span>
                    </div>
                    <div class="board-control">
                    <button class="board-control-btn">
                    <span id="editBoardBtn" class="material-symbols-outlined">
                    edit_note
                    </span>
                        </button>
                        <button class="board-control-btn">
                        <span id="deleteBoardBtn" class="material-symbols-outlined">
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
        myBoard.querySelector("#deleteBoardBtn").addEventListener("click",()=>{
        let permitted = confirm("Deleting board will delete all the tasks inside. \n Click 'Ok' to continue:");
        if(permitted)
            {
                myBoard.remove();
                boardList.splice(boardList.indexOf(boardName),1);
                updateLocalStorage();
            }
        })
        // add delete board event listener
        addDragEventOnBoard(myBoard)
        updateLocalStorage();
        addEditBoardEvent(myBoard);
     }
}




// ---------Functions on adding Task and event listeners-----------
// --------Edit task + it's popup ---------------
const editTaskModal = document.querySelector(".modal3");
const editTaskForm = document.querySelector("#editTaskForm");

editTaskModal.querySelector(".close-modal3").addEventListener("click",()=>{

    editTaskModal.classList.remove("modal-toggle");
    let newText = editTaskForm.querySelector("#taskText").value;
    let newBoard = editTaskForm.querySelector("#boardNewOptions").value;
    let dateCreated = editTaskForm.querySelector("#saveDate").value;
    // console.log(newText,newBoard);
    createNewTask(newText,newBoard,dateCreated)
    updateLocalStorage();
})

editTaskForm.querySelector(".btn").addEventListener("click",(e)=>{

    e.preventDefault();
    editTaskModal.classList.remove("modal-toggle");
    let newText = editTaskForm.querySelector("#taskText").value;
    let newBoard = editTaskForm.querySelector("#boardNewOptions").value;
    let dateCreated = editTaskForm.querySelector("#saveDate").value;
    // console.log(newText,newBoard);
    createNewTask(newText,newBoard,dateCreated)
    updateLocalStorage();
})

function addEditTaskEvent (task){
    const btn = task.querySelector("#edit-task-btn");
    btn.addEventListener("click",()=>{
        // saving prev data in form
        editTaskForm.querySelector("#taskText").value = task.querySelector(".task-content").innerText;
        editTaskForm.querySelector("#saveDate").value = task.querySelector(".task-create-time").innerText;

        // getting board names to display
        let boardListForm = document.querySelector("#boardNewOptions");
        boardListForm.innerHTML = '';
        boardList.forEach(b=>{

            let newOption = document.createElement("option");
            newOption.setAttribute("value",b);
            newOption.innerText = b;
            boardListForm.prepend(newOption);
        })
        let boardName = task.querySelector(".board-name").innerText;
        boardListForm.value = boardName;

        editTaskModal.classList.toggle("modal-toggle"); // show modal3

        // update task count of the board
        task.remove(); // remove the task now
        updateTaskCount(boardName)
       
    })
}

const addDragEvent = (myTask)=>{ 
    myTask.draggable = "true"
    myTask.addEventListener("dragstart",(e)=>{
        myTask.classList.add("moving")});
    myTask.addEventListener("dragend",()=>{myTask.classList.remove("moving")})
    
}

const createNewTask = (taskName,taskBoard,dateCreated,status)=>{
    // getting the required board from DOM
    let myTaskBoard = document.querySelector(`[data-name="${taskBoard}"]`);
    let tasksDiv = myTaskBoard.querySelector(".board-tasks");

    let myTask = document.createElement("div");
    myTask.classList.add("task");
    myTask.innerHTML = 
        `<div class="task-header">
            <input type="checkbox" name="isComplete" id="isTaskComplete" ${status?"checked":""}>
            <span class="board-name">${taskBoard}</span>
        </div>
        <div class="task-content">${taskName}</div>
        <div class="task-footer">
            <div class="buttons">
                <button class="btn-task" id="edit-task-btn">Edit</button>
                <button class="btn-task" id="delete-task-btn">Delete</button>
            </div>
            <div class="task-create-time-div">
                Task Created:
                <span class="task-create-time">${dateCreated}</span>
            </div> 
        </div>`;

    tasksDiv.append(myTask);

    // Adding Event Listeners to buttons
    myTask.querySelector("#delete-task-btn").addEventListener("click",()=>{
        // console.log(myTask)
        let permitted = confirm("You are about to delete a task. Click 'Ok' to continue: ");
        if(permitted)
        {
            myTask.remove();
            updateTaskCount(taskBoard);
            updateLocalStorage();
        }
    })
    myTask.querySelector("input#isTaskComplete").addEventListener("click",()=>{
        updateLocalStorage();
        // console.log(myTask.querySelector("#isTaskComplete").checked)
    })
    addDragEvent(myTask);
    addEditTaskEvent(myTask,taskName,dateCreated,taskBoard);
    updateTaskCount(taskBoard);
    updateLocalStorage();
    // console.log(typeof taskBoard,taskName);
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
    
    let dateCreated = getADate();
    createNewBoard(boardName,boardColor,boardDescription,dateCreated);
})
formForTask.addEventListener("submit",(e)=>{
    e.preventDefault();
    let taskName = e.target.querySelector("textarea#newTask").value;
    let taskBoard = e.target.querySelector("select").value;
    let dateCreated = getADate();
    let status = false;
    createNewTask(taskName,taskBoard,dateCreated,status);
})

// ------------Forms Handling for New Board/Task Ends-------------


// ----------Create initial board and tasks
// createNewBoard("To Do","#00172D","This is a Test Board to add to do items",getADate(),0);
// createNewBoard("To Not Do","#016A4F","This is a Test Board to add to do items",getADate(),0);
// createNewTask("Sample task","To Do",getADate())
// createNewTask("Sample task 2","To Do",getADate())
// updateLocalStorage();

// ----------Update Local Storage
function updateLocalStorage() {
    // let myItems = [                 array of objects
    //     {
    //         Name: "To Do",  
    //         Description: "THis si ",
    //         dateCreated: "2025:12:12",
    //         taskCount: "0",
    //         color: "#fsfdsg",
    //         taskList: [
    //             {
    //                 Name: "Sample Task",
    //                 Status: true,
    //                 dateCreated: "2025-10-10";
    //             }
    //         ]
    //     }
    // ];

    let myItems = [];

    boardList.forEach(board=>{
        const myBoard = document.querySelector(`[data-name="${board}"]`)
        let boardDetail = {};
        let localtaskList = [];
        
        if(myBoard.querySelector(".task") != null)
        {
            let boardTasks = [...myBoard.querySelectorAll(".task")];
            boardTasks.forEach(task=>{
                let taskDetail ={};
                taskDetail.Name = task.querySelector(".task-content").innerText;
                taskDetail.dateCreated = task.querySelector(".task-create-time").innerText;
                taskDetail.Status = task.querySelector("#isTaskComplete").checked;
                localtaskList.push(taskDetail);
            })
        }
        boardDetail.taskList = localtaskList;
        
        boardDetail.Name = myBoard.querySelector(".board-name").innerText;
        boardDetail.Description = myBoard.querySelector(".board-desc").innerText;
        boardDetail.dateCreated = myBoard.querySelector(".board-create-time").innerText;
        boardDetail.taskCount = myBoard.querySelector(".task-count").innerText;
        boardDetail.color = myBoard.getAttribute("data-color");

        // push it back to array

        myItems.push(boardDetail);
    })
    localStorage.clear();
    localStorage.setItem("myItems",JSON.stringify(myItems));
}

// whenever you open the app... you should take out data
// from local storage and render it

function displayLocalStorageHistory() {

    // console.table(JSON.parse(localStorage.getItem("myItems")));
    let myItems = JSON.parse(localStorage.getItem("myItems"));
    // console.log(myItems);
    if(!myItems) return;
    // create boards first
    myItems.forEach(board=>{
        createNewBoard(board.Name,board.color,board.Description,board.dateCreated,board.taskCount);
        if(board.taskList)
        {

            board.taskList.forEach(task=>{
                createNewTask(task.Name,board.Name,task.dateCreated,task.Status);
            })
        }
    })
}
window.onload = () => {
    displayLocalStorageHistory();
};
// tasks not updating well