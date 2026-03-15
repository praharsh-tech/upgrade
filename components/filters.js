import { renderTasks } from "./renderTasks.js";

function getTasks(){
return JSON.parse(localStorage.getItem("tasks")) || [];
}

export function setupFilters(){

function applyFilters(){

const keyword =
document.getElementById("searchTask").value.toLowerCase();

const status =
document.getElementById("filterStatus").value;

let tasks = getTasks();

if(keyword){

tasks = tasks.filter(t =>
t.title.toLowerCase().includes(keyword) ||
t.description.toLowerCase().includes(keyword)
);

}

if(status){

tasks = tasks.filter(t => t.status === status);

}

renderTasks(tasks);

}

document
.getElementById("searchTask")
.addEventListener("input", applyFilters);

document
.getElementById("filterStatus")
.addEventListener("change", applyFilters);

}
