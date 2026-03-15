export function loadHodProfile(){

    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    
    document.getElementById("hodHeaderInfo").textContent =
    `${user.name} (${user.dept})`;
    
    document.getElementById("hodFullName").textContent = user.name;
    document.getElementById("hodDept").textContent = user.dept;
    document.getElementById("hodEmail").textContent = user.email;
    document.getElementById("hodPhone").textContent = user.phone;
    
    document.getElementById("hodImage").src =
    user.pfp || "https://via.placeholder.com/150";
    
    }