import { users } from "../Data/Database.js";

function getTasks(){
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

/************************************************
 📊 HOD PERFORMANCE
************************************************/
export function loadHodPerformance(){

const container = document.getElementById("hodPerformance");
if(!container) return;

const tasks = getTasks();
const hods = users.filter(u => u.role === "hod");

container.innerHTML = "";

hods.forEach(hod => {

const hodTasks = tasks.filter(t =>
t.assignedTo.includes(hod.username)
);

const total = hodTasks.length;

const completed =
hodTasks.filter(t => t.status === "Completed").length;

const percentage =
total === 0 ? 0 : Math.round((completed / total) * 100);

/* simple sparkline data */
const trend = [10,40,20,60,50,80,percentage];

const points = trend
.map((v,i)=>`${i*20},${100-v}`)
.join(" ");

const card = document.createElement("div");

card.className =
"bg-white p-6 rounded-xl shadow transition-all duration-300 hover:shadow-2xl hover:-translate-y-1";

card.innerHTML = `

<div class="flex items-center gap-4 mb-3">

<img
src="${hod.pfp || 'https://i.pravatar.cc/100'}"
class="w-12 h-12 rounded-full border object-cover"
/>

<div>

<h3 class="text-lg font-semibold text-blue-700">
${hod.name}
</h3>

<p class="text-sm text-gray-500">${hod.dept}</p>

</div>

<div class="ml-auto text-green-600 font-bold text-lg">
${percentage}%
</div>

</div>

<p class="text-sm mb-2">Tasks: ${completed} / ${total}</p>

<div class="w-full bg-gray-200 rounded-full h-2 mb-4">
<div class="bg-green-500 h-2 rounded-full"
style="width:${percentage}%">
</div>
</div>

<canvas id="chart-${hod.username}" height="80"></canvas>

`;

container.appendChild(card);

const ctx = document
.getElementById(`chart-${hod.username}`)
.getContext("2d");

new Chart(ctx, {
type: "bar",
data: {
labels: ["Assigned", "Completed"],
datasets: [{
label: "Tasks",
data: [total, completed],
backgroundColor: [
"#6366f1",
"#22c55e"
],
borderRadius: 6
}]
},
options: {
plugins:{
legend:{display:false}
},
scales:{
y:{
display:false,
beginAtZero:true
},
x:{
grid:{display:false}
}
}
}
});

});

}

/************************************************
 📊 FACULTY PERFORMANCE
************************************************/
export function loadFacultyPerformance(){

const container = document.getElementById("facultyPerformance");
if(!container) return;

const tasks = getTasks();
const faculties = users.filter(u => u.role === "faculty");

container.innerHTML = "";

faculties.forEach(fac => {

const facTasks = tasks.filter(t => t.assignedTo.includes(fac.username));

const total = facTasks.length;
const completed = facTasks.filter(t => t.status === "Completed").length;

const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

const card = document.createElement("div");

card.className = "bg-white p-5 rounded-xl shadow flex justify-between items-center";

card.innerHTML = `

<div>

<h3 class="text-lg font-semibold text-blue-700">${fac.name}</h3>

<p class="text-sm text-gray-600">${fac.dept}</p>

<p class="text-sm mt-2">Tasks: ${completed} / ${total}</p>

</div>

<div class="text-lg font-bold text-green-600">${percentage}%</div>

`;

container.appendChild(card);

});

}