function getTasks(){
    return JSON.parse(localStorage.getItem("tasks")) || [];
    }
    
    export function loadHodTasks(){
    
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    
    const tasks = getTasks();
    
    const hodTasks = tasks.filter(t =>
    t.assignedTo.includes(user.username)
    );
    
    renderTasks(hodTasks);
    
    }
    
    function renderTasks(tasks){
    
    const container = document.getElementById("hodTasks");
    
    container.innerHTML="";
    
    if(tasks.length===0){
    
    container.innerHTML="<p>No tasks assigned</p>";
    return;
    
    }
    
    tasks.forEach(task=>{
    
    const div=document.createElement("div");
    
    div.className="bg-white p-5 rounded-xl shadow";
    
    div.innerHTML = `
<div class="taskCard">

<h3 class="text-lg font-semibold text-blue-700">${task.title}</h3>

<p class="text-sm text-gray-600">${task.description}</p>

<p class="text-sm mt-2">
<strong>Deadline:</strong> ${task.deadline}
</p>

<p class="text-red-500 text-sm">
Time Left:
<span class="taskTimer" data-deadline="${task.deadline}"></span>
</p>

<select class="hodStatusSelect border mt-3 p-2 w-full"
data-id="${task.id}">

<option value="Pending" ${task.status==="Pending"?"selected":""}>Pending</option>

<option value="Processing" ${task.status==="Processing"?"selected":""}>Processing</option>

<option value="Completed" ${task.status==="Completed"?"selected":""}>Completed</option>

</select>

<textarea
class="hodReply border p-2 w-full mt-2"
data-id="${task.id}"
placeholder="Reply to Principal">${task.hodReply || ""}</textarea>

<label class="text-sm mt-2">Upload Response File</label>

<input
type="file"
class="hodFile border p-2 w-full mt-1"
data-id="${task.id}">

<button
class="submitTaskBtn hidden bg-green-600 text-white px-4 py-2 rounded mt-3"
data-id="${task.id}">
Submit Task
</button>

</div>
`;
    
    container.appendChild(div);
    
    });
    
    }