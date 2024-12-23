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
    document.getElementById("overview-btn").addEventListener("click", function() {
        window.location.href = "stufb_understand_edu.html";
    });

    document.getElementById("trend-btn").addEventListener("click", function() {
        window.location.href = "stufb_trend_edu.html";
        });
    
});