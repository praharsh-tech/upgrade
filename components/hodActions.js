import { loadHodTasks } from "./hodTasks.js";

/************************************************
LOCAL STORAGE
************************************************/

function getTasks(){
return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks){
localStorage.setItem("tasks",JSON.stringify(tasks));
}

/************************************************
COUNTDOWN TIMER
************************************************/

export function startTaskTimers(){

document.querySelectorAll(".taskTimer").forEach(timer=>{

const deadline = new Date(timer.dataset.deadline);

function update(){

const now = new Date();

const diff = deadline - now;

if(diff <= 0){

timer.textContent = "Deadline Passed";
timer.classList.add("text-red-600");

return;

}

const hours = Math.floor(diff / (1000*60*60));
const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));

timer.textContent = `${hours}h ${minutes}m`;

}

update();

setInterval(update,60000);

});

}

/************************************************
HOD ACTIONS
************************************************/

export function setupHodActions(){

/************************************************
STATUS CHANGE
************************************************/

document.addEventListener("change",(e)=>{

if(e.target.classList.contains("hodStatusSelect")){

const taskId = Number(e.target.dataset.id);

const tasks = getTasks();

const task = tasks.find(t=>t.id===taskId);

if(!task) return;

task.status = e.target.value;

saveTasks(tasks);

/* show submit button only if completed */

const card = e.target.closest(".taskCard");

const submitBtn = card.querySelector(".submitTaskBtn");

if(task.status === "Completed"){
submitBtn.classList.remove("hidden");
}
else{
submitBtn.classList.add("hidden");
}

}

});

/************************************************
SUBMIT TASK
************************************************/

document.addEventListener("click",(e)=>{

if(e.target.classList.contains("submitTaskBtn")){

const taskId = Number(e.target.dataset.id);

const tasks = getTasks();

const task = tasks.find(t=>t.id===taskId);

if(!task) return;

if(task.locked){
alert("Task already submitted");
return;
}

const replyInput =
document.querySelector(`.hodReply[data-id="${taskId}"]`);

const fileInput =
document.querySelector(`.hodFile[data-id="${taskId}"]`);

const reply = replyInput.value.trim();

if(!reply){
alert("Please write response");
return;
}

const file = fileInput.files[0];

if(!file){
alert("Upload response file");
return;
}

/************************************************
FILE READER
************************************************/

const reader = new FileReader();

reader.onload = function(){

task.hodReply = reply;

task.hodFile = reader.result;

task.status = "Completed";

task.locked = true;

saveTasks(tasks);

alert("Task submitted successfully");

loadHodTasks();

};

reader.readAsDataURL(file);

}

});

}