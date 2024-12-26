let courseList = []; // course name only
let courseObjList = [];
let courseId = -1; // 還未選擇課程: -1
const selectCourseList = document.querySelector('#class');

async function loadCourse() { // fetch course data from backend
    courseObjList = await fetchCourses();
    courseList = courseObjList.map(c => c.fullname);
    console.log("courseList: ", courseList);

    courseList.forEach(course => {
        const option = document.createElement('option');
        option.value = course;
        option.textContent = course;
        selectCourseList.appendChild(option);
    });
}
document.addEventListener("DOMContentLoaded", loadCourse);

async function updateCourseId() {
    console.log("select course: " + selectCourseList.value);
    const selectedCourseObj = courseObjList.find(course => course.fullname === selectCourseList.value);
    if (!selectedCourseObj) {
        // 還未選擇課程，或後端無此課程
        courseId = -1;
        console.error(`Cannot find course: ${selectCourseList.value}`);
        return;
    }

    courseId = selectedCourseObj.id;
    if (!courseId) {
        console.error(`Cannot find course id for: ${selectCourseList.value}`);
        return;
    }
    console.log("update courseid: " + courseId);

    let studentListElement = document.getElementsByClassName("selected-class_student_list")[0];
    studentListElement.innerHTML = "";

    let studentObjList = await get_student_from_course(courseId);
    let studentsIdList = studentObjList.map( obj => obj.id );
    let studentsNameList = studentObjList.map( obj => obj.fullname );
    
    document.getElementsByClassName("class_empty_hint")[0].style.display = 'none'
    document.getElementsByClassName("selected-class_student_list")[0].style.display = 'block'

    studentsNameList.forEach((student_name) => {
        studentListElement.innerHTML += `
            <div class="student-item">
                <div class="image"></div>
                <div class="student-info">
                    <div class="name">${student_name}</div>
                </div>
            </div>
        `;
    });

    let lessonPlanData = JSON.parse(selectedCourseObj.summary);
    showLessonPlanData(lessonPlanData);
}
selectCourseList.addEventListener("change", updateCourseId);

function showLessonPlanData(lessonPlanData) {
    document.getElementById("lesson-plan-name").value = lessonPlanData.name;
    document.getElementById("lesson-plan-author").value = lessonPlanData.author;
    document.getElementById("lesson-plan-target").value = lessonPlanData.target;
    document.getElementById("lesson-plan-time").value = lessonPlanData.time;
    document.getElementById("lesson-plan-motivation").value = lessonPlanData.motivation;
    document.getElementById("lesson-plan-place").value = lessonPlanData.place;
    document.getElementById("lesson-plan-core_value").value = lessonPlanData.coreValue;
    document.getElementById("lesson-plan-core_importance").value = lessonPlanData.coreImportance;
    document.getElementById("lesson-plan-source").value = lessonPlanData.source;
    document.getElementById("lesson-plan-facilities").value = lessonPlanData.facilities;
    document.getElementById("lesson-plan-goal").value = lessonPlanData.goal;

    let core_select_btns = document.getElementsByClassName("core-btn");

    for (let i = 0; i < core_select_btns.length; i++) {
        core_select_btns[i].classList.remove("core-btn-selected");
    }

    for (let i = 0; i < core_select_btns.length; i++) {
        let check = core_select_btns[i].parentElement.getElementsByClassName("core-label")[0].textContent;

        if (check !== lessonPlanData.mainCoreValue) {
            core_select_btns[i].style.backgroundImage = "";
            core_select_btns[i].classList.remove("core-btn-selected");
        }
        else {
            core_select_btns[i].style.backgroundImage = "url('./assets/images/teacher_lesson_plan/Checkbox.svg')";
            core_select_btns[i].classList.add("core-btn-selected");
        }
    }

    let activityElement = document.getElementById("lesson-plan-activity");
    activityElement.innerHTML = `
        <div class="event-row" style="display: flex;">
            <div class="event-row-title" style="width: 45%;">學習內容及實施方式</div>
            <div class="event-row-title" style="width: 17.5%;">時間</div>
            <div class="event-row-title" style="width: 37.5%;">標準答案</div>
        </div>
    `;

    for (const [idx, activity] of Object.entries(lessonPlanData.activities)) {
        activityElement.innerHTML += `
            <div class="event-row" id="event${idx}" style="background: rgb(255, 255, 255);">
                <input class="event-row-title-textarea event-name" placeholder="請輸入活動名稱" maxlength="20" value="${activity.name}">
                <button class="event-delete-btn" id="event${idx}" onclick="eventDelete(this.id)"></button>
            </div>
            <div class="event-row" id="event${idx}">
                <input class="event-row-title-textareacontent event-description" placeholder="請輸入學習內容及實施方式" maxlength="40" style="width: 45%;" value="${activity.description}">
                <input class="event-row-title-textareacontent event-time" placeholder="請輸入時間(min)，ex. 5" type="number" min="0" max="99" style="width: 17.5%;" value="${activity.time}">
                <input class="event-row-title-textareacontent event-answer" placeholder="請輸入標準答案" maxlength="50" style="width: 37.5%;" value="${activity.answer}">
            </div>
        `;
    }
}

