let courseList = []; // course name only
let courseObjList = [];
let courseId = -1; // 還未選擇課程: -1
let assignmentId = -1; // 還未選擇作業: -1
let llmFeedbackUrl = null; // 作業提交資訊 URL (其實就是去把作業區的回饋llm.txt的內容抓出來)
const selectCourseList = document.querySelector('#course-select')

function updateCourseId() {
    console.log( "select course: " + selectCourseList.value );
    selectedCourseObj = courseObjList.find( course => course.fullname === selectCourseList.value);
    if ( !selectedCourseObj ) {
        // 還未選擇課程，或後端無此課程
        courseId = -1;
        assignmentId = -1;
        llmFeedbackUrl = null;
        console.error(`Cannot find course: ${selectCourseList.value}`);
        return;
    };

    courseId = selectedCourseObj.id;
    if ( !courseId ) {
        console.error(`Cannot find course id for: ${selectCourseList.value}`);
        return;
    }
    console.log( "update courseid: " + courseId );

    // 預設清空 assignmentId 並更新 llmFeedbackUrl
    assignmentId = -1;
    llmFeedbackUrl = null;

    updateAssignmentId(); // 同步更新 assignmentId
}
selectCourseList.addEventListener("change", updateCourseId);

async function loadCourse() { // fetch course data from backend
    courseObjList = await fetchCourses();
    courseList = courseObjList.map(c => c.fullname);
    console.log("courseList: ", courseList);

    // 更改 sourse-select 下拉選單的值
    const course_select_ele = document.getElementById('course-select');
    

    // 將靜態網頁預填的選項清空
    course_select_ele.innerHTML = '<option value="" disabled selected>請選擇課程</option>';
    
    courseList.forEach ( course => {
        const option = document.createElement('option');
        option.value = course;
        option.textContent = course;
        course_select_ele.appendChild(option);
    });
}
document.addEventListener("DOMContentLoaded", loadCourse);

document.addEventListener("DOMContentLoaded", function() {

    // var datas = {
    //     "資訊課": {
            
    //         basic:8,
    //         deep:7,
    //         inter:6,
    //         basicdescription: "學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。",
    //         deepdescription: "學生偶爾沒有聽清楚同學的意見或沒有回應同學的問題。",
    //         interdes:"學生與同學的交流良好，能夠分享自己的意見和與同學討論。",
    //         errleft:"內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內",
    //     },
    //     "輔導課": {
            
    //         basic:9,
    //         deep:3,
    //         inter:5,
    //         basicdescription: "學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。",
    //         deepdescription: "學生偶爾沒有聽清楚同學的意見或沒有回應同學的問題。學生偶爾沒有聽清楚同學的意見或沒有回應同學的問題。學生偶爾沒有聽清楚同學的意見或沒有回應同學的問題。學生偶爾沒有聽清楚同學的意見或沒有回應同學的問題。學生偶爾沒有聽清楚同學的意見或沒有回應同學的問題。",
    //         interdes:"學生與同學的交流良好，能夠分享自己的意見和與同學討論。學生與同學的交流良好，能夠分享自己的意見和與同學討論。學生與同學的交流良好，能夠分享自己的意見和與同學討論。學生與同學的交流良好，能夠分享自己的意見和與同學討論。",
    //         errleft:"內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內",
    //     },
        
        
    // };
    
    // const courseSelect = document.getElementById("course-select");
    // const selectedCourseName = document.getElementById("selected-course-name");

    // courseSelect.addEventListener("change", function() {
    //     const selectedCourse = courseSelect.value;
    //     // console.log("selectedCourse",selectedCourse)
    //     selectedCourseName.textContent = selectedCourse ? selectedCourse : "";
    //     if (selectedCourse && datas[selectedCourse]) {
    //         const data = datas[selectedCourse];
    //         // console.log("data:",data)
    //         // console.log("理解度:",data.理解度評語)
    //         updateInfoCards(data);
    //     } else {
    //         // console.log("data:",data);
            
    //     }
       
    // });

    const courseSelect = document.getElementById("course-select");
    const selectedCourseName = document.getElementById("selected-course-name");
    
    const savedTime = localStorage.getItem("savedTime");
    const currentTime = Date.now();

    const savedCourse = localStorage.getItem("selectedCourse");
    //頁面每10分鐘刷新一次(=頁面變成預設尚未選擇課程狀態)
    if (savedCourse && savedTime && currentTime - savedTime > 10 * 60 * 1000) {
        
        localStorage.removeItem("selectedCourse");
        localStorage.removeItem("savedTime");
    } else if (savedCourse) {
        selectedCourseName.textContent = savedCourse;
        courseSelect.value = savedCourse;
    }


    courseSelect.addEventListener("change", function() {
        const selectedCourse = courseSelect.value;
        console.log("selectedCourse",selectedCourse)
        localStorage.setItem("selectedCourse", selectedCourse);
        selectedCourseName.textContent = selectedCourse ? selectedCourse : "";
        localStorage.setItem("savedTime", Date.now());

            // const data = datas[selectedCourse];
            // console.log("data:",data)
            // console.log("理解度:",data.理解度評語)
            // updateInfoCards(data);
    });

    // 設定按鈕切換頁面
    document.getElementById("overview-btn").addEventListener("click", function() {
        window.location.href = "stufb_understand_edu.html";
    });

    // document.getElementById("trend-btn").addEventListener("click", function() {
    //     window.location.href = "stufb_trend_edu.html";
    //     });
    
});

