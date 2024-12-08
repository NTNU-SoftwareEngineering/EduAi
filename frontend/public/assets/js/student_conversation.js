let dropdown_expand = 0;
let didSendMessage = 0;
let username = "王小明";
let courseList = [];

let course_status = new Array(courseList.length);

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

function detectEnter(ele) {
    if (event.key == "Enter") {
        SendMessage();
    }
}

async function SendMessage() {
    //這邊之後應該要結合後端的訊息紀錄

    const message = document.getElementById("message").value;
    const thread_id = localStorage.getItem("thread_id");

    if(message.length == 0) return;

    document.getElementById("message").value = "";
    // console.log(message);

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

    conversation_box.innerHTML +=
        "<div class='sent_dialog'>" +
        "<div class='sent_ID'>" +
        username +
        "</div>" +
        "<textarea class='sent_content' disabled>" +
        message +
        "</textarea >" +
        "</div>";

    conversation_box.scrollTop = conversation_box.scrollHeight;

    const response = await fetch("/student_conversation", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: message,
            thread_id: thread_id,
        }),
    });

    const data = await response.json();
    const response_message = data.message || "No response";

    if (response.ok) {
        conversation_box.innerHTML +=
            "<div class='sent_dialog' style='margin-left: 0%;margin-right: 50%'>" +
            "<div class='sent_ID' style='text-align: left;'>" +
            "小助手" +
            "</div>" +
            "<textarea class='sent_content' style='background: var(--status_y_50, #FFF6E8);'>" +
            response_message +
            "</textarea>" +
            "</div>";
    }
    conversation_box.scrollTop = conversation_box.scrollHeight;
}

document.addEventListener("DOMContentLoaded", function () {
    // Initialize conversation thread
    fetch("/student_conversation/init", {
        method: "POST",
    })
    .then((response) => response.json())
    .then((data) => {
        // save thread id to local storage
        localStorage.setItem("thread_id", data.thread_id);
    });
});
