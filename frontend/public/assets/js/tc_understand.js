let courseList = []; // course name only
let courseObjList = [];
let courseId = -1; // 還未選擇課程: -1
let studentId = -1; // 還未選擇學生: -1
let assignmentId = [-1]; // 還未選擇作業: -1
let llmFeedbackUrl = null; // 作業提交資訊 URL (其實就是去把作業區的回饋llm.txt的內容抓出來)
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

    document.querySelectorAll('.student-item').forEach((student) => {
        student.addEventListener("click", () => {
            console.log(student.querySelector('.name').textContent);
            studentId = studentsIdList[studentsNameList.indexOf(student.querySelector('.name').textContent)];
            console.log("studentId: ", studentId);
            // TODO: fetch student's response
            updateAssignmentId();
        });
    });
}
selectCourseList.addEventListener("change", updateCourseId);

document.addEventListener("DOMContentLoaded", function() {

    const courseSelect = document.getElementById("select-class");
    const classSelect = document.getElementById("class-select");
    
    const selectedStuName = document.getElementById("selected-student-name");
    const selectedCourseName = document.getElementById("selected-course-name");
    const studentItems = document.querySelectorAll('.student-item');


    const savedTime = localStorage.getItem("savedTime");
    const currentTime = Date.now();
    const studentName = localStorage.getItem("studentName");
    const savedCourse = localStorage.getItem("selectedCourse");
    // const saveddClass = localStorage.getItem("selectedClass");

    //頁面每10分鐘刷新一次(=頁面變成預設尚未選擇課程狀態)
    if (studentName && savedTime && currentTime - savedTime >10 * 60 * 1000) {
        localStorage.removeItem("selectedCourse");
        localStorage.removeItem("studentName");
        localStorage.removeItem("savedTime");
        localStorage.removeItem("selectedClass");
    } else if (studentName) {
        selectedStuName.textContent = studentName;
        selectedCourseName.textContent = savedCourse;
        courseSelect.value = savedCourse;
        // classSelect.value = saveddClass;

    }

    studentItems.forEach(item => {
        item.addEventListener('click', function() {
            const studentName = item.querySelector('.name').innerText;
            selectedStuName.textContent = studentName;
            localStorage.setItem("savedTime", Date.now());
            localStorage.setItem("studentName", studentName);
        });
    });

    courseSelect.addEventListener("change", function() {
        const selectedCourse = courseSelect.value;
        localStorage.setItem("selectedCourse", selectedCourse);
        selectedCourseName.textContent = selectedCourse ? selectedCourse : "";
    });

    // classSelect.addEventListener("change", function() {
    //     const selectedClass = classSelect.value;
    //     localStorage.setItem("selectedClass", selectedClass);
    // });


    // 設定按鈕切換頁面

    // document.getElementById("trend-btn").addEventListener("click", function() {
    //     window.location.href = "tcfb_trend_edu.html";
    //     });
    
});

