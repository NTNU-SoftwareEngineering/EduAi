async function fetchCourses() {
    const token = localStorage.getItem('token');
    if ( !token ) window.location.href = 'login_edu.html';
    

    return fetch('http://localhost:8080/moodle/webservice/rest/server.php', { //取得用戶資訊（userid）

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
    .then( response => response.json() )
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
    .then( response => response.json() )
    .then( data => {
        console.log("取得用戶註冊的課程列表");
        console.log(data);
        return data;
        // return data.map( j => j.fullname );
    })
    /*.then( courses => {
        // 更改 sourse-select 下拉選單的值
        return courses;
        const course_select_ele = document.getElementById('course-select');
        const pref = course_select_ele.getAttribute('pref');
        const suff = course_select_ele.getAttribute('suff');
        const init = course_select_ele.getAttribute('init');
        
        // 將靜態網頁預填的選項清空
        if ( init ) course_select_ele.innerHTML = init;
        
        let options = courses.map( c => pref+c+suff );
        options = options.join('\n');
        course_select_ele.innerHTML += options;
    })*/
    .catch( error => {
        console.error('錯誤:', error);
    });
}
// document.addEventListener("DOMContentLoaded", fetchCourses);
async function get_userid(){
    // change class information
    const wstoken = localStorage.getItem('token')
    const wsfunction='core_webservice_get_site_info'
    const response = await fetch('http://localhost:8080/moodle/webservice/rest/server.php?moodlewsrestformat=json', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            wstoken,  
            wsfunction  // API 對應的服務名稱，需確認
        }),
    });
    const data = await response.json()
    return data.userid
} 
async function get_role_from_course(courseid,userid){
    // change class information
    const wsfunction = 'core_enrol_get_enrolled_users'
    const wstoken = localStorage.getItem('token')
    const response = await fetch(`http://localhost:8080/moodle/webservice/rest/server.php?moodlewsrestformat=json`, {
		method: 'POST',
		headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			wstoken,  
			wsfunction,  // API 對應的服務名稱，需確認
            courseid:courseid
		}),
	});
    const data = await response.json()
    console.log(data);
    if (data.exception) {
        throw new Error(`Error fetching course participants: ${data.message}`);
    }
    for(let i = 0;i<data.length;i++){
        if(data[i].id==userid){
            return data[i].roles[0].roleid
        }
    }
} 
async function get_student_from_course(courseid){
    // change class information
    const wsfunction = 'core_enrol_get_enrolled_users'
    const wstoken = localStorage.getItem('token')
    const response = await fetch(`http://localhost:8080/moodle/webservice/rest/server.php?moodlewsrestformat=json`, {
		method: 'POST',
		headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			wstoken,  
			wsfunction,  // API 對應的服務名稱，需確認
            courseid:courseid
		}),
	});
    const data = await response.json()
    console.log(data);
    if (data.exception) {
        throw new Error(`Error fetching course participants: ${data.message}`);
    }

    // Filter out users with the "Teacher" role
    const userIds = data
        .filter(user => !user.roles.some(role => role.roleid === 3)) // Adjust roleid if necessary
        .map(user => user.id); // Extract only user IDs

    console.log("User IDs (Without Teachers):", userIds);
    return userIds; // Return an array of user IDs
}
async function get_user_fullname_by_id(userid){
    // change class information
    const wsfunction = 'core_user_get_users_by_field'
    const wstoken = localStorage.getItem('token')
    const response = await fetch(`http://localhost:8080/moodle/webservice/rest/server.php?moodlewsrestformat=json&field=id&values[0]=${userid}`, {
		method: 'POST',
		headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			wstoken,  
			wsfunction,  // API 對應的服務名稱，需確認
		}),
	});
    const data = await response.json()
    // console.log("aaa")
    // console.log(data)
    return data[0].fullname
}