export function renderTasks(taskArray){

    const taskList = document.getElementById("taskList");
    
    taskList.innerHTML = "";
    
    if(taskArray.length === 0){
    
    taskList.innerHTML = "<p class='text-gray-500'>No tasks found</p>";
    return;
    
    }
    
    taskArray.forEach(task => {
    
    const div = document.createElement("div");
    
    div.className = "bg-white p-5 rounded-xl shadow";
    
    div.innerHTML = `
    
    <h3 class="text-lg font-semibold text-blue-700">${task.title}</h3>
    
    <p class="text-sm text-gray-600 mt-1">${task.description}</p>
    
    <div class="mt-2 text-sm space-y-1">
    
    <p><strong>Nature:</strong> ${task.nature}</p>
    
    <p><strong>Deadline:</strong> ${task.deadline}</p>
    
    <p><strong>Status:</strong> ${task.status}</p>
    
    <p><strong>Assigned To:</strong> ${task.assignedTo.join(", ")}</p>
    
    <p><strong>Support:</strong> ${task.support || "-"}</p>
    
    ${task.file ? `
    <a href="${task.file}" download
    class="text-blue-600 underline text-sm block">
    Download Task Attachment
    </a>
    ` : ""}
    
    </div>
    
    <div class="flex gap-3 mt-4">
    
    <button
    class="editTaskBtn bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
    data-id="${task.id}">
    Edit
    </button>
    
    <button
    class="deleteTaskBtn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
    data-id="${task.id}">
    Delete
    </button>
    
    </div>
    
    `;
    
    taskList.appendChild(div);
    
    });
    
    }