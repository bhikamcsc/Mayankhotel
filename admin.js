const ADMIN_PASSWORD = "mayank@2026";

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const adminPass = document.getElementById("adminPass");
const loginBox = document.getElementById("loginBox");
const adminPanel = document.getElementById("adminPanel");

loginBtn.addEventListener("click", function () {
  const pass = adminPass.value.trim();

  if (pass === ADMIN_PASSWORD) {
    loginBox.style.display = "none";
    adminPanel.style.display = "block";
  } else {
    alert("Wrong Password");
  }
});

adminPass.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    loginBtn.click();
  }
});

logoutBtn.addEventListener("click", function () {
  adminPanel.style.display = "none";
  loginBox.style.display = "block";
  adminPass.value = "";
});