async function updateAssignmentId() {
    const token = localStorage.getItem('token');
	const assignmentUrl = `https:/eduai-api.andy-lu.dev/moodle/webservice/rest/server.php?wstoken=${token}&wsfunction=mod_assign_get_assignments&moodlewsrestformat=json&courseids[0]=${courseId}`;
	try {
		const assignmentResponse = await fetch(assignmentUrl);
		const data = await assignmentResponse.json();
		// 分析回傳的數據，找出最新開放的作業
        if (data.courses && data.courses.length > 0) {
            const assignments = data.courses[0].assignments;

            // 排序作業，根據 allowsubmissionsfromdate 找出最新開放的作業
            const sortedAssignments = assignments
                .filter(a => a.allowsubmissionsfromdate) // 確保有開放時間
                .sort((a, b) => b.allowsubmissionsfromdate - a.allowsubmissionsfromdate);

            if (sortedAssignments.length > 0) {
                const latestAssignment = sortedAssignments[0];
				assignmentId = latestAssignment.id; // 同步更新 assignmentId
                console.log('最新開放的作業 ID:', latestAssignment.id);
                llmFeedbackUrl = await getSubmissionUrl();
                if (llmFeedbackUrl) {
                    console.log('更新的 llmFeedbackUrl:', llmFeedbackUrl);
                    fetchSubmissionData(); // 將後續 Fetch 的邏輯放到此處
                } else {
                    console.warn('未能獲取有效的 llmFeedbackUrl');
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
    if (assignmentId === -1) {
        console.error('尚未選擇作業');
        return;
    }
    const token = localStorage.getItem('token');
    const submissionUrl = `https:/eduai-api.andy-lu.dev/moodle/webservice/rest/server.php?wstoken=${token}&wsfunction=mod_assign_get_submission_status&moodlewsrestformat=json&assignid=${assignmentId}`;
    try {
        const submissionResponse = await fetch(submissionUrl);
        const data = await submissionResponse.json();
        console.log('作業提交資訊:', data);
        // 檢查是否有提交資訊
        if (data.lastattempt && data.lastattempt.submission && data.lastattempt.submission.plugins) {
            // 遍歷 plugins，找到包含檔案的部分
            for (const plugin of data.lastattempt.submission.plugins) {
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
            console.warn(`未找到目標檔案: llm.txt`);
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
            return response.text();
        })
        .then(text => {
            console.log('讀取檔案成功:\n', text);
            const data = {};
            text.split('\n').forEach(line => {
                console.log('line:', line); // Debug
                const [key, value] = line.split('：');
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
   
    document.querySelector("#deep-id").textContent = `${data['互動反饋報告-傾聽度-評分']}/10`;
    document.querySelector("#basic-id").textContent = `${data['互動反饋報告-參與度-評分']}/10`;
    document.querySelector("#inter-id").textContent = `${data['互動反饋報告-交流度-評分']}/10`;

    document.querySelector("#deep-ids").textContent = `${data['互動反饋報告-傾聽度-評分']}/10`;
    document.querySelector("#basic-ids").textContent = `${data['互動反饋報告-參與度-評分']}/10`;
    document.querySelector("#inter-ids").textContent = `${data['互動反饋報告-交流度-評分']}/10`;

    document.querySelector("#basic-des").textContent =`${data['互動反饋報告-參與度-內容']}`;
    document.querySelector("#basic-des").style.margin ="0px";
    document.querySelector("#basic-des").style.color = "#363636";


    document.querySelector("#deep-des").textContent =`${data['互動反饋報告-傾聽度-內容']}`;
    document.querySelector("#deep-des").style.margin ="0px";
    document.querySelector("#deep-des").style.color = "#363636";

    document.querySelector("#inter-des").textContent =`${data['互動反饋報告-交流度-內容']}`;
    document.querySelector("#inter-des").style.margin ="0px";
    document.querySelector("#inter-des").style.color = "#363636";

    document.querySelector("#errleft").textContent =`${data['互動反饋報告-學生學習風格評語']}`;
    document.querySelector("#errleft").style.margin ="0px";
    document.querySelector("#errleft").style.color = "#363636";

}