async function updateAssignmentId() {
    const token = localStorage.getItem('token');
    const savedCourseId = courseId;

	const assignmentUrl = `${HOSTNAME}/moodle/webservice/rest/server.php?wstoken=${token}&wsfunction=mod_assign_get_assignments&moodlewsrestformat=json&courseids[0]=${savedCourseId}`;

	try {
		const assignmentResponse = await fetch(assignmentUrl);
		const data = await assignmentResponse.json();
        console.log("assignment data: ", data);
		// 分析回傳的數據，找出最新開放的作業
        if (data.courses && data.courses.length > 0) {
            const assignments = data.courses[0].assignments;

            // 排序作業，根據 allowsubmissionsfromdate 找出最新開放的作業
            const sortedAssignments = assignments
                .sort((a, b) => b.id - a.id);
                
            if (sortedAssignments.length > 0) {
                const latestAssignment = sortedAssignments[0];
				assignmentId[0] = latestAssignment.id; // 同步更新 assignmentId
                console.log('最新開放的作業 ID:', latestAssignment.id);
                llmFeedbackUrl = await getSubmissionUrl();
                if (llmFeedbackUrl) {
                    console.log('更新的 llmFeedbackUrl:', llmFeedbackUrl);
                    fetchSubmissionData(); // 將後續 Fetch 的邏輯放到此處
                } else {
                    console.warn('未能獲取有效的 llmFeedbackUrl');
                    // clearfbdata();
                }
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

async function getSubmissionUrl() {
    if (assignmentId[0] === -1) {
        console.error('尚未選擇作業');
        return;
    }
    const token = localStorage.getItem('token');
    const submissionUrl = `${HOSTNAME}/moodle/webservice/rest/server.php?wstoken=${token}&wsfunction=mod_assign_get_submissions&moodlewsrestformat=json&assignmentids[]=${assignmentId}`;
    try {
        const submissionResponse = await fetch(submissionUrl);
        const data = await submissionResponse.json();
        console.log('作業提交資訊:', data);

        // 確認是否有提交資訊
        if (data.assignments && data.assignments.length > 0) {

            const assignment = data.assignments.find(a => a.assignmentid === assignmentId[0]);
            
            if (assignment && assignment.submissions) {
                // 根據 userId 找到該學生的提交
                const studentSubmission = assignment.submissions.find((sub) => sub.userid === studentId);
                console.log('選擇的學生作業:', studentSubmission);
                if (studentSubmission && studentSubmission.plugins) {
                    // 遍歷 plugins，找到包含檔案的部分
                    for (const plugin of studentSubmission.plugins) {
                        if (plugin.fileareas && plugin.fileareas.length > 0) {
                            for (const filearea of plugin.fileareas) {
                                const files = filearea.files;

                                // 在 files 中找到目標檔案
                                const targetFile = files.find(file => file.filename === "llm.txt");
                                if (targetFile) {
                                    const fileUrl = `${targetFile.fileurl}?token=${token}`; // 添加 Token 授權下載
                                    console.log(`找到目標檔案的 URL: ${fileUrl}`);
                                    return fileUrl;
                                }
                            }
                        }
                    }
                }
            }
            console.warn(`未找到該學生 (userId: ${userId}) 的目標檔案: llm.txt`);
            return null;
        } else {
            console.warn('沒有找到任何提交檔案');
            return null;
        }
    }
    catch (error) {
        console.error('無法取得作業提交資訊:', error);
    }
}

// 獨立封裝 Fetch 作業的邏輯
function fetchSubmissionData() {
    console.log('開始讀取作業提交資訊:', llmFeedbackUrl);
    fetch(llmFeedbackUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('無法讀取檔案');
            }
            console.log('讀取檔案成功:', response);
            return response.text();
        })
        .then(text => {
            console.log('讀取檔案成功:\n', text);
            const data = {};
            text.split('\n').forEach(line => {  
                console.log('line:', line); // Debug
                const [key, value] = line.split(/[：:]/);
                console.log('key:', key, 'value:', value); // Debug
                if (key && value) {
                    data[key.trim()] = value.trim();
                }
            });
            updateInfoCards(data);
        })
        .catch(error => {
            console.error('讀取檔案時發生錯誤:', error);
        });
}

function updateInfoCards(data) {
   
    document.querySelector("#deep-id").textContent = `${data['理解程度報告-深入知識理解-評分']}/10`;
    document.querySelector("#basic-id").textContent = `${data['理解程度報告-基本概念理解-評分']}/10`;
    document.querySelector("#deep-ids").textContent = `${data['理解程度報告-深入知識理解-評分']}`;
    document.querySelector("#deep-ids").style.color = "#000000";
    document.querySelector("#deep-ids").style.fontSize = "3.46rem";
    document.querySelector("#deep-ids").style.fontWeight ="900";

    document.querySelector("#basic-ids").textContent = `${data['理解程度報告-基本概念理解-評分']}`;
    document.querySelector("#basic-ids").style.fontWeight ="900";
    document.querySelector("#basic-ids").style.color = "#000000";
    document.querySelector("#basic-ids").style.fontSize = "3.46rem";
    
    document.querySelector("#ten-idB").textContent = "/10";
    document.querySelector("#ten-idB").style.fontWeight ="900";

    document.querySelector("#ten-idA").textContent = "/10";
    document.querySelector("#ten-idA").style.fontWeight ="900";

    document.querySelector("#basic-des").textContent =`${data['理解程度報告-基本概念理解-內容']}`;
    document.querySelector("#basic-des").style.margin ="0px";
    document.querySelector("#basic-des").style.color = "#363636";


    document.querySelector("#deep-des").textContent =`${data['理解程度報告-深入知識理解-內容']}`;
    document.querySelector("#deep-des").style.margin ="0px";
    document.querySelector("#deep-des").style.color = "#363636";


    document.querySelector("#errright").textContent =`${data['理解程度報告-錯誤整理']}`;
    document.querySelector("#errright").style.margin ="0px";
    document.querySelector("#errright").style.color = "#363636";


    document.querySelector("#errleft").textContent =`${data['理解程度報告-待加強的觀念與知識']}`;
    document.querySelector("#errleft").style.margin ="0px";
    document.querySelector("#errleft").style.color = "#363636";

}

function clearfbdata(){
    localStorage.removeItem('courseId');
        
    // 重置全域變數
    courseId = -1;
    assignmentId[0] = -1;
    llmFeedbackUrl = null;
    location.reload();
}
