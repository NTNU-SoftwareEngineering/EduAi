function logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
    window.location.href = 'login_edu.html';
}