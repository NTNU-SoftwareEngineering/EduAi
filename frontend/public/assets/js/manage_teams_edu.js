let courseList = []; // course name only
let courseObjList = [];
let courseId = -1; // 還未選擇課程: -1
const selectCourseList = document.querySelector('#class');
const selectActivityList = document.querySelector('#activity-selector');

async function loadCourse() { // fetch course data from backend
    courseObjList = await fetchCourses();
    courseList = courseObjList.map(c => c.fullname);
    console.log("courseList: ", courseList);
    
    courseList.forEach ( course => {
        const option = document.createElement('option');
        option.value = course;
        option.textContent = course;
        selectCourseList.appendChild(option);
    });
}
document.addEventListener("DOMContentLoaded", loadCourse);

async function onCourseChange() {
    const token = localStorage.getItem('token');
    if ( !token ) window.location.href = 'login_edu.html';

    document.querySelector('#question-content-text').innerHTML = "";

    console.log( "select course: " + selectCourseList.value );
    selectedCourseObj = courseObjList.find( course => course.fullname === selectCourseList.value);
    if ( !selectedCourseObj ) {
        // 還未選擇課程，或後端無此課程
        courseId = -1;
        console.error(`Cannot find course: ${selectCourseList.value}`);
        return;
    };

    courseId = selectedCourseObj.id;
    if ( !courseId ) {
        console.error(`Cannot find course id for: ${selectCourseList.value}`);
        return;
    }
    console.log( "update courseid: " + courseId ); 
    
    let response = await fetch(`${HOSTNAME}/moodle/webservice/rest/server.php`, { //取得課程活動內容
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            wstoken: token,
            wsfunction: 'core_course_get_courses',
            moodlewsrestformat: 'json',
            'options[ids][0]': courseId
        })
    })
    .then ( ret => ret.json() )

    if ( !response[0].summary ) {
        alert('此課程尚未上傳教案');
        // console.log(selectCourseList.selectedIndex);
        selectCourseList.selectedIndex = 0;
        return;
    }

    try {
         // 更改'選擇活動'欄位
        selectActivityList.innerHTML = '<option value="">請選擇活動名稱</option>';
        const lesson_plan = JSON.parse(response[0].summary);
        const activities = lesson_plan.activities;

        for (const [idx, act] of Object.entries(activities)) {
            const option = document.createElement('option');
            option.setAttribute('time', act.time);
            option.setAttribute('desc', act.description);
            option.textContent = act.name;
            option.value = idx;
            selectActivityList.appendChild(option);
        }

        updateStudent();
        updateInfo();
    } catch (error) {
        if ( error instanceof SyntaxError || error instanceof TypeError ) {
            alert('請先上傳教案，或重新上傳教案。');
            selectCourseList.selectedIndex = 0;
            return;
        }
        console.error(`解析教案發生錯誤: ${error.message}`);
    }
}
selectCourseList.addEventListener("change", onCourseChange);

selectActivityList.addEventListener('change', function () {
    const selectedObj = selectActivityList.options[selectActivityList.selectedIndex];
    let desc = selectedObj.getAttribute('desc');
    if ( !desc ) desc = "";
    // console.log(desc);
    document.querySelector('#question-content-text').innerHTML = desc;

    // Change button color
    const sendBtn = document.querySelector(".send-button");
    const sendBtnText = document.querySelector(".send-button > .send");
    const sendBtnIcon = document.querySelector(".send-button > .send-icon");
    const questionText = document.querySelector(".question-content > input");

    sendBtn.style.backgroundColor = "#8665CD";
    sendBtnText.style.color = "white";
    sendBtnIcon.style.backgroundImage = "url(../assets/images/teacher_management/teacher_management_Paper_light_white.svg)";
})

