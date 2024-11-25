function fetchCourses() {
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
        return data.map( j => j.fullname );
    })
    .then( courses => {
        // 更改 sourse-select 下拉選單的值
        const course_select_ele = document.getElementById('course-select');
        
        // 將靜態網頁預填的選項清空
        course_select_ele.innerHTML = '<option value="" disabled selected>請選擇課程</option>';
        
        courses.forEach ( course => {
            const option = document.createElement('option');
            option.value = course;
            option.textContent = course;
            course_select_ele.appendChild(option);
        });
    })
    .catch( error => {
        console.error('錯誤:', error);
    });
}
document.addEventListener("DOMContentLoaded", fetchCourses);