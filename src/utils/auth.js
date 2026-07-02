// Auth utility functions
export const checkLogin = (requiredRole) => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  
  if (!user) {
    // Redirect to login if not logged in
    window.location.href = "/login";
    return false;
  }
  
  if (user.role !== requiredRole) {
    // Redirect to appropriate dashboard if wrong role
    if (user.role === "student") {
      window.location.href = "/student-dashboard";
    } else if (user.role === "coordinator") {
      window.location.href = "/coordinator-dashboard";
    } else {
      window.location.href = "/admin-dashboard";
    }
    return false;
  }
  
  return true;
};

export const logout = () => {
  localStorage.removeItem("currentUser");
  window.location.href = "/login";
};
