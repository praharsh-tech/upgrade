import { loadHodTasks } from "./hodTasks.js";

function getTasks(){
return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks){
localStorage.setItem("tasks",JSON.stringify(tasks));
}

/************************************************
TIMER SYSTEM
************************************************/

export function startTaskTimers(){

function updateTimers(){

const timers = document.querySelectorAll(".timer");

timers.forEach(timer=>{

const deadline = new Date(timer.dataset.deadline);
const now = new Date();

const diff = deadline - now;

if(diff <= 0){

const hoursLate = Math.abs(diff) / (1000*60*60);

if(hoursLate <= 5){

timer.textContent = "⚠️ Late";
timer.className = "timer text-orange-500 font-semibold";

}else{

timer.textContent = "❌ Failed";
timer.className = "timer text-red-600 font-semibold";

}

return;
}

const hours = Math.floor(diff/(1000*60*60));
const minutes = Math.floor((diff%(1000*60*60))/(1000*60));
const seconds = Math.floor((diff%(1000*60))/1000);

timer.textContent = `⏳ ${hours}h ${minutes}m ${seconds}s`;

});

}

updateTimers();

setInterval(updateTimers,1000);

}

/************************************************
HOD ACTIONS
************************************************/

export function setupHodActions(){

/* STATUS CHANGE */

document.addEventListener("change",(e)=>{

if(e.target.classList.contains("hodStatusSelect")){

const id = Number(e.target.dataset.id);

const tasks = getTasks();

const task = tasks.find(t=>t.id===id);

if(!task || task.locked) return;

task.status = e.target.value;

saveTasks(tasks);

const card = e.target.closest(".taskCard");
const submitBtn = card.querySelector(".submitTaskBtn");

if(task.status==="Completed"){
submitBtn.classList.remove("hidden");
}else{
submitBtn.classList.add("hidden");
}

}

});


/* SUBMIT TASK */

document.addEventListener("click",(e)=>{

if(e.target.classList.contains("submitTaskBtn")){

const id = Number(e.target.dataset.id);

const tasks = getTasks();
const task = tasks.find(t=>t.id===id);

if(task.locked){
alert("Task already submitted");
return;
}

const reply = document.querySelector(`.hodReply[data-id="${id}"]`);
const fileInput = document.querySelector(`.hodFile[data-id="${id}"]`);

const file = fileInput.files[0];

if(!reply.value){
alert("Write reply");
return;
}

if(!file){
alert("Upload file");
return;
}

const reader = new FileReader();

reader.onload = function(){

task.hodReply = reply.value;
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