function getIndex(indexAttr) {
    return parseInt(indexAttr.replace('event', ''));
}

document.getElementById("submitButton").addEventListener("click", async () => {
    let activities = {};
    let activityElements = document.getElementById("lesson-plan-activity").querySelectorAll(".event-row");

    let act_name, act_description, act_time, act_answer;

    if (courseId < 0) {
        alert('請先選擇課程');
        return;
    }

    activityElements.forEach((activityElement) => {
        if (activityElement.hasAttribute('id')) {
            let idx = getIndex(activityElement.getAttribute('id'));

            if (activityElement.querySelector(".event-name") != null) {
                act_name = activityElement.querySelector(".event-name").value || "團體討論";
            }
            else {
                act_description = activityElement.querySelector(".event-description").value || "";
                act_time = activityElement.querySelector(".event-time").value || "5";
                act_answer = activityElement.querySelector(".event-answer").value || "";

                activities[idx] = {
                    name: act_name,
                    description: act_description,
                    time: act_time,
                    answer: act_answer,
                };
            }
        }
    });

    let mainCoreValue = "";

    if (document.getElementById("lesson-plan-main_core_value").querySelector(".core-btn-selected") !== null) {
        mainCoreValue = document.getElementById("lesson-plan-main_core_value")
            .querySelector(".core-btn-selected")
            .parentElement
            .getElementsByClassName("core-label")[0]
            .textContent;
    }

    const lessonPlanData = {
        name: document.getElementById("lesson-plan-name").value,
        author: document.getElementById("lesson-plan-author").value,
        target: document.getElementById("lesson-plan-target").value,
        time: document.getElementById("lesson-plan-time").value,
        motivation: document.getElementById("lesson-plan-motivation").value,
        place: document.getElementById("lesson-plan-place").value,
        mainCoreValue: mainCoreValue,
        coreValue: document.getElementById("lesson-plan-core_value").value,
        coreImportance: document.getElementById("lesson-plan-core_importance").value,
        source: document.getElementById("lesson-plan-source").value,
        facilities: document.getElementById("lesson-plan-facilities").value,
        goal: document.getElementById("lesson-plan-goal").value,
        activities: activities,
    };

    try {
        const token = localStorage.getItem('token');
        if (!token) window.location.href = 'login_edu.html';

        console.log(`正在上傳教案：${JSON.stringify(lessonPlanData)}`);

        const ret = await fetch(`${HOSTNAME}/moodle/webservice/rest/server.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                wstoken: token,
                wsfunction: 'core_course_update_courses',
                moodlewsrestformat: 'json',
                'courses[0][id]': courseId,
                'courses[0][summary]': JSON.stringify(lessonPlanData)
            })
        }).then(ret => ret.json());

        console.log(`上傳教案結果：`);
        console.log(ret);
        alert('教案上傳成功');

    } catch (error) {
        alert(`發生錯誤: ${error.message}`);
    }
});
