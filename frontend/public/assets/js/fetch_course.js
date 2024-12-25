async function fetchCourses() {
    const token = localStorage.getItem('token');
    if ( !token ) window.location.href = 'login_edu.html';
    

    return fetch('https://eduai-api.andy-lu.dev/moodle/webservice/rest/server.php', { //取得用戶資訊（userid）

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
        return fetch('https://eduai-api.andy-lu.dev/moodle/webservice/rest/server.php', { //取得該用戶註冊的課程列表
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
    .catch( error => {
        console.error('錯誤:', error);
    });
}

const ROOT_ASSIGNMENT_NAME = "!root_assignment!";

// return new module id when success, -1 otherwise
async function createAssignment ( token, courseId ) {
    const old_modules = new Set();
    const mid = await fetch ( 'https://eduai-api.andy-lu.dev/moodle/webservice/rest/server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            wstoken: token,
            wsfunction: 'core_course_get_contents',
            moodlewsrestformat: 'json',
            courseid: courseId,
        })
    })
    .then( ret=>ret.json() )
    .then ( sections => {
        let module_id = -1;
        // console.log(sections)
        sections.forEach( s => {
            s.modules.forEach( m => {
                if ( m.name === ROOT_ASSIGNMENT_NAME ) {
                    module_id = m.id;
                }
                old_modules.add(m.id);
            });
        });
        if ( module_id == -1 ) {
            console.error(`找不到課程：${ROOT_ASSIGNMENT_NAME}`);
        }
        return module_id;
    })
    .catch ( error => console.error(error.message) );
    
    if ( mid == -1 ) return -1;
    
    await fetch ( 'https://eduai-api.andy-lu.dev/moodle/webservice/rest/server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            wstoken: token,
            wsfunction: 'core_course_edit_module',
            moodlewsrestformat: 'json',
            action: 'duplicate',
            id: mid
        })
    })
    
    // return new mod id
    return fetch ( 'https://eduai-api.andy-lu.dev/moodle/webservice/rest/server.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            wstoken: token,
            wsfunction: 'core_course_get_contents',
            moodlewsrestformat: 'json',
            courseid: courseId,
        })
    })
    .then( ret=>ret.json() )
    .then ( sections => {
        // console.log(sections)
        let new_mod_id = -1;
        sections.forEach( s => {
            s.modules.forEach( m => {
                if ( !old_modules.has(m.id) ) new_mod_id = m.id;
            });
        });
        return new_mod_id;
    })
    .catch ( error => {
        console.error(error.message);
        return -1;
    })
}

// return true when update successfully, false otherwise
async function updateActivityName( token, courseId, activity_name ) {
    return fetch ( 'https://eduai-api.andy-lu.dev/moodle/webservice/rest/server.php', {
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
    return fetch ( 'https://eduai-api.andy-lu.dev/moodle/webservice/rest/server.php', {
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
    return fetch ( 'https://eduai-api.andy-lu.dev/moodle/webservice/rest/server.php', {
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
    fetch ( 'https://eduai-api.andy-lu.dev/moodle/webservice/rest/server.php', {
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
    const response = await fetch('https://eduai-api.andy-lu.dev/moodle/webservice/rest/server.php?moodlewsrestformat=json', {
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
    const response = await fetch(`https://eduai-api.andy-lu.dev/moodle/webservice/rest/server.php?moodlewsrestformat=json`, {
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
    const response = await fetch(`https://eduai-api.andy-lu.dev/moodle/webservice/rest/server.php?moodlewsrestformat=json`, {
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
    const response = await fetch(`https://eduai-api.andy-lu.dev/moodle/webservice/rest/server.php?moodlewsrestformat=json&field=id&values[0]=${userid}`, {
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