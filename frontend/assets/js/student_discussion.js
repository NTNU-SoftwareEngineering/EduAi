let dropdown_expand = 0
let didSendMessage = 0
let username = "王小明" //backend should modify and offer the username of the account
let courseList = [] 

let course_status = new Array(courseList.length)

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

    const dropdown_menu = document.querySelector("body > div > div > div.left-side-bar > div.select-course.mt-4 > div.flex > div");

    dropdown_menu.innerHTML = ''
    for(var i=0;i<courseList.length;i++){
        if(!course_status[i]) dropdown_menu.innerHTML += '<a class="course-dropdown-item" onclick="select_course('+i+')"><div>' + courseList[i] + '</div></a>'
        else dropdown_menu.innerHTML += '<a class="course-dropdown-item" onclick="select_course('+i+')"><div>' + courseList[i] + '</div><div class=check_icon></div></a>'
    }

    const record_btn = document.querySelector("body > div > div > div.left-side-bar > div.speech-upload > button")
    record_btn.style.backgroundColor = '#502F96'
    document.getElementsByClassName('upload-icon')[0].style.backgroundImage = 'url(./assets/images/student_discussion/upload-light.svg)'
    document.getElementsByClassName('upload-icon')[1].style.backgroundImage = 'url(./assets/images/student_discussion/upload-light.svg)'
    document.getElementsByClassName('file-name')[0].innerHTML = ''
    document.getElementsByClassName('file')[0].style.display = 'none'
    document.getElementById("audio").style.display = 'block'
    document.querySelector("body > div > div > div.left-side-bar > div.speech-upload > button > span").style.color = '#FFF'
    document.querySelector("#record-stop > span").style.color = '#FFF'
}   


function detectEnter(ele){

    if(event.key == 'Enter'){
        SendMessage()
    }

}

function dropdownMenuCSSModify(){

    const dropdown_menu = document.querySelector("body > div > div > div.left-side-bar > div.select-course.mt-4 > div.flex > div");

    dropdown_menu.style.display = dropdown_expand ? "none" : "flex";


    dropdown_expand = dropdown_expand ? 0 : 1;

    dropdown_menu.innerHTML = ''

    if(dropdown_expand){

        for(var i=0;i<courseList.length;i++){
            if(!course_status[i]) dropdown_menu.innerHTML += '<a class="course-dropdown-item" onclick="select_course('+i+')"><div>' + courseList[i] + '</div></a>'
            else dropdown_menu.innerHTML += '<a class="course-dropdown-item" onclick="select_course('+i+')"><div>' + courseList[i] + '</div><div class=check_icon></div></a>'
        }

    }

}

function SendMessage(){

    //這邊之後應該要結合後端的訊息紀錄

    const message = document.getElementById("message").value
    document.getElementById("message").value = ""
    //console.log(message)


    if(!didSendMessage){
        document.querySelector("body > div > div > div.dialog > div.botton-tip").style.display = "none";
        document.querySelector("body > div > div > div.dialog > div.conversation").style.display = "flex";
    }
    didSendMessage = 1

    const conversation_box = document.querySelector("body > div > div > div.dialog > div.conversation");

    conversation_box.innerHTML = "<div class='sent_dialog'>" + 
    
    "<div class='sent_ID'>"+username+"</div>" 

    +"<div class='sent_content'>" + message + "</div>"
    
    +"</div>";


    conversation_box.innerHTML += "<div class='sent_dialog' style='margin-left: 0%;margin-right: 50%'>" +

    "<div class='sent_ID' style='text-align: left;'>"+"王中明"+"</div>" 

    +"<div class='sent_content' style='background: var(--status_y_50, #FFF6E8);'>" + "這是一個範例回覆訊息" + "</div>"
    
    +"</div>";


}