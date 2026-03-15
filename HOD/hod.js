import { loadHodProfile } from "../components/hodProfile.js";
import { loadHodTasks , loadFacultyTasks } from "../components/hodTasks.js";
import { setupHodActions, startTaskTimers } from "../components/hodActions.js";
import { setupAssignTask } from "../components/hodAssignTask.js";
/************************************************
PAGE PROTECTION
************************************************/

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!loggedInUser || loggedInUser.role !== "hod") {
window.location.href = "../index.html";
}

/************************************************
LOGOUT
************************************************/

document.getElementById("logoutBtn").addEventListener("click",()=>{
localStorage.removeItem("loggedInUser");
window.location.href="../index.html";
});

/************************************************
INIT
************************************************/

loadHodProfile();
loadHodTasks();
loadFacultyTasks();
setupHodActions();
setupAssignTask();

startTaskTimers();