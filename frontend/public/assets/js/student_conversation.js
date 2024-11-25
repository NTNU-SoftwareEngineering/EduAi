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

function select_course(index) {
    for (var i = 0; i < courseList.length; i++) course_status[i] = 0;
    course_status[index] = 1;

    const dropdown_menu = document.querySelector(
        "body > div > div > div.left-side-bar > div.select-course.mt-4 > div.flex > div"
    );

    dropdown_menu.innerHTML = "";
    for (var i = 0; i < courseList.length; i++) {
        if (!course_status[i])
            dropdown_menu.innerHTML +=
                '<a class="course-dropdown-item" onclick="select_course(' +
                i +
                ')"><div>' +
                courseList[i] +
                "</div></a>";
        else
            dropdown_menu.innerHTML +=
                '<a class="course-dropdown-item" onclick="select_course(' +
                i +
                ')"><div>' +
                courseList[i] +
                "</div><div class=check_icon></div></a>";
    }

    const record_btn = document.querySelector(
        "body > div > div > div.left-side-bar > div.speech-upload > button"
    );
    record_btn.style.backgroundColor = "#502F96";
    document.getElementsByClassName("upload-icon")[0].style.backgroundImage =
        "url(./assets/images/student_discussion/upload-light.svg)";
    document.getElementsByClassName("upload-icon")[1].style.backgroundImage =
        "url(./assets/images/student_discussion/upload-light.svg)";
    document.getElementsByClassName("file-name")[0].innerHTML = "";
    document.getElementsByClassName("file")[0].style.display = "none";
    document.getElementById("audio").style.display = "block";
    document.querySelector(
        "body > div > div > div.left-side-bar > div.speech-upload > button > span"
    ).style.color = "#FFF";
    document.querySelector("#record-stop > span").style.color = "#FFF";
}

function dropdownMenuCSSModify() {
    const dropdown_menu = document.querySelector(
        "body > div > div > div.left-side-bar > div.select-course.mt-4 > div.flex > div"
    );

    dropdown_menu.style.display = dropdown_expand ? "none" : "flex";

    dropdown_expand = dropdown_expand ? 0 : 1;

    dropdown_menu.innerHTML = "";

    if (dropdown_expand) {
        for (var i = 0; i < courseList.length; i++) {
            if (!course_status[i])
                dropdown_menu.innerHTML +=
                    '<a class="course-dropdown-item" onclick="select_course(' +
                    i +
                    ')"><div>' +
                    courseList[i] +
                    "</div></a>";
            else
                dropdown_menu.innerHTML +=
                    '<a class="course-dropdown-item" onclick="select_course(' +
                    i +
                    ')"><div>' +
                    courseList[i] +
                    "</div><div class=check_icon></div></a>";
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
        "<div class='sent_content'>" +
        message +
        "</div>" +
        "</div>";

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
            "<div class='sent_content' style='background: var(--status_y_50, #FFF6E8);'>" +
            response_message +
            "</div>" +
            "</div>";
    }
    conversation_box.scrollTop = conversation_box.scrollHeight;
}
