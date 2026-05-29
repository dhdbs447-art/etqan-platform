document.getElementById("adminBtn").onclick = () => {
  document.getElementById("loginBox").classList.toggle("hidden");
};

document.getElementById("loginBtn").onclick = () => {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  const savedUser = localStorage.getItem("admin_user") || "admin";
  const savedPass = localStorage.getItem("admin_pass") || "admin";

  if(u === savedUser && p === savedPass){
    sessionStorage.setItem("isAdmin","true");
    location.href = "admin.html";
  } else {
    alert("بيانات غير صحيحة");
  }
};
