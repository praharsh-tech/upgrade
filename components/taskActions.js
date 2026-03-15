import { renderTasks } from "./renderTasks.js";

function getTasks(){
return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks){
localStorage.setItem("tasks",JSON.stringify(tasks));
}

export function setupTaskActions(){

document.addEventListener("click",(e)=>{

/* EDIT */

if(e.target.classList.contains("editTaskBtn")){

const taskId = Number(e.target.dataset.id);

const tasks = getTasks();

const task = tasks.find(t => t.id === taskId);

if(!task) return;

const newTitle = prompt("Edit Title", task.title);

const newDesc = prompt("Edit Description", task.description);

if(newTitle) task.title = newTitle;
if(newDesc) task.description = newDesc;

saveTasks(tasks);

renderTasks(tasks);

}

/* DELETE */

if(e.target.classList.contains("deleteTaskBtn")){

const taskId = Number(e.target.dataset.id);

if(!confirm("Delete this task?")) return;

let tasks = getTasks();

tasks = tasks.filter(t => t.id !== taskId);

saveTasks(tasks);

renderTasks(tasks);

}

});

}