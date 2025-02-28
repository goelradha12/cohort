/**
 * Write your challenge solution here: Task adds on "Add" click and "Enter" click as well.
 */

const addButton = document.querySelector("#addButton");
const taskLists = document.querySelector("#taskList");
const totalTasksCount = document.querySelector("#totalTasks");
const completedTasksCount = document.querySelector("#completedTasks");
const deleteTaskBtn = document.querySelector(".delete-button");
// const completeCheckbox = document.querySelector(".complete-checkbox");
const noTaskMsg = "No tasks yet. Add one above!";
const taskInput = document.querySelector("#taskInput");

let totalTask = 0;
let completeTask =0;

function addCheckboxEvent(completeCheckbox) {

    if(completeCheckbox)
        {  // agar koi checkbox h to usme event listener add kr do
    completeCheckbox.addEventListener("click",(e)=>{
        // console.dir(e.target.parentElement);
    if(e.target.innerText)
        {
            e.target.style.backgroundColor = "transparent";
            e.target.innerText = "";
            completeTask--;
        }
    else{
        
        e.target.style.backgroundColor = "lightgreen";
        e.target.innerText = "✔️";
        completeTask++;
    }
    e.target.parentElement.classList.toggle("completed");
    updateCounts()
})
}
}

function addDeleteTaskEvent(deleteTaskBtn){

    deleteTaskBtn.addEventListener("click", (e) => {
        totalTask--;
        if (totalTask <= 0) {
            totalTask = 0;
            taskLists.innerHTML = `<li class="empty-list">No tasks yet. Add one above!</li>`;
        }
        
        // check ki kya list completed thi? 
  if(e.target.parentElement.children[0].style.backgroundColor)
    {
        completeTask--;
  }
  // update counts
  updateCounts();
  e.target.parentElement.remove();
});
}

function updateCounts() {
    completedTasksCount.innerText = `Completed: ${completeTask}`;
    totalTasksCount.innerText = `Total tasks: ${totalTask}`;
}


function addItem() {
  // create a list item with the value
  if (taskInput.value) {
    // console.log(taskLists)
    let newTask = document.createElement("li");
    newTask.classList.add("task-item");

    if(totalTask==0)
    {
        taskLists.innerHTML = "";
    }
    newTask.innerHTML = `<span class="complete-checkbox"></span>
      <span class="task-text">${taskInput.value}</span>
      <button class="delete-button">Delete</button>`;

    // add the task in div
    taskLists.prepend(newTask);

    totalTask++; // increase task count

    // Add event listeners to checkbox and delete button
    // task list ka first element h to usi se kr skte hn

    let taskCheckBox = taskLists.children[0].children[0];
    addCheckboxEvent(taskCheckBox);
    let taskDeleteBtn = taskLists.children[0].children[2];
    addDeleteTaskEvent(taskDeleteBtn);

    // empty text input afterwards
    taskInput.value = "";

    updateCounts();
  }
}

addButton.addEventListener("click",()=>{addItem()})
taskInput.addEventListener("keypress",(e)=>{
    // console.log(e.key);
    if(e.key=="Enter")
    addItem();
})

