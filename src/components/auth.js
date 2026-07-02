function checkLogin(requiredRole = null) {
    const user = JSON.parse(localStorage.getItem("currentUser"));
  
    if (!user) {
      window.location.href = "login.html";
      return;
    }
  
    if (requiredRole && user.role !== requiredRole) {
      alert("Unauthorized Access");
      window.location.href = "index.html";
    }
  }
  
  function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  }
  