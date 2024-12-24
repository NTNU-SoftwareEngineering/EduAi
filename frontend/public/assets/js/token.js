

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

    if(data.errorcode == "invalidtoken"){
        localStorage.removeItem("token");
        localStorage.removeItem("userid");
        window.location.href = "login_edu.html"
    }

    courseObjList = await fetchCourses();
    // console.log(courseObjList[0])
    courseList = courseObjList.map(c => c.id);
    course_first = courseList[0]
    // 清除錯誤訊息
    userid = await get_userid()
    role = await get_role_from_course(course_first,userid)
    if(role==5)
        localStorage.setItem('role', '學生');
    else localStorage.setItem('role', '老師');

    if (role == 5) {
        if(window.location.href.includes("teacher"))
            window.location.href = "./student_user_data_edu.html"
        if(window.location.href.includes("tcfb"))
            window.location.href = "./student_user_data_edu.html"
    }
    else{
        if(window.location.href.includes("student"))
            window.location.href = "./teacher_user_data_edu.html"
        if(window.location.href.includes("stufb"))
            window.location.href = "./teacher_user_data_edu.html"
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

