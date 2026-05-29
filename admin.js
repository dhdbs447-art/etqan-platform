if(sessionStorage.getItem("isAdmin") !== "true"){
  location.href = "index.html";
}

document.getElementById("logout").onclick = () => {
  sessionStorage.removeItem("isAdmin");
  location.href = "index.html";
};
