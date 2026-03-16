/************************************************
PAGE PROTECTION
************************************************/

const user = JSON.parse(localStorage.getItem("loggedInUser"));

if(!user || user.role !== "faculty"){
window.location.href="../index.html";
}

/************************************************
PROFILE
************************************************/

document.getElementById("facultyHeader").textContent =
`${user.name} (${user.dept})`;

document.getElementById("facultyName").textContent = user.name;
document.getElementById("facultyDept").textContent = user.dept;
document.getElementById("facultyEmail").textContent = user.email;
document.getElementById("facultyPhone").textContent = user.phone;

document.getElementById("facultyImage").src =
user.pfp || "https://via.placeholder.com/120";

/************************************************
STORAGE
************************************************/

function getTasks(){
return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks){
localStorage.setItem("tasks",JSON.stringify(tasks));
}

/************************************************
LOAD TASKS
************************************************/

function loadFacultyTasks(){

const tasks = getTasks();

const facultyTasks = tasks.filter(t =>
t.assignedTo.includes(user.username)
);

renderTasks(facultyTasks);
updateDashboard(facultyTasks);

}

/************************************************
DASHBOARD
************************************************/

function updateDashboard(tasks){

document.getElementById("totalTasks").textContent = tasks.length;

document.getElementById("completedTasks").textContent =
tasks.filter(t=>t.status==="Completed").length;

document.getElementById("pendingTasks").textContent =
tasks.filter(t=>t.status!=="Completed").length;

}

/************************************************
RENDER TASKS
************************************************/

function renderTasks(tasks){

const container = document.getElementById("facultyTasks");

container.innerHTML="";

if(tasks.length===0){

container.innerHTML =
"<p class='text-gray-500'>No tasks assigned</p>";

return;

}

tasks.forEach(task=>{

const locked = task.locked;

const div=document.createElement("div");

div.className="bg-white p-6 rounded-xl shadow";

div.innerHTML=`

<h5 class="text-sm font-semibold text-indigo-300">
${task.assignedBy}
</h5>
<h3 class="text-lg font-semibold text-indigo-700">
${task.title}
</h3>

<p class="text-sm text-gray-600">
${task.description}
</p>

<p class="text-sm mt-2">
<strong>Deadline:</strong> ${task.deadline}
</p>

<label class="text-sm mt-3 block font-medium">
Status
</label>

<select
class="statusSelect border rounded p-2 w-full"
data-id="${task.id}"
${locked?"disabled":""}>

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

<label class="text-sm mt-3 block font-medium">
Reply
</label>

<textarea
class="replyBox border rounded p-2 w-full"
data-id="${task.id}"
${locked?"disabled":""}
>${task.facultyReply || ""}</textarea>

<label class="text-sm mt-3 block font-medium">
Upload File
</label>

<input
type="file"
class="replyFile border rounded p-2 w-full"
data-id="${task.id}"
${locked?"disabled":""}
>

<button
class="submitBtn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-3 w-full"
data-id="${task.id}"
${locked?"disabled":""}
>

Submit Task

</button>

${task.facultyFile ? `
<a href="${task.facultyFile}" download
class="text-green-600 underline text-sm block mt-2">
Download Submitted File
</a>
`:""}

`;

container.appendChild(div);

});

attachEvents();

}

/************************************************
EVENTS
************************************************/

function attachEvents(){

document.querySelectorAll(".submitBtn").forEach(btn=>{

btn.addEventListener("click",(e)=>{

const id = Number(e.target.dataset.id);

const tasks = getTasks();

const task = tasks.find(t=>t.id===id);

if(!task) return;

const reply =
document.querySelector(`.replyBox[data-id="${id}"]`);

const fileInput =
document.querySelector(`.replyFile[data-id="${id}"]`);

if(!reply.value){
alert("Write reply");
return;
}

const file = fileInput.files[0];

if(!file){
alert("Upload response file");
return;
}

const reader = new FileReader();

reader.onload=function(){

task.facultyReply = reply.value;
task.facultyFile = reader.result;
task.status="Completed";
task.locked=true;

saveTasks(tasks);

alert("Task submitted");

loadFacultyTasks();

};

reader.readAsDataURL(file);

});

});

}

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

loadFacultyTasks();