let courseList = []; // course name only
let courseObjList = [];
let courseId = -1; // 還未選擇課程: -1
const selectCourseList = document.querySelector('#course-select')

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
    selectCourseList.selectedIndex = 0;
}
document.addEventListener("DOMContentLoaded", loadCourse);

document.addEventListener("DOMContentLoaded", function() {
    // var datas = {
    //     "資訊課": {
            
    //         basic:6,
    //         deep:4,
    //         errleft:"根據過往的紀錄，學生的理解程度與互動風格持續穩步進步，特別是在參與度和交流度方面表現突出。",
    //         errright:"學生可以繼續加強對幸福感相關理論的學習，培養批判性思考和自我分析的能力。同時，學生也可以嘗試運用幸福感的概念解決實際問題，例如設計幸福感相關的活動或研究項目。"
    //     },
    //     "輔導課": {
            
    //         basic:9,
    //         deep:3,
    //         errleft:"根據過往的紀錄，學生的理解程度與互動風格持續穩步進步，特別是在參與度和交流度方面表現突出。根據過往的紀錄，學生的理解程度與互動風格持續穩步進步，特別是在參與度和交流度方面表現突出。根據過往的紀錄，學生的理解程度與互動風格持續穩步進步，特別是在參與度和交流度方面表現突出。",
    //         errright:"學生可以繼續加強對幸福感相關理論的學習，培養批判性思考和自我分析的能力。同時，學生也可以嘗試運用幸福感的概念解決實際問題，例如設計幸福感相關的活動或研究項目。學生可以繼續加強對幸福感相關理論的學習，培養批判性思考和自我分析的能力。同時，學生也可以嘗試運用幸福感的概念解決實際問題，例如設計幸福感相關的活動或研究項目。"
    //     },
        
        
    // };
    
    // const courseSelect = document.getElementById("course-select");
    // const selectedCourseName = document.getElementById("selected-course-name");

    const card1 = document.getElementById("card-1");
    const card2 = document.getElementById("card-2");
    const card3 = document.getElementById("card-3");

    const interactioncards= document.getElementById("interaction-cards-id");
    const aidefault = document.getElementById("ai-default");




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
       
       
    });

    function updateInfoCards(data) {


        document.querySelector("#errright").textContent =`${data['長期趨勢報告-學生整體進步或退步狀況']}`;
        document.querySelector("#errright").style.margin ="0px";
        document.querySelector("#errright").style.color = "#363636";


        document.querySelector("#errleft").textContent =`${data['長期趨勢報告-學生未來學習方向']}`;
        document.querySelector("#errleft").style.margin ="0px";
        document.querySelector("#errleft").style.color = "#363636";







        card1.style.display = "block";
        card2.style.display = "block";
        card3.style.display = "block";


        interactioncards.style.border = "#ffffff";
        
        aidefault.style.display = "none";
    
    }

    // 設定按鈕切換頁面
    document.getElementById("interaction-btn").addEventListener("click", function() {
        window.location.href = "stufb_interaction_edu.html";
    });

    document.getElementById("overview-btn").addEventListener("click", function() {
        window.location.href = "stufb_understand_edu.html";
    });
    
});