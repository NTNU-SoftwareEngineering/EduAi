let dropdown_expand = 0
let didSendMessage = 0
let username = "王小明" //backend should modify and offer the username of the account
let courseList = [] 

let course_status = new Array(courseList.length)

function fetchData() {
    const token = localStorage.getItem('token');
   // if ( !token ) window.location.href = 'login_edu.html';
    
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

function select_course(index){
    for(var i=0;i<courseList.length;i++) course_status[i] = 0
    course_status[index] = 1

    const dropdown_menu = document.querySelector("#course-select");

    dropdown_menu.innerHTML = ''
    for(var i=0;i<courseList.length;i++){
        if(!course_status[i]) dropdown_menu.innerHTML += '<a class="course-dropdown-item" onclick="select_course('+i+')"><div>' + courseList[i] + '</div></a>'
        else dropdown_menu.innerHTML += '<a class="course-dropdown-item" onclick="select_course('+i+')"><div>' + courseList[i] + '</div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 25" fill="none">\
        <path d="M8 13.3333L11.6667 18L19 8" stroke="#1F1F1F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\
      </svg></a>'
    }

    document.querySelector("body > div > div > div > div.top-label > div.flex > button").innerHTML = courseList[index] + 
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">\
    <path d="M6 9L12 15L18 9" stroke="#1F1F1F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\
    </svg>'
    
    document.querySelector("body > div > div > div > div.top-label > div.flex > button").style.color = '#363636'
    document.querySelector("#message").placeholder = "請先開始錄音"

    document.querySelector("body > div > div > div > div.send-message > button.mic-button").removeAttribute("disabled")

    document.querySelector("body > div > div > div > div.send-message > button").style.backgroundImage = "url('./assets/images/student_discussion/student_discussion_mic-icon2.svg')";
    

    dropdownMenuCSSModify()
}   


function dropdownMenuCSSModify(){

    const dropdown_menu = document.querySelector("#course-select");

    dropdown_menu.style.display = dropdown_expand ? "none" : "flex";


    dropdown_expand = dropdown_expand ? 0 : 1;

    dropdown_menu.innerHTML = ''

    if(dropdown_expand){

        for(var i=0;i<courseList.length;i++){
            if(!course_status[i]) dropdown_menu.innerHTML += '<a class="course-dropdown-item" onclick="select_course('+i+')"><div>' + courseList[i] + '</div></a>'
            else dropdown_menu.innerHTML += '<a class="course-dropdown-item" onclick="select_course('+i+')"><div>' + courseList[i] + '</div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 25" fill="none"> \
            <path d="M8 13.3333L11.6667 18L19 8" stroke="#1F1F1F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> \
          </svg></a>'
        }

    }

}

