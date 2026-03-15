import { users } from "../Data/Database.js";

function getTasks(){
return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks){
localStorage.setItem("tasks",JSON.stringify(tasks));
}

export function setupAssignTask(){

const facultySelect=document.getElementById("assignToSelect");

users
.filter(u=>u.role==="faculty")
.forEach(fac=>{

const option=document.createElement("option");

option.value=fac.username;
option.textContent=`${fac.name} (${fac.dept})`;

facultySelect.appendChild(option);

});

document
.getElementById("assignTaskForm")
.addEventListener("submit",(e)=>{

e.preventDefault();

const user = JSON.parse(localStorage.getItem("loggedInUser"));

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
assignedBy:user.username,
assignedTo:[faculty],
status:"Pending",
createdAt:new Date().toLocaleString()

});

saveTasks(tasks);

alert("Task assigned");

});

}