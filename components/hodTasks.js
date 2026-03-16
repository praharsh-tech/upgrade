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

div.className="bg-white p-5 rounded-xl shadow taskCard";

div.innerHTML = `

<div class="taskCard space-y-3">

<!-- TITLE -->
<h3 class="text-lg font-semibold text-blue-700">
${task.title}
</h3>

<!-- DESCRIPTION -->
<p class="text-gray-600 text-sm">
${task.description}
</p>

<!-- DEADLINE -->
<p class="text-sm">
<strong>Deadline:</strong> ${task.deadline}
</p>

<!-- STATUS -->
<div>
<label class="text-sm font-medium">Status</label>

<select
class="hodStatusSelect border p-2 w-full rounded mt-1"
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
</div>

<!-- REPLY -->
<div>
<label class="text-sm font-medium">Reply</label>

<textarea
class="hodReply border p-2 w-full rounded mt-1"
data-id="${task.id}"
placeholder="Write response...">${task.hodReply || ""}</textarea>
</div>

<!-- FILE -->
<div>
<label class="text-sm font-medium">Upload File</label>

<input
type="file"
class="hodFile border p-2 w-full rounded mt-1"
data-id="${task.id}">
</div>

<!-- SUBMIT BUTTON -->
<button
class="submitTaskBtn hidden bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full mt-2"
data-id="${task.id}">

Submit Task

</button>

</div>
`;

container.appendChild(div);

});

}