const submitBtn = document.querySelector('#send-button');
async function onTopicSubmit () {
    const token = localStorage.getItem('token');
    if ( !token ) window.location.href = 'login_edu.html';

    if ( courseId==-1 || !selectActivityList.selectedIndex || !selectActivityList.value ) {
        alert('請先選擇課程及活動');
        return;
    }
    
    getActivityName(token, courseId);
    console.log('檢查該課程是否有正在進行的活動(fetch upcoming event)');
    const valid = await checkCourseActivity(token, courseId);
    if ( !valid ) {
        alert('該課程已有進行中的討論，請等待討論結束再送出新的題目');
        return;
    }
    console.log('沒有進行中的活動');

    const selectedObj = selectActivityList.options[selectActivityList.selectedIndex];
    console.log(selectedObj);

    console.log('updating course...（儲存討論題目中）');
    if ( ! await updateActivityName(token, courseId, selectedObj.textContent) ) {
        console.error('error when updateCourseActivity');
        return;
    }

    console.log( 'creating calendar event...' );
    createCourseActivity(token, courseId, selectedObj.getAttribute('time'));

    console.log( 'creating new assignment...' );
    const mod_id = await createAssignment(token, courseId);
    if ( mod_id == -1 ) {
        console.error('error when createAssignment');
        return;
    }
    console.log( `new assignment created: module_id=${mod_id}` );
    alert(`討論開始：${selectedObj.getAttribute('time')}分鐘`);
}
submitBtn.addEventListener('click', onTopicSubmit);


document.querySelector("body > div > div > div.left-side-bar > div.teams-num > div.teams-num-selector > input[type=text]").value = 0

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

