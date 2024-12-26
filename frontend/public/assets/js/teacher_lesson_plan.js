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

    let studentsIdList = await get_student_from_course(courseId);
    let studentsNameList = await Promise.all(studentsIdList.map(id => get_user_fullname_by_id(id)));

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
}
selectCourseList.addEventListener("change", updateCourseId);

function getIndex(indexAttr) {
    return parseInt(indexAttr.replace('event', ''));
}

document.getElementById("submitButton").addEventListener("click", async () => {
    let activities = {};
    let activityElements = document.getElementById("lesson-plan-activity").querySelectorAll(".event-row");

    let act_name, act_description, act_time, act_answer;
    let name_check = false, time_check = false, last_check = false;

    if (courseId < 0) {
        alert('請先選擇課程');
        return;
    }

    activityElements.forEach((activityElement) => {
        if (activityElement.hasAttribute('id')) {
            let idx = getIndex(activityElement.getAttribute('id'));

            if (activityElement.querySelector(".event-name") != null) {
                act_name = activityElement.querySelector(".event-name").value;
                name_check = true;
            }
            else{
                act_name = "團體討論";
                name_check = true;
            }

            if (activityElement.querySelector(".event-description") != null) {
                act_description = activityElement.querySelector(".event-description").value;
            }

            if (activityElement.querySelector(".event-time") != null) {
                act_time = activityElement.querySelector(".event-time").value;
                time_check = true;
            }

            if (activityElement.querySelector(".event-answer") != null) {
                act_answer = activityElement.querySelector(".event-answer").value;
                last_check = true;
            }

            if (last_check) {
                if (!name_check) {
                    return;
                }
                if (!time_check) {
                    act_time = 5;
                }

                activities[idx] = {
                    name: act_name,
                    description: act_description,
                    time: act_time,
                    answer: act_answer,
                };
                name_check = false;
                time_check = false;
                last_check = false;
            }
        }
    });

    for (const [idx, activity] of Object.entries(activities)) {
        if (activity.name === "") {
            alert(`活動${idx}名稱不可為空`);
            return;
        }
    }

    const lessonPlanData = {
        name: document.getElementById("lesson-plan-name").value,
        author: document.getElementById("lesson-plan-author").value,
        target: document.getElementById("lesson-plan-target").value,
        time: document.getElementById("lesson-plan-time").value,
        motivation: document.getElementById("lesson-plan-motivation").value,
        place: document.getElementById("lesson-plan-place").value,
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
