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

// return true when update successfully, false otherwise
async function updateActivityName( token, courseId, activity_name ) {
    return fetch ( 'http://localhost:8080/moodle/webservice/rest/server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            wstoken: token,
            wsfunction: 'core_course_update_courses',
            moodlewsrestformat: 'json',
            'courses[0][id]': courseId,
            'courses[0][shortname]': activity_name
        })
    })
    .then ( ret => ret.json() )
    .then ( ret => {
        console.log('更新完畢：warnings: ', ret.warnings);
        return ret.warnings.length === 0;
    })
    .catch ( error => {
        console.error(error.message);
        return false;
    })
}

// return activity name when successfully
async function getActivityName( token, courseId ) {
    return fetch ( 'http://localhost:8080/moodle/webservice/rest/server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            wstoken: token,
            wsfunction: 'core_course_get_courses',
            moodlewsrestformat: 'json',
            'options[ids][0]': courseId
        })
    })
    .then ( ret => ret.json() )
    .then ( ret => ret[0].shortname )
    .catch ( error => console.error(error.message) );
}

const EVENT_NAME = '!activity!';
// return true when there's no ongoing activities(in this course), false otherwise
async function checkCourseActivity (token, courseId ) {
    return fetch ( 'http://localhost:8080/moodle/webservice/rest/server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            wstoken: token,
            wsfunction: 'core_calendar_get_calendar_upcoming_view',
            moodlewsrestformat: 'json',
            courseid: courseId
        })
    })
    .then ( ret => ret.json() )
    .then ( ret => {
        const timestamp = ret.date.timestamp;
        const events = ret.events;
        const progress_act = events.filter( e => e.name==EVENT_NAME && e.timestart+e.timeduration >= timestamp );
        return progress_act.length === 0;
    })
    .catch ( error => {
        console.error(error.message);
        return false;
    });
}

// return true when create activity successfully, false otherwise
async function createCourseActivity (token, courseId, duration/*in seconds*/ ) {
    fetch ( 'http://localhost:8080/moodle/webservice/rest/server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            wstoken: token,
            wsfunction: 'core_calendar_create_calendar_events',
            moodlewsrestformat: 'json',
            'events[0][name]': EVENT_NAME,
            'events[0][eventtype]': 'course',
            'events[0][courseid]': courseId,
            'events[0][timeduration]': duration * 60
        })
    })
    .then ( ret => ret.json() )
    .then ( ret => {
        console.log('更新完畢：warnings: ', ret.warnings);
        return ret.warnings.length === 0;
    })
    .catch ( error => {
        console.error(error.message);
        return false;
    })
}

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