let courseList = []; // course name only
let courseObjList = [];
const courseSelect = document.getElementById("course-select");
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
    courseSelect.selectedIndex = 0;
}
async function add_student() {
    const studentContainer = document.getElementsByClassName("student-container");
    
    const inner_html = 
            `<div class="student-item">
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="white"/>
                    <g transform="translate(3, 3)" > 
                    <path d="M13.1007 13.6036C13.4692 13.5268 13.6887 13.1411 13.5056 12.8122C13.1019 12.0871 12.4658 11.4499 11.6522 10.9644C10.6044 10.339 9.32046 10 7.99966 10C6.67885 10 5.39495 10.339 4.34709 10.9643C3.53347 11.4499 2.89745 12.0871 2.49373 12.8122C2.3106 13.1411 2.53009 13.5268 2.89863 13.6036C6.26317 14.3048 9.73614 14.3048 13.1007 13.6036Z" fill="#8665CD"/>
                    <circle cx="8.00033" cy="5.33333" r="3.33333" fill="#8665CD"/>
                    </g> 
                </svg>
                </div>
                <div class="student-info">
                    <p class="name">${1}</p>
                    <p class="class">${1}</p>
                </div>
            </div>`
    
}
document.addEventListener("DOMContentLoaded", loadCourse);


document.addEventListener("DOMContentLoaded", function() {
    
    // var datas = {
    //     "資訊課": {
    //         "王小明": {
    //             basic: 8,
    //             deep: 7,
    //             inter: 6,
    //             basicdescription: "學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。",
    //             deepdescription: "學生偶爾沒有聽清楚同學的意見或沒有回應同學的問題。",
    //             interdes: "學生與同學的交流良好，能夠分享自己的意見和與同學討論。",
    //             errleft: "內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內"
    //         },
    //         "張小強": {
    //             basic: 6,
    //             deep: 4,
    //             inter: 7,
    //             basicdescription: "張小強在輔導課中積極參與，能夠提出見解並與同學討論。",
    //             deepdescription: "偶爾在小組討論中表現出理解的不足。",
    //             interdes: "與同學的交流良好，積極參與並能傾聽他人的意見。",
    //             errleft: "內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內"
    //         },
    //         "李小華": {
    //             basic: 7,
    //             deep: 6,
    //             inter: 5,
    //             basicdescription: "李小華積極參與討論，能提出一些見解。",
    //             deepdescription: "在與同學討論中，有時未能聽清或回應對方。",
    //             interdes: "與同學的互動良好，能夠參與討論並分享意見。",
    //             errleft: "內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內"
    //         }
    //     },
    //     "輔導課": {
    //         "王小明": {
    //             basic: 9,
    //             deep: 3,
    //             inter: 5,
    //             basicdescription: "學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。",
    //             deepdescription: "學生偶爾沒有聽清楚同學的意見或沒有回應同學的問題。",
    //             interdes: "學生與同學的交流良好，能夠分享自己的意見和與同學討論。",
    //             errleft: "內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內"
    //         },
    //         "張小強": {
    //             basic: 6,
    //             deep: 4,
    //             inter: 7,
    //             basicdescription: "張小強在輔導課中積極參與，能夠提出見解並與同學討論。",
    //             deepdescription: "偶爾在小組討論中表現出理解的不足。",
    //             interdes: "與同學的交流良好，積極參與並能傾聽他人的意見。",
    //             errleft: "內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內"
    //         },
    //         "李小華": {
    //             basic: 7,
    //             deep: 6,
    //             inter: 5,
    //             basicdescription: "李小華積極參與討論，能提出一些見解。",
    //             deepdescription: "在與同學討論中，有時未能聽清或回應對方。",
    //             interdes: "與同學的互動良好，能夠參與討論並分享意見。",
    //             errleft: "內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內"
    //         }
    //     }
    // };
    
    
    // const courseSelect = document.getElementById("course-select");
    // const selectedStuName = document.getElementById("selected-student-name");

    // const selectedCourseName = document.getElementById("selected-course-name");

    // const studentItems = document.querySelectorAll('.student-item');

    // studentItems.forEach(item => {
    //     item.addEventListener('click', function() {
    //         const studentName = item.querySelector('.name').innerText;
    //         const selectedCourse = courseSelect.value;

    //         selectedStuName.textContent = studentName;

    //         // 檢查是否有選擇課程且資料存在
    //         if (selectedCourse && datas[selectedCourse] && datas[selectedCourse][studentName]) {
    //             const data = datas[selectedCourse][studentName];
    //             updateInfoCards(data);
    //         } 
    //     });
    // });

    // courseSelect.addEventListener("change", function() {
    //     const selectedCourse = courseSelect.value;
    //     selectedCourseName.textContent = selectedCourse ? selectedCourse : "";
    // });

    
    
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

        fetch('assets/data/response.txt')
            .then(response => {
                if (!response.ok) {
                throw new Error('無法讀取檔案');
                }
                return response.text();
            })
            .then(text => {
                const data = {};
                text.split('\n').forEach(line => {
                const [key, value] = line.split(':');
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

    studentItems.forEach(item => {
        item.addEventListener('click', function() {
            const studentName = item.querySelector('.name').innerText;
            selectedStuName.textContent = studentName;
            localStorage.setItem("savedTime", Date.now());
            localStorage.setItem("studentName", studentName);
            
            fetch('assets/data/response.txt')
            .then(response => {
                if (!response.ok) {
                throw new Error('無法讀取檔案');
                }
                return response.text();
            })
            .then(text => {
                const lines = text.split('\n'); 
                const data = {};
                lines.forEach(line => {
                const [key, value] = line.split(':');
                if (key && value) {
                    data[key.trim()] = value.trim();
                }
                });
                updateInfoCards(data);
            })
            .catch(error => {
                console.error('讀取檔案時發生錯誤:', error);
            });

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

    // 設定按鈕切換頁面

    // document.getElementById("trend-btn").addEventListener("click", function() {
    //     window.location.href = "tcfb_trend_edu.html";
    //     });
    
});
