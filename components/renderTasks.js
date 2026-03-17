import { users } from "../Data/Database.js";
export function renderTasks(taskArray){

const taskList = document.getElementById("taskList");

taskList.innerHTML = "";

if(taskArray.length === 0){
taskList.innerHTML = "<p class='text-gray-500'>No tasks found</p>";
return;
}

taskArray.forEach(task => {

const div = document.createElement("div");

/* 🔥 SQUARE CARD */
div.className = "bg-white p-3 rounded-xl shadow h-56 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-200";
const assignedNames = task.assignedTo
.map(username => {
const user = users.find(u => u.username === username);
return user ? user.name : username;
})
.join(", ");

div.innerHTML = `

<div class="text-[10px] text-gray-600 truncate">
👤 Assigned: ${assignedNames}
</div>

<!-- TOP -->
<div>
<h3 class="text-sm font-semibold text-blue-700 truncate">
${task.title}
</h3>

<p class="text-xs text-gray-500 line-clamp-2">
${task.description}
</p>
</div>

<!-- MIDDLE -->
<div class="text-xs space-y-1">

<p>📅 ${task.deadline}</p>

<p class="text-red-500 font-medium">
⏳ <span class="taskTimer" data-deadline="${task.deadline}" data-status="${task.status}">
Loading...
</span>
</p>

</div>

<!-- STATUS -->
<div class="flex justify-between items-center">

<span class="px-2 py-0.5 text-[10px] rounded-full
${task.status==="Completed" ? "bg-green-100 text-green-700" :
task.status==="Processing" ? "bg-blue-100 text-blue-700" :
task.status==="Late" ? "bg-yellow-100 text-yellow-700" :
task.status==="Failed" ? "bg-red-100 text-red-700" :
"bg-gray-100 text-gray-700"}">

${task.status}

</span>

</div>

<!-- HOD REPLY -->
<div class="text-[10px] text-gray-600 truncate">
💬 ${task.hodReply || "No reply"}
</div>

<!-- FILE -->
${task.hodFile ? `
<a href="${task.hodFile}" download
class="text-[10px] text-blue-600 underline">
📎 Download File
</a>
` : ""}

`;

taskList.appendChild(div);

});
}