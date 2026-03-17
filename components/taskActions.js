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

export function startTaskTimers(){

function update(){

document.querySelectorAll(".taskTimer").forEach(timer=>{

const deadline = new Date(timer.dataset.deadline);
const status = timer.dataset.status;

if(status === "Completed"){
timer.textContent = "✅ Completed";
timer.className = "text-green-600 font-semibold";
return;
}

const now = new Date();
const diff = deadline - now;

if(diff <= 0){

const hoursLate = Math.abs(diff)/(1000*60*60);

if(hoursLate <= 5){
timer.textContent = "⚠️ Late";
timer.className = "text-yellow-600 font-semibold";
}else{
timer.textContent = "❌ Failed";
timer.className = "text-red-600 font-semibold";
}

return;
}

const h = Math.floor(diff/(1000*60*60));
const m = Math.floor((diff%(1000*60*60))/(1000*60));

timer.textContent = `${h}h ${m}m`;

});

}

update();
setInterval(update,60000);

}