

async function checkTokenVaild() {
    const wstoken = localStorage.getItem('token')
    const wsfunction='core_webservice_get_site_info'
    const response = await fetch('http://localhost:8080/moodle/webservice/rest/server.php?moodlewsrestformat=json', {
		method: 'POST',
		headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			wstoken,
            wsfunction
		}),
	});
	const data = await response.json()
    console.log(data)
    if(data.errorcode == "invalidtoken"){
        localStorage.removeItem("token");
        localStorage.removeItem("userid");
        window.location.href = "login_edu.html"
    }

}

setInterval(()=>{
    const token = localStorage.getItem('token');
    if ( !token ){
        window.location.href = 'login_edu.html';
        clearInterval()
    }
    
}, 100)

checkTokenVaild()
setInterval(() => {
    checkTokenVaild()
}, 15000);

