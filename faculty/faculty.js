import { users } from "../Data/Database.js";

/************************************************
🔐 PAGE PROTECTION
************************************************/

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser || loggedInUser.role !== "faculty") {
  window.location.href = "../index.html";
}

/************************************************
👤 LOAD FACULTY PROFILE
************************************************/

document.getElementById("facultyHeader").textContent =
`${loggedInUser.name} (${loggedInUser.dept})`;

document.getElementById("facultyName").textContent = loggedInUser.name;
document.getElementById("facultyDept").textContent = loggedInUser.dept;
document.getElementById("facultyEmail").textContent = loggedInUser.email;
document.getElementById("facultyPhone").textContent = loggedInUser.phone;

document.getElementById("facultyImage").src =
loggedInUser.pfp || "https://via.placeholder.com/120";

/************************************************
🗂 TASK STORAGE
************************************************/

function getTasks(){
return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks){
localStorage.setItem("tasks", JSON.stringify(tasks));
}

/************************************************
📋 LOAD FACULTY TASKS
************************************************/

function loadFacultyTasks(){

const tasks = getTasks();

const facultyTasks = tasks.filter(task =>
task.assignedTo.includes(loggedInUser.username)
);

renderTasks(facultyTasks);
updateDashboard(facultyTasks);

}

/************************************************
📊 DASHBOARD COUNTS
************************************************/

function updateDashboard(tasks){

const total = tasks.length;

const completed = tasks.filter(
t => t.status === "Completed"
).length;

const pending = tasks.filter(
t => t.status !== "Completed"
).length;

document.getElementById("totalTasks").textContent = total;
document.getElementById("completedTasks").textContent = completed;
document.getElementById("pendingTasks").textContent = pending;

}

/************************************************
📋 RENDER TASKS
************************************************/

function renderTasks(tasks){

const container = document.getElementById("facultyTasks");

container.innerHTML = "";

if(tasks.length === 0){

container.innerHTML =
"<p class='text-gray-500'>No tasks assigned</p>";

return;

}

tasks.forEach(task=>{

const div = document.createElement("div");

div.className="bg-white p-5 rounded-xl shadow";

div.innerHTML = `

<h3 class="text-lg font-semibold text-blue-700">
${task.title}
</h3>

<p class="text-sm text-gray-600 mt-1">
${task.description}
</p>

<p class="text-sm mt-2">
<strong>Deadline:</strong> ${task.deadline}
</p>

<p class="text-sm">
<strong>Status:</strong> ${task.status}
</p>

${task.file ? `
<a href="${task.file}" download
class="text-blue-600 underline text-sm block mt-2">
Download Attachment
</a>
` : ""}

<label class="block text-sm mt-3 font-medium">
Update Status
</label>

<select class="statusSelect border rounded p-2 w-full mt-1"
data-id="${task.id}">

<option value="Pending" ${task.status==="Pending"?"selected":""}>
Pending
</option>

<option value="Processing" ${task.status==="Processing"?"selected":""}>
Processing
</option>

<option value="Completed" ${task.status==="Completed"?"selected":""}>
Completed
</option>

</select>

<label class="block text-sm mt-3 font-medium">
Reply to HOD
</label>

<textarea
class="replyBox border rounded p-2 w-full mt-1"
data-id="${task.id}"
placeholder="Write response...">${task.facultyReply || ""}</textarea>

<label class="block text-sm mt-3 font-medium">
Upload Response File
</label>

<input
type="file"
class="replyFile border rounded p-2 w-full mt-1"
data-id="${task.id}"
>

<button
class="saveReplyBtn bg-blue-600 text-white px-3 py-1 rounded mt-3"
data-id="${task.id}">
Save Response
</button>

${task.facultyFile ? `
<a href="${task.facultyFile}" download
class="text-green-600 underline text-sm block mt-2">
Download Uploaded Response
</a>
` : ""}

`;

container.appendChild(div);

});

attachEvents();

}

/************************************************
⚡ TASK EVENTS
************************************************/

function attachEvents(){

/* STATUS UPDATE */

document.querySelectorAll(".statusSelect").forEach(select=>{

select.addEventListener("change",(e)=>{

const id = Number(e.target.dataset.id);

const tasks = getTasks();

const task = tasks.find(t=>t.id === id);

if(task){

task.status = e.target.value;
task.updatedAt = new Date().toLocaleString();

saveTasks(tasks);

}

});

});

/* SAVE RESPONSE */

document.querySelectorAll(".saveReplyBtn").forEach(btn=>{

btn.addEventListener("click",(e)=>{

const id = Number(e.target.dataset.id);

const tasks = getTasks();

const task = tasks.find(t=>t.id === id);

if(!task) return;

const replyBox = document.querySelector(
`.replyBox[data-id="${id}"]`
);

const fileInput = document.querySelector(
`.replyFile[data-id="${id}"]`
);

task.facultyReply = replyBox.value;

const file = fileInput.files[0];

if(file){

const reader = new FileReader();

reader.onload = function(){

task.facultyFile = reader.result;

saveTasks(tasks);

loadFacultyTasks();

};

reader.readAsDataURL(file);

}else{

saveTasks(tasks);

alert("Response saved");

}

});

});

}

/************************************************
🚪 LOGOUT
************************************************/

document.getElementById("logoutBtn")
.addEventListener("click",()=>{

localStorage.removeItem("loggedInUser");

window.location.href="../index.html";

});

/************************************************
🚀 INIT
************************************************/

loadFacultyTasks();