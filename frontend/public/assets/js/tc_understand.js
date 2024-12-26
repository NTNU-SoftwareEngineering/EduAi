let courseList = []; // course name only
let courseObjList = [];
let courseId = -1; // 還未選擇課程: -1
let studentId = -1; // 還未選擇學生: -1
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
        });
    });
}
selectCourseList.addEventListener("change", updateCourseId);

document.addEventListener("DOMContentLoaded", function() {
    // var datas = {
    //     "資訊課": {
    //         "王小明": {
    //             basic: 6,
    //             deep: 4,
    //             basicdescription: "學生對於幸福感的基本概念有一些了解，例如提到了「幸福感是情緒上的感受」、「幸福感與快樂相關」等。但是，學生對於幸福感的定義和相關理論缺乏深入的理解。",
    //             deepdescription: "學生對於幸福感相關的深入知識表現不足，例如沒有提到幸福感的種類（例如主觀幸福感、客觀幸福感）、幸福感的影響因素等。",
    //             errleft: "學生說「幸福感就是快樂，不過是兩種不同的詞彙」、「幸福感沒有什麼科學理據」。這些話表明學生對於幸福感的概念和理據缺乏明確。",
    //             errright: "幸福感的定義和理據，幸福感的影響因素（例如個性、生活事件、社會支持等），幸福感與快樂的區別。"
    //         },
    //         "李小華": {
    //             basic: 5,
    //             deep: 6,
    //             basicdescription: "學生有基本的幸福感概念理解，但對具體應用還缺乏認識。",
    //             deepdescription: "在深入理解方面，未能很好地識別幸福感的不同層面，例如主觀幸福感與客觀幸福感。",
    //             errleft: "學生對幸福感與快樂的區別存在模糊理解，且在討論中經常忽略科學理據。",
    //             errright: "加強對幸福感不同種類的理解以及幸福感與快樂的區別。"
    //         },
    //         "張小強": {
    //             basic: 8,
    //             deep: 4,
    //             basicdescription: "學生在課堂中積極參與，並對幸福感的基本概念有清楚認識。",
    //             deepdescription: "在深入知識方面尚有不足，特別是在幸福感的影響因素上。",
    //             errleft: "學生將幸福感僅理解為情緒反應，並未提到社會支持等重要因素。",
    //             errright: "應更深入理解幸福感的多層面，特別是影響幸福感的外部因素。"
    //         }
    //     },
    //     "輔導課": {
    //         "王小明": {
    //             basic: 9,
    //             deep: 3,
    //             basicdescription: "學生對於幸福感的基本概念有一些了解，例如提到了「幸福感是情緒上的感受」、「幸福感與快樂相關」等。但是，學生對於幸福感的定義和相關理論缺乏深入的理解。",
    //             deepdescription: "學生對於幸福感相關的深入知識表現不足，例如沒有提到幸福感的種類（例如主觀幸福感、客觀幸福感）、幸福感的影響因素等。",
    //             errleft: "學生說「幸福感就是快樂，不過是兩種不同的詞彙」、「幸福感沒有什麼科學理據」。這些話表明學生對於幸福感的概念和理據缺乏明確。",
    //             errright: "幸福感的定義和理據，幸福感的影響因素（例如個性、生活事件、社會支持等），幸福感與快樂的區別。"
    //         },
    //         "李小華": {
    //             basic: 5,
    //             deep: 6,
    //             basicdescription: "學生有基本的幸福感概念理解，但對具體應用還缺乏認識。",
    //             deepdescription: "在深入理解方面，未能很好地識別幸福感的不同層面，例如主觀幸福感與客觀幸福感。",
    //             errleft: "學生對幸福感與快樂的區別存在模糊理解，且在討論中經常忽略科學理據。",
    //             errright: "加強對幸福感不同種類的理解以及幸福感與快樂的區別。"
    //         },
    //         "張小強": {
    //             basic: 8,
    //             deep: 4,
    //             basicdescription: "學生在課堂中積極參與，並對幸福感的基本概念有清楚認識。",
    //             deepdescription: "在深入知識方面尚有不足，特別是在幸福感的影響因素上。",
    //             errleft: "學生將幸福感僅理解為情緒反應，並未提到社會支持等重要因素。",
    //             errright: "應更深入理解幸福感的多層面，特別是影響幸福感的外部因素。"
    //         }
    //     }
    // };
    
    
    // const courseSelect = document.getElementById("course-select");
    // const selectedCourseName = document.getElementById("selected-course-name");
    // const selectedStuName = document.getElementById("selected-student-name");
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

    // 設定按鈕切換頁面
    document.getElementById("interaction-btn").addEventListener("click", function() {
        window.location.href = "tcfb_interaction_edu.html";
    });

    // document.getElementById("trend-btn").addEventListener("click", function() {
    //     window.location.href = "tcfb_trend_edu.html";
    //     });
    
});
