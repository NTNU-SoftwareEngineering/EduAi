let courseList = []; // course name only
let courseObjList = [];
let courseId = -1; // 還未選擇課程: -1
const selectCourseList = document.querySelector('#class')

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

function updateCourseId() {
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
}
selectCourseList.addEventListener("change", updateCourseId);


document.getElementById("submitButton").addEventListener("click", async () => {
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
    };

    if ( courseId < 0 ) {
        alert('請先選擇課程');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if ( !token ) window.location.href = 'login_edu.html';
      
        console.log(`正在上傳教案：${JSON.stringify(lessonPlanData)}`)

        const ret = await fetch ( 'http://localhost:8080/moodle/webservice/rest/server.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                wstoken: 'b69e3cf2abe404972aaa8c73a21cffc3',
                wsfunction: 'core_course_update_courses',
                moodlewsrestformat: 'json',
                'courses[0][id]': courseId,
                'courses[0][summary]': JSON.stringify(lessonPlanData)
            })
        }).then ( ret => ret.json() );
        
        console.log(`上傳教案結果：`);
        console.log(ret);

    } catch (error) {
        alert(`發生錯誤: ${error.message}`);
    }
});
