const selectClassList = document.querySelector('#select-class')
const selectCourseList = document.querySelector('#select-course')

document.querySelector("body > div > div > div.left-side-bar > div.teams-num > div.teams-num-selector > input[type=text]").value = 0

selectClassList.addEventListener('change', updateStudent);
selectClassList.addEventListener('change', updateInfo);


//  分組上下箭頭

const upArrow = document.querySelector('.adj-btn .plus');
const downArrow = document.querySelector('.adj-btn .minus');
const groupNum = document.querySelector('.teams-num-selector input');

upArrow.addEventListener('click', function(){
    groupNum.value = parseInt(groupNum.value) + 1;
    groupNum.dispatchEvent(new Event('input'));
});
downArrow.addEventListener('click', function(){
    if(groupNum.value > 0){
        groupNum.value = parseInt(groupNum.value) - 1;
        groupNum.dispatchEvent(new Event('input'));
    }
});


const temp_courseid = 2;
// test class 1
class1 = {
};
async function get_group_from_course(courseid){
    // change class information
    const wsfunction = 'core_group_get_course_groups'
    const wstoken = localStorage.getItem('token')
    const response = await fetch('http://localhost:8080/moodle/webservice/rest/server.php?moodlewsrestformat=json', {
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
    // console.log(data.length)
    return data;
}

async function get_group_member(groupids){
    // change class information
    const wsfunction = 'core_group_get_group_members'
    const wstoken = localStorage.getItem('token')
    const response = await fetch(`http://localhost:8080/moodle/webservice/rest/server.php?moodlewsrestformat=json&groupids[0]=${groupids}`, {
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
    // console.log(data)
    return data
}
async function get_user_fullname_by_id(userid){
    // change class information
    const wsfunction = 'core_user_get_users_by_field'
    const wstoken = localStorage.getItem('token')
    const response = await fetch(`http://localhost:8080/moodle/webservice/rest/server.php?moodlewsrestformat=json&field=id&values[0]=${userid}`, {
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
async function get_student_from_course(courseid){
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
async function show_group_info(){
    try {
        // Step 1: Get groups from the course
        const groups = await get_group_from_course(temp_courseid);
        console.log("Groups:", groups);
    
        // Step 2: Fetch members for each group
        const groupMembers = [];
        for (const group of groups) {
            console.log(group.id)
            console.log(group.name)
            const members = await get_group_member(group.id); // Pass group.id to the function
            console.log(members)

            groupMembers.push({ groupId: group.id, userids: members[0].userids });
            
        }
        
        console.log("Group Members:", groupMembers);
        return groupMembers; // Return the JSON structure
    } catch (error) {
        console.error("Error:", error);
    }
}
show_group_info()
async function updateInfo(){
    // change class information
    let classInfo = document.querySelector(".info-content > .class > .intro");
    classInfo.innerHTML = "班級：";
    classInfo.innerHTML += selectClassList.value;

    // change class count information
    let countInfo = document.querySelector(".info-content > .class-count > .intro");
    countInfo.innerHTML = "班級人數：";
    if(selectClassList.value == "class1"){
        countInfo.innerHTML += Object.keys(class1).length;
    }else{
        countInfo.innerHTML += "";
    }

    //clear background image
    let classList = document.querySelector(".group-info");
    classList.style.backgroundImage = "none";
}
const color_code = ["#F3F0F7", "#FFF6E8", "#F0FFF0", "#E8F6FF"];
const colors = ["purple", "yellow", "green", "blue"];

async function updateStudent(){
    try{
        const userid=await get_student_from_course(temp_courseid)
        console.log('hi')
        console.log(userid)
        for(const id of userid){
            const user_name = await get_user_fullname_by_id(id)
            // console.log(`id:${id}`)
            // console.log(`name:${user_name}`)
            class1[id] = user_name
        }
        console.log(class1)
    }
    catch (error) {
        console.error("Error:", error);
    }
    let studentList = document.querySelector(".group-content");
    studentList.innerHTML = "";
    if(selectClassList.value == "class1"){
        for (const [key, value] of Object.entries(class1)) {
            const studentDiv = document.createElement('div');
            studentDiv.className = 'student';

            const colorIndex = Math.floor((key-1) % 4);
            studentDiv.style.backgroundColor = color_code[colorIndex];

            //icon div
            const innerDiv = document.createElement('div');
            innerDiv.id = colors[colorIndex];
            innerDiv.className = 'student-icon';
            studentDiv.appendChild(innerDiv);

            //info div
            const infoDiv = document.createElement('div');
            infoDiv.className = 'info';
            infoDiv.textContent = `${key}號 ${value}`;
            studentDiv.appendChild(infoDiv);

            studentList.appendChild(studentDiv);
        }
    }else{
        studentList.innerHTML = "";
    }
}

selectCourseList.addEventListener('change', updateCourseInfo);

async function updateCourseInfo(){
    // change course information
    let courseInfo = document.querySelector(".info-content > .course > .intro");
    courseInfo.innerHTML = "課程名稱：";
    courseInfo.innerHTML += selectCourseList.value;
}

//change button color
const teamsNumInput = document.querySelector(".teams-num-selector > input");
teamsNumInput.addEventListener('input', function(){
    const teamsNumButton = document.querySelector(".teams-num > button");
    const teamsNumText = document.querySelector(".teams-num > button > .group");
    const teamsNumIcon = document.querySelector(".teams-num > button > .group-icon");
    if(teamsNumInput.value == 0){
        teamsNumButton.style.backgroundColor = "#D3D3D3";
    }else{
        teamsNumButton.style.backgroundColor = "#8665CD";
        teamsNumText.style.color = "white";
        teamsNumIcon.style.backgroundImage = "url(../assets/images/teacher_management/group_share_light_white.svg)";
    }
});

const timeInput = document.querySelector(".discuss-time > select");
timeInput.addEventListener('change', function(){
    const sendBtn = document.querySelector(".send-button");
    const sendBtnText = document.querySelector(".send-button > .send");
    const sendBtnIcon = document.querySelector(".send-button > .send-icon");
    const questionText = document.querySelector(".question-content > input");
    if(questionText.value == "" || timeInput.value == ""){
        sendBtn.style.backgroundColor = "#D3D3D3";
    }else if(timeInput.value != ""){
        sendBtn.style.backgroundColor = "#8665CD";
        sendBtnText.style.color = "white";
        sendBtnIcon.style.backgroundImage = "url(../assets/images/teacher_management/teacher_management_Paper_light_white.svg)";
    }
});

const questionInput = document.querySelector(".question-content > textarea");
questionInput.addEventListener('input', function(){
    const sendBtn = document.querySelector(".send-button");
    const sendBtnText = document.querySelector(".send-button > .send");
    const sendBtnIcon = document.querySelector(".send-button > .send-icon");
    const timeInput = document.querySelector(".discuss-time > select");
    if(questionInput.value == ""){
        sendBtn.style.backgroundColor = "#D3D3D3";
    }else if(timeInput.value != ""){
        sendBtn.style.backgroundColor = "#8665CD";
        sendBtnText.style.color = "white";
        sendBtnIcon.style.backgroundImage = "url(../assets/images/teacher_management/teacher_management_Paper_light_white.svg)";
    }
});

//random group
const groupBtn = document.querySelector(".group-button");
groupBtn.addEventListener('click', randomGroup);

const group_color_code = ["#F9F7FB", "#FFFAF3", "#F8FFF8", "#F3FBFF"];
const group_student_color_code = ["#E4D9F5", "#FFECD0", "#D9F8D9", "#C9E9FF"];
const group_student_icon_color = ["#8665CD", "#FFBC57", "#0DBD09", "#4BB7FF"];
const madarian = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
                "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十"];


function randomGroup() {
    console.log("randomGroup");
    const studentList = document.querySelector(".group-content");
    const studentDiv = studentList.querySelectorAll(".student");
    const studentArray = Array.from(studentDiv);
    const groupNum = document.querySelector(".teams-num-selector > input").value;
    console.log(groupNum);
    const groupArray = [];
    const groupList = document.querySelector(".group-content");
    groupList.innerHTML = "";
    for (let i = 0; i < groupNum; i++) {

        //group div
        const group = document.createElement('div');
        group.className = 'group';
        group.id = `group${i + 1}`;
        group.style.backgroundColor = group_color_code[i % 4];

        //group title
        const groupTitle = document.createElement('div');
        groupTitle.className = 'group-title';

        //group icon
        const groupIcon = document.createElement('div');
        groupIcon.className = 'group-icon';
        groupTitle.appendChild(groupIcon);

        //group text
        const groupText = document.createElement('div');
        groupText.className = 'group-text';
        groupText.textContent = `第${i + 1}組 共0人`;
        groupTitle.appendChild(groupText);

        group.appendChild(groupTitle);

        //group student div
        const groupStudent = document.createElement('div');
        groupStudent.className = 'group-student';
        group.appendChild(groupStudent);

        groupArray.push(group);
        groupList.appendChild(group);
    }

    let studentsPerGroup = Math.floor(studentArray.length / groupNum);
    let remainder = studentArray.length % groupNum;

    let index = 0;
    for (let i = 0; i < groupNum; i++) {
        for (let j = 0; j < studentsPerGroup; j++) {
            const student = studentArray[index];
            student.style.backgroundColor = group_student_color_code[i % 4];
            // student.querySelector('.student-icon').backgroundColor = group_student_icon_color[i % 4];
            student.querySelector('.student-icon').id = colors[i % 4];
            // student.querySelector('.info').style.color = group_student_icon_color[i % 4];
            // student.querySelector('student-icon').style.backgroundColor = group_student_icon_color[i % 4];
            groupArray[i].querySelector('.group-student').appendChild(student);
            index++;
        }
    }

    while (remainder > 0) {
        const randomIndex = Math.floor(Math.random() * groupNum);
        if (groupArray[randomIndex].querySelector('.group-student').childElementCount < studentsPerGroup + 1) {
            const student = studentArray[index];
            student.style.backgroundColor = group_student_color_code[randomIndex % 4];
            student.querySelector('.student-icon').id = colors[randomIndex % 4];
            // student.querySelector('.info').style.color = group_student_icon_color[randomIndex % 4];
            groupArray[randomIndex].querySelector('.group-student').appendChild(student);
            index++;
            remainder--;
        }
    }

    // Update group titles with the correct number of students
    groupArray.forEach(group => {
        const groupTitle = group.querySelector('.group-title');
        const studentCount = group.querySelector('.group-student').childElementCount;

        // Clear previous group title content
        groupTitle.innerHTML = '';

        // Add group icon to group title
        const groupIcon = document.createElement('div');
        groupIcon.className = 'group-icon';
        switch (group.id.replace('group', '') % 4) {
            case 0:
                groupIcon.style.backgroundImage = "url(../assets/images/teacher_management/light_blue.svg)";
                groupIcon.style.backgroundColor = "rgb(201, 233, 255)";
                break;
            case 1:
                groupIcon.style.backgroundImage = "url(../assets/images/teacher_management/light_purple.svg)";
                groupIcon.style.backgroundColor = "rgb(228, 217, 245)";
                break;
            case 2:
                groupIcon.style.backgroundImage = "url(../assets/images/teacher_management/light_yellow.svg)";
                groupIcon.style.backgroundColor = "rgb(255, 236, 208)";
                break;
            case 3:
                groupIcon.style.backgroundImage = "url(../assets/images/teacher_management/light_green.svg)";
                groupIcon.style.backgroundColor = "rgb(217, 248, 217)";
                break;
        }
        groupTitle.appendChild(groupIcon);

        //group text
        const groupText = document.createElement('div');
        groupText.className = 'group-text';
        groupText.textContent = `第${madarian[parseInt(group.id.replace('group', '')) - 1]}組 共${studentCount}人`;
        groupTitle.appendChild(groupText);
    });
}