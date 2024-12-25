let dropdown_expand = 0;
let didSendMessage = 0;
let username = "";

let courseList = []; // course name only
let courseId = -1;
let courseObjList = [];
let course_status = [];
async function loadCourse() { // fetch course data from backend
    courseObjList = await fetchCourses();
    courseList = courseObjList.map(c => c.fullname);
    console.log("Courses: ", courseList);
    course_status = new Array(courseList.length);
    for (var i = 0; i < courseList.length; i++) course_status[i] = 0;
}

async function updateTopicText () {
    const token = localStorage.getItem('token');
    if ( !token ) window.location.href = 'login_edu.html';
    
    const topic_ele = document.querySelector('.question');
    const check = await checkCourseActivity(token, courseId);
    if ( check ) { // 沒有正在進行的討論
        topic_ele.innerHTML = "目前沒有進行中的討論活動";
    } else {
        try {
            topic_ele.innerHTML = await getActivityName(token, courseId);
        } catch ( err ) {
            console.error(err);
        }
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await loadCourse();

    await fetch(`${HOSTNAME}/moodle/webservice/rest/server.php?moodlewsrestformat=json`, {
		method: 'POST',
		headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			wstoken: localStorage.getItem('token'),
			wsfunction: 'core_webservice_get_site_info'
		}),
    })
    .then(response => response.json())
    .then(data => {
        username = data.fullname;
    });
});

async function select_course(index){
    for(var i=0;i<courseList.length;i++) course_status[i] = 0
    course_status[index] = 1

	courseId = courseObjList[index].id; // 同步更新 courseId
    updateTopicText();

    document.querySelector("#message").removeAttribute("disabled")
    document.querySelector("#message").placeholder = "請輸入訊息"

    document.querySelector("body > div > div > div > div.top-label > div.flex.course-container").style.display = "flex"
    document.querySelector("body > div > div > div > div.botton-tip").style.display = 'none'
    document.querySelector("body > div > div > div > div.send-message > button").style.display = 'flex'

    const dropdown_menu = document.querySelector("#course-select");

    dropdown_menu.innerHTML = ''

    document.querySelector("body > div > div > div > div.top-label > div.flex > button").innerHTML = courseList[index] + 
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">\
    <path d="M6 9L12 15L18 9" stroke="#1F1F1F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\
    </svg>'

    // Clear conversation box
    const conversation_box = document.querySelector("body > div > div > div.dialog > div.conversation");
    conversation_box.innerHTML = "";

    dropdownMenuCSSModify();

    // Get conversation data
    await fetch("/student_conversation/init", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token: localStorage.getItem("token"),
            course_id: courseObjList[index].id,
            course_name: courseObjList[index].fullname,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        const messages = data.messages;

        // Append history messages
        for (let i = 0; i < messages.length; i++) {
            appendMessage(messages[i].role, messages[i].content);
        }
    })
    .catch((error) => {
        console.error(error);
    });
}

function dropdownMenuCSSModify(){

    const dropdown_menu = document.querySelectorAll("#course-select");

    


    dropdown_expand = dropdown_expand ? 0 : 1;
    

    if(dropdown_expand){

        for(var j = 0; j < dropdown_menu.length; j++){
          
          dropdown_menu[j].style.display = dropdown_expand ? "flex" : "none";
          dropdown_menu[j].innerHTML = ''
          for(var i=0;i<courseList.length;i++){
            if(!course_status[i]) dropdown_menu[j].innerHTML += '<a class="course-dropdown-item' +(j?"-large" : "") + '" onclick="select_course('+i+')"><div>' + courseList[i] + '</div></a>'
            else dropdown_menu[j].innerHTML += '<a class="course-dropdown-item' +(j?"-large" : "") + '" onclick="select_course('+i+')"><div>' + courseList[i] + '</div><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 25" fill="none"> \
            <path d="M8 13.3333L11.6667 18L19 8" stroke="#1F1F1F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> \
          </svg></a>'
        }

    }
  }
  else{
    for(var j = 0; j < dropdown_menu.length; j++){
          
      dropdown_menu[j].style.display = dropdown_expand ? "flex" : "none";
      dropdown_menu[j].innerHTML = ''
      
  }
}

}
//document.querySelector('.course-list').addEventListener('click', dropdownMenuCSSModify);

document.querySelector("body > div > div > div > div.top-label > div.flex.course-container").style.display = "none"

function detectEnter(ele) {
    if (event.key == "Enter") {
        SendMessage();
    }
}

function appendMessage(role, message) {
    if (!didSendMessage) {
        document.querySelector(
            "body > div > div > div.dialog > div.botton-tip"
        ).style.display = "none";
        document.querySelector(
            "body > div > div > div.dialog > div.conversation"
        ).style.display = "flex";
    }
    didSendMessage = 1;

    const conversation_box = document.querySelector(
        "body > div > div > div.dialog > div.conversation"
    );

    if (role == "user") {
        conversation_box.innerHTML +=
        "<div class='sent_dialog'>" +
        "<div class='sent_ID'>" +
        username +
        "</div>" +
        "<textarea class='sent_content' disabled>" +
        message +
        "</textarea >" +
        "</div>";
    }
    else if (role == "ai") {
        conversation_box.innerHTML +=
        "<div class='sent_dialog' style='margin-left: 0%;margin-right: 50%'>" +
        "<div class='sent_ID' style='text-align: left;'>" +
        "小助手" +
        "</div>" +
        "<textarea class='sent_content' style='background: var(--status_y_50, #FFF6E8);' disabled>" +
        message +
        "</textarea>" +
        "</div>";
    }

    conversation_box.scrollTop = conversation_box.scrollHeight;
}

async function SendMessage() {
    const user_message = document.getElementById("message").value;

    if(user_message.length == 0) return;

    document.getElementById("message").value = "";

    appendMessage("user", user_message);

    // Get the selected course id
    let course_id = courseObjList[course_status.indexOf(1)].id;

    await fetch("/student_conversation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            token: localStorage.getItem("token"),
            course_id: course_id,
            user_message: user_message,
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        appendMessage("ai", data.message);
    })
    .catch((error) => {
        console.error(error);
    });
}

document.querySelector("body > div > div > div > div.top-label > div.flex.course-container").style.display = "none"
document.querySelector("#message").setAttribute("disabled" , "disabled")
document.querySelector("body > div > div > div > div.send-message > button").style.display = "none"