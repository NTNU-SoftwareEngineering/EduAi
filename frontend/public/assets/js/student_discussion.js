let dropdown_expand = 0
let didSendMessage = 0
// let username = "王小明" //backend should modify and offer the username of the account
let courseList = []; // course name only
let courseObjList = [];
let course_status = [];
let courseId = -1; // 還未選擇課程
let assignmentId = -1; // 還未選擇作業(這個變數是要給record.js用的)

async function loadCourse() { // fetch course data from backend
    courseObjList = await fetchCourses();
    courseList = courseObjList.map(c => c.fullname);
    console.log("courseList: ", courseList);
    course_status = new Array(courseList.length);
    for (var i = 0; i < courseList.length; i++) course_status[i] = 0;
}
document.addEventListener("DOMContentLoaded", loadCourse);

async function updateTopicText () {
    const token = localStorage.getItem('token');
    if ( !token ) window.location.href = 'login_edu.html';
    
    const topic_ele = document.getElementById('question');
    const check = await checkCourseActivity(token, courseId);
    if ( check ) { // 沒有正在進行的討論
        topic_ele.innerHTML = "目前沒有進行中的討論活動";
    } else {
        try {
            topic_ele.innerHTML = await getActivityName(token, courseId);
        } catch ( err ) {
            console.err(err);
        }
    }
}

function select_course(index){
    for(var i=0;i<courseList.length;i++) course_status[i] = 0
    course_status[index] = 1
    dropdown_expand = 1

	courseId = courseObjList[index].id; // 同步更新 courseId
	updateAssignmentId(); // 同步更新 assignmentId
    updateTopicText();

    document.querySelector("body > div > div > div > div.top-label > div.flex.course-container").style.display = "flex"
    document.querySelector("body > div > div > div > div.botton-tip").style.display = 'none'

    const dropdown_menu = document.querySelector("#course-select");

    dropdown_menu.innerHTML = ''
    for(var i=0;i<courseList.length;i++) {
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
document.querySelector("#message").setAttribute("disabled" , "disabled")

// 更新 assignmentId
async function updateAssignmentId() {
	const assignmentUrl = `http://localhost:8080/moodle/webservice/rest/server.php?wstoken=${wstoken_webservice}&wsfunction=mod_assign_get_assignments&moodlewsrestformat=json&courseids[0]=${courseId}`;
	try {
		const assignmentResponse = await fetch(assignmentUrl);
		const data = await assignmentResponse.json();
		// 分析回傳的數據，找出最新開放的作業
        if (data.courses && data.courses.length > 0) {
            const assignments = data.courses[0].assignments;

            // 排序作業，根據 allowsubmissionsfromdate 找出最新開放的作業
            const sortedAssignments = assignments
                .sort((a, b) => b.id - a.id);

            if (sortedAssignments.length > 0) {
                const latestAssignment = sortedAssignments[0];
				assignmentId = latestAssignment.id; // 同步更新 assignmentId
                // console.log('最新開放的作業 ID:', latestAssignment.id);
                // console.log('作業名稱:', latestAssignment.name);
                // console.log('開放時間:', new Date(latestAssignment.allowsubmissionsfromdate * 1000));
            } else {
                // console.log('找不到任何作業。');
            }
        } else {
            // console.log('找不到課程或作業。');
        }
	}
	catch (error) {
		console.error('無法取得作業 ID:', error);
	}
}
