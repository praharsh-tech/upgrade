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

const hodTasks = tasks.filter(t => t.assignedTo.includes(hod.username));

const total = hodTasks.length;
const completed = hodTasks.filter(t => t.status === "Completed").length;

const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

const card = document.createElement("div");

card.className = "bg-white p-5 rounded-xl shadow flex justify-between items-center";

card.innerHTML = `

<div>

<h3 class="text-lg font-semibold text-blue-700">${hod.name}</h3>

<p class="text-sm text-gray-600">Dept: ${hod.dept}</p>

<p class="text-sm mt-2">Tasks: ${completed} / ${total}</p>

</div>

<div class="text-lg font-bold text-green-600">${percentage}%</div>

`;

container.appendChild(card);

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