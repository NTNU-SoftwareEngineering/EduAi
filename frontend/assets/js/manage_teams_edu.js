const selectClassList = document.querySelector('#select-class')
const selectCourseList = document.querySelector('#select-course')

document.querySelector("body > div > div > div.left-side-bar > div.teams-num > div.teams-num-selector > input[type=number]").value = 0

selectClassList.addEventListener('change', updateStudent);
selectClassList.addEventListener('change', updateInfo);

// test class 1
class1 = {
    "1": "Andy",
    "2": "Brian",
    "3": "Cindy",
    "4": "David",
    "5": "Emily",
    "6": "Fiona",
    "7": "George",
    "8": "Helen",
    "9": "Ivy",
    "10": "Jack",
};

function updateInfo(){
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

function updateStudent(){
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
            innerDiv.className = colors[colorIndex];
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

//update course information

selectCourseList.addEventListener('change', updateCourseInfo);

function updateCourseInfo(){
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

const questionInput = document.querySelector(".question-content > input");
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

function randomGroup(){
    const studentList = document.querySelector(".group-content");
    const studentDiv = studentList.querySelectorAll(".student");
    const studentArray = Array.from(studentDiv);
    const groupNum = document.querySelector(".teams-num-selector > input").value;
    const groupArray = [];
    const groupList = document.querySelector(".group-content");
    groupList.innerHTML = "";
    for(let i = 0; i < groupNum; i++){
        const group = document.createElement('div');
        group.className = 'group';
        group.id = `group${i+1}`;
        group.style.backgroundColor = group_color_code[i % 4];

        groupArray.push(group);
        groupList.appendChild(group);
    }
    let studentsPerGroup = Math.floor(studentArray.length / groupNum);
    let remainder = studentArray.length % groupNum;

    let index = 0;
    for (let i = 0; i < groupNum; i++) {
        for (let j = 0; j < studentsPerGroup; j++) {
            groupArray[i].appendChild(studentArray[index]);
            index++;
        }
    }

    while (remainder > 0) {
        const randomIndex = Math.floor(Math.random() * groupNum);
        if (groupArray[randomIndex].childElementCount === studentsPerGroup) {
            groupArray[randomIndex].appendChild(studentArray[index]);
            index++;
            remainder--;
        }
    }

}