import { users } from "../Data/Database.js";
import { loadHodProfile } from "../components/hodProfile.js";

/************************************************
PAGE PROTECTION
************************************************/

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser || loggedInUser.role !== "hod") {
window.location.href = "../index.html";
}

/************************************************
HEADER
************************************************/

document.getElementById("hodHeaderInfo").textContent =
`${loggedInUser.name} (${loggedInUser.dept})`;

/************************************************
FACULTY DROPDOWN
************************************************/

const facultySelect = document.getElementById("assignToSelect");

users
.filter(u => u.role === "faculty")
.forEach(fac => {

const option = document.createElement("option");

option.value = fac.username;
option.textContent = `${fac.name} (${fac.dept})`;

facultySelect.appendChild(option);

});

/************************************************
LOCAL STORAGE
************************************************/

function getTasks(){
return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks){
localStorage.setItem("tasks", JSON.stringify(tasks));
}

/************************************************
AUTO DEADLINE CHECK
************************************************/

function updateTaskDeadlines(){

const tasks = getTasks();

const now = new Date();

tasks.forEach(task=>{

if(!task.deadline) return;

const deadline = new Date(task.deadline);

const diffHours = (now - deadline)/(1000*60*60);

if(diffHours>0 && diffHours<=5 && task.status!=="Completed"){
task.status="Late";
}

if(diffHours>5 && task.status!=="Completed"){
task.status="Failed";
task.locked=true;
}

});

saveTasks(tasks);

}

/************************************************
DASHBOARD
************************************************/

function updateDashboard(){

const tasks = getTasks();

const hodTasks = tasks.filter(t =>
t.assignedTo.includes(loggedInUser.username) ||
t.assignedBy===loggedInUser.username
);

document.getElementById("totalTasks").textContent = hodTasks.length;

document.getElementById("completedTasks").textContent =
hodTasks.filter(t=>t.status==="Completed").length;

document.getElementById("processingTasks").textContent =
hodTasks.filter(t=>t.status==="Processing").length;

document.getElementById("pendingTasks").textContent =
hodTasks.filter(t=>t.status==="Pending").length;

document.getElementById("lateTasks").textContent =
hodTasks.filter(t=>t.status==="Late").length;

document.getElementById("failedTasks").textContent =
hodTasks.filter(t=>t.status==="Failed").length;

}

/************************************************
COUNTDOWN TIMER
************************************************/

function startTimers(){

document.querySelectorAll(".taskTimer").forEach(timer=>{

const deadline = new Date(timer.dataset.deadline);

function update(){

const now = new Date();

const diff = deadline-now;

if(diff<=0){
timer.textContent="Deadline Passed";
timer.classList.add("text-red-600");
return;
}

const h=Math.floor(diff/(1000*60*60));
const m=Math.floor((diff%(1000*60*60))/(1000*60));

timer.textContent=`${h}h ${m}m`;

}

update();
setInterval(update,60000);

});

}

/************************************************
LOAD TASKS
************************************************/

function loadHodTasks(){

updateTaskDeadlines();

const tasks = getTasks();

const hodTasks = tasks.filter(t =>
t.assignedTo.includes(loggedInUser.username) ||
t.assignedBy===loggedInUser.username
);

renderTasks(hodTasks);

updateDashboard();

}

/************************************************
RENDER TASKS
************************************************/

function renderTasks(tasks){

const container = document.getElementById("hodTasks");

container.innerHTML="";

if(tasks.length===0){
container.innerHTML="<p>No tasks available</p>";
return;
}

tasks.forEach(task=>{

const locked = task.locked;

const div=document.createElement("div");

div.className="bg-white p-5 rounded-xl shadow";

div.innerHTML=`

<h3 class="text-lg font-semibold text-blue-700">${task.title}</h3>

<p class="text-sm text-gray-600">${task.description}</p>

<p class="text-sm mt-2">
<strong>Deadline:</strong> ${task.deadline}
</p>

<p class="text-red-500 text-sm">
Time Left:
<span class="taskTimer" data-deadline="${task.deadline}"></span>
</p>

<p class="text-sm mt-1 font-medium">
Status:
<span>${task.status}</span>
</p>

${task.file ? `
<a href="${task.file}" download
class="text-blue-600 underline text-sm block mt-2">
Download Attachment
</a>
` : ""}

${!locked ? `

<select class="statusSelect border mt-3 p-2 w-full"
data-id="${task.id}">

<option value="Pending" ${task.status==="Pending"?"selected":""}>Pending</option>
<option value="Processing" ${task.status==="Processing"?"selected":""}>Processing</option>
<option value="Completed">Completed</option>

</select>

<textarea
class="replyBox border p-2 w-full mt-2"
data-id="${task.id}"
placeholder="Reply">${task.hodReply||""}</textarea>

<input type="file"
class="replyFile border p-2 w-full mt-2"
data-id="${task.id}">

<button
class="submitBtn bg-green-600 text-white px-4 py-2 rounded mt-3"
data-id="${task.id}">
Submit Task
</button>

` : `

<p class="text-green-600 font-semibold mt-2">
Task Submitted ✔ (Locked)
</p>

${task.hodFile ? `
<a href="${task.hodFile}" download
class="text-blue-600 underline text-sm block mt-1">
Download Response File
</a>
` : ""}

`}

`;

container.appendChild(div);

});

attachEvents();
startTimers();

}

/************************************************
TASK EVENTS
************************************************/

function attachEvents(){

document.querySelectorAll(".submitBtn").forEach(btn=>{

btn.addEventListener("click",(e)=>{

const id=Number(e.target.dataset.id);

const tasks=getTasks();

const task=tasks.find(t=>t.id===id);

if(!task) return;

const reply=document.querySelector(`.replyBox[data-id="${id}"]`);
const fileInput=document.querySelector(`.replyFile[data-id="${id}"]`);

const file=fileInput.files[0];

if(!reply.value){
alert("Write reply");
return;
}

if(!file){
alert("Upload response file");
return;
}

const reader=new FileReader();

reader.onload=function(){

task.hodReply=reply.value;
task.hodFile=reader.result;
task.status="Completed";
task.locked=true;

saveTasks(tasks);

alert("Task submitted");

loadHodTasks();

};

reader.readAsDataURL(file);

});

});

}

/************************************************
ASSIGN TASK
************************************************/

document.getElementById("assignTaskForm")
.addEventListener("submit",(e)=>{

e.preventDefault();

const faculty=facultySelect.value;
const title=document.getElementById("taskTitle").value.trim();
const desc=document.getElementById("taskDesc").value.trim();
const deadline=document.getElementById("taskDeadline").value;

if(!faculty || !title || !desc || !deadline){
alert("Fill all fields");
return;
}

const tasks=getTasks();

tasks.push({

id:Date.now(),
title,
description:desc,
deadline,
assignedBy:loggedInUser.username,
assignedTo:[faculty],
status:"Pending",
createdAt:new Date().toLocaleString()

});

saveTasks(tasks);

alert("Task assigned");

loadHodTasks();

});

/************************************************
LOGOUT
************************************************/

document.getElementById("logoutBtn")
.addEventListener("click",()=>{

localStorage.removeItem("loggedInUser");
window.location.href="../index.html";

});

/************************************************
INIT
************************************************/

loadHodProfile(loggedInUser);
loadHodTasks();
updateDashboard();