import { users } from "../Data/Database.js";
import { loadHodTasks } from "./hodTasks.js";

function getTasks(){
return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks){
localStorage.setItem("tasks", JSON.stringify(tasks));
}

export function setupAssignTask(){

const facultySelect = document.getElementById("assignToSelect");

/************************************************
LOAD FACULTY INTO DROPDOWN
************************************************/

facultySelect.innerHTML = `<option value="">Select Faculty</option>`;

users
.filter(user => user.role === "faculty")
.forEach(user => {

const option = document.createElement("option");

option.value = user.username;
option.textContent = `${user.name} (${user.dept})`;

facultySelect.appendChild(option);

});

/************************************************
ASSIGN TASK FORM
************************************************/

const form = document.getElementById("assignTaskForm");

form.addEventListener("submit",(e)=>{

e.preventDefault();

const loggedInUser =
JSON.parse(localStorage.getItem("loggedInUser"));

const faculty = facultySelect.value;

const title =
document.getElementById("taskTitle").value.trim();

const desc =
document.getElementById("taskDesc").value.trim();

const deadline =
document.getElementById("taskDeadline").value;

const fileInput =
document.getElementById("taskFile");

const file = fileInput.files[0];

if(!faculty || !title || !desc || !deadline){

alert("Please fill all fields");
return;

}

const tasks = getTasks();

const saveTask = (fileData=null)=>{

tasks.push({

id: Date.now(),
title,
description: desc,
deadline,
assignedBy: loggedInUser.username,
assignedTo: [faculty],
status: "Pending",
file: fileData,
createdAt: new Date().toLocaleString()

});

saveTasks(tasks);

alert("Task assigned to faculty");

form.reset();

loadHodTasks();

};

/************************************************
FILE UPLOAD
************************************************/

if(file){

const reader = new FileReader();

reader.onload = () => saveTask(reader.result);

reader.readAsDataURL(file);

}else{

saveTask();

}

});

}