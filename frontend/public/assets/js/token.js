function fetchData() {
    const token = localStorage.getItem('token');
    if ( !token ) window.location.href = 'login_edu.html';
    
    fetch('http://localhost:8080/moodle/webservice/rest/server.php', { //取得用戶資訊（userid）
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            wstoken: token,
            wsfunction: 'core_webservice_get_site_info',
            moodlewsrestformat: 'json'
        })
    })
    .then( response =>{
        return response.json()  
    })
    .then( (data) => {

        

        return fetch('http://localhost:8080/moodle/webservice/rest/server.php', { //取得該用戶註冊的課程列表
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                wstoken: token,
                wsfunction: 'core_enrol_get_users_courses',
                moodlewsrestformat: 'json',
                userid: data.userid
            })
        });
        
        
    })
    .then( response =>{ 
        return response.json()
         
    })
    .then( data => {
        console.log("取得用戶註冊的課程列表");
        return data.map( j => j.fullname );
    })
    .then( courses => {
        // 更改 course-dropdown-menu 下拉選單的值
        const course_select_ele = document.getElementById('course-select');
        console.log(course_select_ele);
        
        // 將靜態網頁預填的選項清空
        course_select_ele.innerHTML = '';

        courseList = courses
        course_status = new Array(courseList.length)
        for(var i=0;i<courseList.length;i++) course_status[i] = 0
        
        for(var i=0;i<courseList.length;i++){
            course_select_ele.innerHTML += '<a class="course-dropdown-item" onclick="select_course('+i+')"><div>' + courseList[i] + '</div></a>'    
        }
    })
    .catch( error => {
        console.error('錯誤:', error);
        
    });
}
document.addEventListener("DOMContentLoaded", fetchData);


async function checkTokenVaild() {
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

