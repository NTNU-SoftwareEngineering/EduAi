let dropdown_expand = 0;
let didSendMessage = 0;
let username = "王小明"; //backend should modify and offer the username of the account

let courseList = [
    "09/14 輔導課",
    "09/17 資訊課",
    "10/12 國文課",
    "10/14 輔導課",
    "10/17 資訊課",
    "10/19 英文課",
]; // backend should transfer the data to the frontend


let course_status = new Array(courseList.length);
for (var i = 0; i < courseList.length; i++) course_status[i] = 0;

function select_course(index){
    for(var i=0;i<courseList.length;i++) course_status[i] = 0
    course_status[index] = 1

    document.querySelector("#message").removeAttribute("disabled")
    document.querySelector("#message").placeholder = "請輸入訊息"

    document.querySelector("body > div > div > div > div.top-label > div.flex.course-container").style.display = "flex"
    document.querySelector("body > div > div > div > div.botton-tip").style.display = 'none'
    document.querySelector("body > div > div > div > div.send-message > button").style.display = 'flex'

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

document.querySelector("body > div > div > div > div.top-label > div.flex.course-container").style.display = "none"

function detectEnter(ele) {
    if (event.key == "Enter") {
        SendMessage();
    }
}

async function SendMessage() {
    //這邊之後應該要結合後端的訊息紀錄

    const message = document.getElementById("message").value;

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
        }),
    });

    const data = await response.json();
    const response_message = data.choices[0]?.message?.content || "No response";

    if (response.ok) {
        conversation_box.innerHTML +=
            "<div class='sent_dialog' style='margin-left: 0%;margin-right: 50%'>" +
            "<div class='sent_ID' style='text-align: left;'>" +
            "小助手" +
            "</div>" +
            "<textarea class='sent_content' style='background: var(--status_y_50, #FFF6E8);' disabled>" +
            response_message +
            "</textarea>" +
            "</div>";
    }
    conversation_box.scrollTop = conversation_box.scrollHeight;
}

document.querySelector("body > div > div > div > div.top-label > div.flex.course-container").style.display = "none"
document.querySelector("#message").setAttribute("disabled" , "disabled")
document.querySelector("body > div > div > div > div.send-message > button").style.display = "none"