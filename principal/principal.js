import { users } from "../Data/Database.js";
import { renderTasks } from "../components/renderTasks.js";
import { setupTaskActions } from "../components/taskActions.js";
import { setupFilters } from "../components/filters.js";
import { loadHodPerformance, loadFacultyPerformance } from "../components/performance.js";

/************************************************
 PAGE PROTECTION
************************************************/
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser || loggedInUser.role !== "principal") {
window.location.href = "../index.html";
}

document.getElementById("principalName").textContent = loggedInUser.name;

/************************************************
 LOAD USERS
************************************************/

const assignToSelect = document.getElementById("assignTo");

const hodGroup = document.createElement("optgroup");
hodGroup.label = "HODs";

const facultyGroup = document.createElement("optgroup");
facultyGroup.label = "Faculty";

const otherGroup = document.createElement("optgroup");
otherGroup.label = "Others";

users.forEach(user => {

if (user.role === "principal") return;

const option = document.createElement("option");

option.value = user.username;
option.textContent = `${user.name} (${user.dept})`;

if (user.role === "hod") hodGroup.appendChild(option);
else if (user.role === "faculty") facultyGroup.appendChild(option);
else otherGroup.appendChild(option);

});

assignToSelect.append(hodGroup, facultyGroup, otherGroup);

/************************************************
 USER SEARCH
************************************************/

document.getElementById("userSearch").addEventListener("input",(e)=>{

const keyword = e.target.value.toLowerCase();

assignToSelect.querySelectorAll("option").forEach(opt=>{

opt.style.display = opt.textContent
.toLowerCase()
.includes(keyword) ? "block":"none";

});

});

/************************************************
 TASK STORAGE
************************************************/

export function getTasks(){
return JSON.parse(localStorage.getItem("tasks")) || [];
}

export function saveTasks(tasks){
localStorage.setItem("tasks",JSON.stringify(tasks));
}

/************************************************
 ADD TASK
************************************************/

document.getElementById("addTaskBtn").addEventListener("click",()=>{

const title = document.getElementById("taskTitle").value.trim();
const desc = document.getElementById("taskDesc").value.trim();
const nature = document.getElementById("taskNature").value;
const deadline = document.getElementById("taskDeadline").value;
const support = document.getElementById("supportPeople").value.trim();

const fileInput = document.getElementById("taskFile");
const file = fileInput.files[0];

const assignedTo =
Array.from(assignToSelect.selectedOptions).map(o=>o.value);

if(!title || !desc || !nature || !deadline || assignedTo.length===0){
alert("Please fill all required fields");
return;
}

const tasks = getTasks();

const saveTask = (fileData=null)=>{

const newTask={
id:Date.now(),
title,
description:desc,
nature,
deadline,
support,
file:fileData,
assignedBy:loggedInUser.username,
assignedTo,
status:"Pending",
createdAt:new Date().toLocaleString()
};

tasks.push(newTask);

saveTasks(tasks);

clearForm();

renderTasks(tasks);

loadHodPerformance();
loadFacultyPerformance();

};

if(file){

const reader=new FileReader();

reader.onload=()=>saveTask(reader.result);

reader.readAsDataURL(file);

}else{

saveTask();

}

});

/************************************************
 CLEAR FORM
************************************************/

function clearForm(){

document.getElementById("taskTitle").value="";
document.getElementById("taskDesc").value="";
document.getElementById("taskNature").value="";
document.getElementById("taskDeadline").value="";
document.getElementById("supportPeople").value="";
document.getElementById("taskFile").value="";
assignToSelect.selectedIndex=-1;

}
// LOGOUT
// ************************************************/
 document.getElementById("logoutBtn").addEventListener("click", () => {
   localStorage.removeItem("loggedInUser");
   window.location.href = "../index.html";
});
/************************************************
 INITIAL LOAD
************************************************/

renderTasks(getTasks());
setupTaskActions();
setupFilters();
loadHodPerformance();
loadFacultyPerformance();