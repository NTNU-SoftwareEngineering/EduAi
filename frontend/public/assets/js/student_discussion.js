let dropdown_expand = 0
let didSendMessage = 0
let username = "王小明" //backend should modify and offer the username of the account
/*let courseList = [
  "09/14 輔導課",
  "09/17 資訊課",
  "10/12 國文課",
  "10/14 輔導課",
  "10/17 資訊課",
  "10/19 英文課",
]; // backend should transfer the data to the frontend
*/
let courseList = []; // course name only
let courseObjList = [];
let course_status = [];
async function loadCourse() { // fetch course data from backend
    courseObjList = await fetchCourses();
    courseList = courseObjList.map(c => c.fullname);
    console.log("courseList: ", courseList);
    course_status = new Array(courseList.length);
    for (var i = 0; i < courseList.length; i++) course_status[i] = 0;
}
document.addEventListener("DOMContentLoaded", loadCourse);

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

