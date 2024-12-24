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
            
    //         basic:6,
    //         deep:4,
    //         basicdescription: "學生對於幸福感的基本概念有一些了解，例如提到了「幸福感是情緒上的感受」、「幸福感與快樂相關」等。但是，學生對於幸福感的定義和相關理論缺乏深入的理解。",
    //         deepdescription: "學生對於幸福感相關的深入知識表現不足，例如沒有提到幸福感的種類（例如主觀幸福感、客觀幸福感）、幸福感的影響因素等。",
    //         errleft:"學生說「幸福感就是快樂，不過是兩種不同的詞彙」、「幸福感沒有什麼科學理據」。這些話表明學生對於幸福感的概念和理據缺乏明確。",
    //         errright:"幸福感的定義和理據，幸福感的影響因素（例如個性、生活事件、社會支持等），幸福感與快樂的區別。"
    //     },
    //     "輔導課": {
            
    //         basic:9,
    //         deep:3,
    //         basicdescription: "學生對於幸福感的基本概念有一些了解，例如提到了「幸福感是情緒上的感受」、「幸福感與快樂相關」等。但是，學生對於幸福感的定義和相關理論缺乏深入的理解。學生對於幸福感的基本概念有一些了解，例如提到了「幸福感是情緒上的感受」、「幸福感與快樂相關」等。但是，學生對於幸福感的定義和相關理論缺乏深入的理解。學生對於幸福感的基本概念有一些了解，例如提到了「幸福感是情緒上的感受」、「幸福感與快樂相關」等。但是，學生對於幸福感的定義和相關理論缺乏深入的理解。",
    //         deepdescription: "學生對於幸福感相關的深入知識表現不足，例如沒有提到幸福感的種類（例如主觀幸福感、客觀幸福感）、幸福感的影響因素等。學生對於幸福感相關的深入知識表現不足，例如沒有提到幸福感的種類（例如主觀幸福感、客觀幸福感）、幸福感的影響因素等。學生對於幸福感相關的深入知識表現不足，例如沒有提到幸福感的種類（例如主觀幸福感、客觀幸福感）、幸福感的影響因素等。學生對於幸福感相關的深入知識表現不足，例如沒有提到幸福感的種類（例如主觀幸福感、客觀幸福感）、幸福感的影響因素等。",
    //         errleft:"學生說「幸福感就是快樂，不過是兩種不同的詞彙」、「幸福感沒有什麼科學理據」。這些話表明學生對於幸福感的概念和理據缺乏明確。學生說「幸福感就是快樂，不過是兩種不同的詞彙」、「幸福感沒有什麼科學理據」。這些話表明學生對於幸福感的概念和理據缺乏明確。學生說「幸福感就是快樂，不過是兩種不同的詞彙」、「幸福感沒有什麼科學理據」。這些話表明學生對於幸福感的概念和理據缺乏明確。學生說「幸福感就是快樂，不過是兩種不同的詞彙」、「幸福感沒有什麼科學理據」。這些話表明學生對於幸福感的概念和理據缺乏明確。",
    //         errright:"幸福感的定義和理據，幸福感的影響因素（例如個性、生活事件、社會支持等），幸福感與快樂的區別。幸福感的定義和理據，幸福感的影響因素（例如個性、生活事件、社會支持等），幸福感與快樂的區別。幸福感的定義和理據，幸福感的影響因素（例如個性、生活事件、社會支持等），幸福感與快樂的區別。幸福感的定義和理據，幸福感的影響因素（例如個性、生活事件、社會支持等），幸福感與快樂的區別。"
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
        window.location.href = "stufb_interaction_edu.html";
    });

    // document.getElementById("trend-btn").addEventListener("click", function() {
    //     window.location.href = "stufb_trend_edu.html";
    //     });
    
});