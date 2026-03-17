function getTasks(){
return JSON.parse(localStorage.getItem("tasks")) || [];
}

function updateDashboard(tasks){

const loggedInUser =
JSON.parse(localStorage.getItem("loggedInUser"));

const myTasks = tasks.filter(task =>
task.assignedTo.includes(loggedInUser.username) ||
task.assignedBy === loggedInUser.username
);

document.getElementById("totalTasks").textContent =
myTasks.length;

document.getElementById("completedTasks").textContent =
myTasks.filter(t=>t.status==="Completed").length;

document.getElementById("processingTasks").textContent =
myTasks.filter(t=>t.status==="Processing").length;

document.getElementById("pendingTasks").textContent =
myTasks.filter(t=>t.status==="Pending").length;

document.getElementById("lateTasks").textContent =
myTasks.filter(t=>t.status==="Late").length;

document.getElementById("failedTasks").textContent =
myTasks.filter(t=>t.status==="Failed").length;

}

export function loadHodTasks(){

const tasks =
JSON.parse(localStorage.getItem("tasks")) || [];

const loggedInUser =
JSON.parse(localStorage.getItem("loggedInUser"));

const hodTasks = tasks.filter(task =>
task.assignedTo.includes(loggedInUser.username) ||
task.assignedBy === loggedInUser.username
);

/* render tasks */

renderTasks(hodTasks);

/* update dashboard */

updateDashboard(tasks);

}

export function loadFacultyTasks(){

const user = JSON.parse(localStorage.getItem("loggedInUser"));

const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const facultyTasks = tasks.filter(t =>
t.assignedBy === user.username
);

const container = document.getElementById("facultyAssignedTasks");

if(!container) return;

container.innerHTML = "";

if(facultyTasks.length === 0){
container.innerHTML = "<p>No tasks assigned to faculty</p>";
return;
}

facultyTasks.forEach(task=>{

const div=document.createElement("div");

div.className="bg-white p-5 rounded-xl shadow";

div.innerHTML=`

<h3 class="text-lg font-semibold text-blue-700">
${task.title}
</h3>

<p class="text-sm text-gray-600">
${task.description}
</p>

<p class="text-sm">
<strong>Deadline:</strong> ${task.deadline}
</p>

<p class="text-sm mt-2">
<strong>Status:</strong> ${task.status}
</p>

<p class="text-sm text-gray-500">
Assigned To: ${task.assignedTo}
</p>

`;

container.appendChild(div);

});

}

function renderTasks(tasks){

const container = document.getElementById("hodTasks");

if(!container) return;

container.innerHTML="";

if(tasks.length===0){
container.innerHTML="<p>No tasks assigned</p>";
return;
}

tasks.forEach(task=>{

const div=document.createElement("div");

/* 🔥 if locked → small square */
const isLocked = task.locked;

div.className = isLocked
? "bg-white p-3 rounded-xl shadow h-48 flex flex-col justify-between"
: "bg-white p-5 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300";

div.innerHTML = `

<!-- TITLE -->
<h3 class="text-sm font-semibold text-blue-700 truncate">
${task.title}
</h3>

<!-- DESCRIPTION -->
<p class="text-xs text-gray-500 line-clamp-2">
${task.description}
</p>

<!-- DEADLINE -->
<p class="text-xs">
📅 ${task.deadline}
</p>

<!-- TIMER -->
<p class="text-xs font-semibold ${
task.status==="Completed" ? "text-green-600" : "text-red-500"
} timer"
<span class="timer"
data-deadline="${task.deadline}"
data-status="${task.status}">
</span>
⏳ Loading...
</p>

<!-- STATUS -->
<span class="px-2 py-0.5 text-[10px] rounded-full w-fit
${task.status==="Completed" ? "bg-green-100 text-green-700" :
task.status==="Processing" ? "bg-blue-100 text-blue-700" :
task.status==="Late" ? "bg-yellow-100 text-yellow-700" :
task.status==="Failed" ? "bg-red-100 text-red-700" :
"bg-gray-100 text-gray-700"}">

${task.status}

</span>

<!-- 🔓 IF NOT LOCKED → SHOW FORM -->
${!isLocked ? `

<div>
<label class="text-xs">Status</label>

<select
class="hodStatusSelect border p-1 w-full rounded text-xs"
data-id="${task.id}">

<option value="Pending" ${task.status==="Pending"?"selected":""}>Pending</option>
<option value="Processing" ${task.status==="Processing"?"selected":""}>Processing</option>
<option value="Completed">Completed</option>

</select>
</div>

<textarea
class="hodReply border p-1 w-full rounded text-xs"
rows="2"
data-id="${task.id}"
placeholder="Reply...">${task.hodReply || ""}</textarea>

<input
type="file"
class="hodFile border p-1 w-full rounded text-xs"
data-id="${task.id}">

<button
class="submitTaskBtn bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded w-full mt-1"
data-id="${task.id}">
Submit
</button>

` : `

<!-- 🔒 LOCKED VIEW -->
<p class="text-xs text-gray-600">
💬 ${task.hodReply || "No reply"}
</p>

${task.hodFile ? `
<a href="${task.hodFile}" class="text-blue-600 text-xs underline">
📎 File
</a>
` : ""}

<p class="text-green-600 text-xs font-semibold">
✅ Completed & Locked
</p>

`}

`;

container.appendChild(div);

});

}