async function get_group_from_course(courseid){
    // change class information
    const wsfunction = 'core_group_get_course_groups'
    const wstoken = localStorage.getItem('token')
    const response = await fetch(`${HOSTNAME}/moodle/webservice/rest/server.php?moodlewsrestformat=json`, {
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
    const response = await fetch(`${HOSTNAME}/moodle/webservice/rest/server.php?moodlewsrestformat=json&groupids[0]=${groupids}`, {
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

async function delete_group(groupid){
    // change class information
    const wsfunction = 'core_group_delete_groups'
    const wstoken = localStorage.getItem('token')
    const response = await fetch(`${HOSTNAME}/moodle/webservice/rest/server.php?moodlewsrestformat=json&groupids[0]=${groupid}`, {
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
    return 1;
}

async function create_group(courseid, name) {
    const wsfunction = 'core_group_create_groups';
    const wstoken = localStorage.getItem('token'); // Moodle API token
    const response = await fetch(`${HOSTNAME}/moodle/webservice/rest/server.php?moodlewsrestformat=json&groups[0][courseid]=${courseid}&groups[0][name]=${name}&groups[0][description]=aaa`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            wstoken,
            wsfunction,
        }),
    });

    const data = await response.json();

    // if (data.exception) {
    //     throw new Error(`Error creating groups: ${data.message}`);
    // }

    // console.log("Created Groups:", data);
    return 1
}
async function add_group_member(groupid, userid) {
    const wsfunction = 'core_group_add_group_members';
    const wstoken = localStorage.getItem('token'); // Moodle API token
    const response = await fetch(`${HOSTNAME}/moodle/webservice/rest/server.php?moodlewsrestformat=json&members[0][groupid]=${groupid}&members[0][userid]=${userid}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            wstoken,
            wsfunction,
        }),
    });

    const data = await response.json();

    // if (data.exception) {
    //     throw new Error(`Error adding group member: ${data.message}`);
    // }

    // console.log("add group member:", data);
    return 1; // Returns the created group IDs
}
async function show_group_info(){
    try {
        // Step 1: Get groups from the course
        const groups = await get_group_from_course(courseId);
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
// show_group_info()
async function updateInfo(){

    // change class count information
    let countInfo = document.querySelector(".info-content > .class-count > .intro");
    let classList = document.querySelector(".group-info");

    await get_student_from_course(courseId)
    .then(async (userids) => {
        // userids.forEach(async (userid) => {
        //     const name = await get_user_fullname_by_id(userid);
        //     studentNames.push(name);
        // });
        countInfo.innerHTML = "班級人數：" + userids.length;
    });

    classList.style.backgroundImage = "none";

    // change class count information
    // let countInfo = document.querySelector(".info-content > .class-count > .intro");
    // countInfo.innerHTML = "班級人數：";
    // countInfo.innerHTML += Object.keys(class1).length;

    // //clear background image
    // let classList = document.querySelector(".group-info");
    // classList.style.backgroundImage = "none";
}
const color_code = ["#F3F0F7", "#FFF6E8", "#F0FFF0", "#E8F6FF"];
const colors = ["purple", "yellow", "green", "blue"];

async function updateStudent(){
    try {
        let studentsIdList = await get_student_from_course(courseId);
        let studentsNameList = await Promise.all(studentsIdList.map(id => get_user_fullname_by_id(id)));

        let studentList = document.querySelector(".group-content");
        studentList.innerHTML = "";

        studentsNameList.forEach((student_name) => {
            const studentDiv = document.createElement('div');
            studentDiv.className = 'student';

            const colorIndex = Math.floor((studentsNameList.indexOf(student_name)) % 4);
            studentDiv.style.backgroundColor = color_code[colorIndex];

            //icon div
            const innerDiv = document.createElement('div');
            innerDiv.id = colors[colorIndex];
            innerDiv.className = 'student-icon';
            studentDiv.appendChild(innerDiv);

            //info div
            const infoDiv = document.createElement('div');
            infoDiv.className = 'info';
            infoDiv.textContent = student_name;
            studentDiv.appendChild(infoDiv);

            studentList.appendChild(studentDiv);
        });
    }
    catch (error) {
        console.error("Error:", error);
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

//random group
const groupBtn = document.querySelector(".group-button");
groupBtn.addEventListener('click', random_group);

const group_color_code = ["#F9F7FB", "#FFFAF3", "#F8FFF8", "#F3FBFF"];
const group_student_color_code = ["#E4D9F5", "#FFECD0", "#D9F8D9", "#C9E9FF"];
const group_student_icon_color = ["#8665CD", "#FFBC57", "#0DBD09", "#4BB7FF"];
const madarian = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
                "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十"];

async function random_group() {
    const groups_old = await get_group_from_course(courseId)
    for(let i=0;i<groups_old.length;i++){
        delete_group(groups_old[i].id)
    }
    const participant = await get_student_from_course(courseId)
    console.log(`parti:${participant}`)
    const participant_length = participant.length
    console.log(`parti_l:${participant_length}`)
    const participant_suffle = participant
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
        console.log(`parti_s:${participant_suffle}`)
    // const groupNum = document.querySelector(".teams-num-selector > input").value;
    const groupNum = document.querySelector(".teams-num-selector > input").value;
    console.log(groupNum);
    for(let i = 0; i<groupNum;i++)
        await create_group(courseId, `group ${i + 1}`)
    const groups = await get_group_from_course(courseId)
    console.log(groups)
    let groupids = []
    for(let i = 0;i<groups.length;i++){
        groupids.push(groups[i].id);
    }
    console.log(`group:${groupids}`)
    const group_member_num = Math.floor(participant_length/groupNum)
    for(let i = 0;i<participant_length;i++){
        // console.log(`${i} ${participant[i]}`)
        if(i >= group_member_num * groupNum){
            add_group_member(groupids[i%groupNum],participant_suffle[i])
        }
        else add_group_member(groupids[Math.floor(i/group_member_num)],participant_suffle[i])
    }
    let groups_new = []
    for(let i = 0;i<groupids.length;i++){
        const gr_me = await get_group_member(groupids[i]);
        console.log(gr_me[0].userids)//array
        let team = [];
        for(let j = 0;j<gr_me[0].userids.length;j++){
            const name = await get_user_fullname_by_id(gr_me[0].userids[j])
            console.log(gr_me[0].userids[j])
            team.push({id:gr_me[0].userids[j],name:name});
        }
        groups_new.push(team);
    }
    
    console.log('new',groups_new)
    let groupArray = [];
    for(let i = 0;i<groups_new.length;i++){
        groupArray.push([]);
        for(let j =0;j < groups_new[i].length;j++){
            const studentDiv = document.createElement('div');
            studentDiv.className = 'student';

            const colorIndex = Math.floor((i) % 4);
            studentDiv.style.backgroundColor = color_code[colorIndex];

            //icon div
            const innerDiv = document.createElement('div');
            innerDiv.id = colors[colorIndex];
            innerDiv.className = 'student-icon';
            studentDiv.appendChild(innerDiv);

            //info div
            const infoDiv = document.createElement('div');
            infoDiv.className = 'info';
            console.log(`${groups_new[i][j].id}號 ${groups_new[i][j].name}`);
            infoDiv.textContent = `${groups_new[i][j].name}`;
            studentDiv.appendChild(infoDiv);
            groupArray[i].push(studentDiv);
        }
    }
    console.log(groupArray)
    displayGroups(groupArray)
}

function randomGroup() {
    console.log("randomGroup");
    const studentList = document.querySelector(".group-content");
    const studentDiv = studentList.querySelectorAll(".student");
    const studentArray = Array.from(studentDiv);
    const groupNum = document.querySelector(".teams-num-selector > input").value;
    console.log(groupNum);
    const groupArray = [];
    


    // let studentsPerGroup = Math.floor(studentArray.length / groupNum);
    // let remainder = studentArray.length % groupNum;


    // let index = 0;
    // for (let i = 0; i < groupNum; i++) {

    //     groupArray.push([]);
    //     for (let j = 0; j < studentsPerGroup; j++) {
    //         groupArray[i].push(studentArray[index]);
    //         index++;
    //     }
    // }

    // while (remainder > 0) {
    //     const randomIndex = Math.floor(Math.random() * groupNum);
    //     if (groupArray[randomIndex].length < studentsPerGroup + 1) {
    //         groupArray[randomIndex].push(studentArray[index]);
    //         index++;
    //         remainder--;
    //     }
    // }

    displayGroups(groupArray);
    console.log(groupArray);
}

function displayGroups(groupArray) {
    const groupList = document.querySelector(".group-content");
    groupList.innerHTML = "";
    for (let i = 0; i < groupArray.length; i++) {
        const group = document.createElement('div');
        group.className = 'group';
        group.id = `group${i + 1}`;
        group.style.backgroundColor = group_color_code[(i+3) % 4];
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
        groupText.textContent = `第${i + 1}組 共${groupArray[i].length}人`;
        groupTitle.appendChild(groupText);
        group.appendChild(groupTitle);
        //group student div
        const groupStudent = document.createElement('div');
        groupStudent.className = 'group-student';
        group.appendChild(groupStudent);
        groupArray[i].forEach(student => {
            student.style.backgroundColor = group_student_color_code[(i+3) % 4];
            student.querySelector('.student-icon').id = colors[(i+3) % 4];
            groupStudent.appendChild(student);
        });

        groupList.appendChild(group);
    }
    // Update group titles with the correct number of students
    groupArray.forEach((group, index) => {
        const groupTitle = document.querySelector(`#group${index + 1} .group-title`);
        const studentCount = group.length;

        // Clear previous group title content
        groupTitle.innerHTML = '';
        // Add group icon to group title
        const groupIcon = document.createElement('div');
        groupIcon.className = 'group-icon';
        switch (index % 4) {
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
        groupText.textContent = `第${madarian[index]}組 共${studentCount}人`;
        groupTitle.appendChild(groupText);
    });
}  