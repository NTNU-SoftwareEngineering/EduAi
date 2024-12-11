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