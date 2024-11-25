
document.addEventListener("DOMContentLoaded", function() {
    var datas = {
        "資訊課": {
            "王小明": {
                basic: 6,
                deep: 4,
                errleft: "根據過往的紀錄，學生的理解程度與互動風格持續穩步進步，特別是在參與度和交流度方面表現突出。",
                errright: "學生可以繼續加強對幸福感相關理論的學習，培養批判性思考和自我分析的能力。同時，學生也可以嘗試運用幸福感的概念解決實際問題，例如設計幸福感相關的活動或研究項目。"
            },
            "李小華": {
                basic: 7,
                deep: 3,
                errleft: "根據過往的紀錄，學生在資訊課中的理解能力逐步提升，尤其在編程和數據分析方面展現出色。",
                errright: "建議學生可以參與更多實踐項目，進一步強化理論知識的應用能力。"
            },
            "張小強": {
                basic: 5,
                deep: 4,
                errleft: "張小強在輔導課中展示出良好的理解能力，尤其在小組活動中積極參與。",
                errright: "建議他進一步提升溝通能力，並多進行自我反思以鞏固學習成果。"
            }
        },
        "輔導課": {
            "王小明": {
                basic: 9,
                deep: 3,
                errleft: "根據過往的紀錄，學生的理解程度與互動風格持續穩步進步，特別是在參與度和交流度方面表現突出。",
                errright: "學生可以繼續加強對幸福感相關理論的學習，培養批判性思考和自我分析的能力。同時，學生也可以嘗試運用幸福感的概念解決實際問題，例如設計幸福感相關的活動或研究項目。"
            },
            "李小華": {
                basic: 7,
                deep: 3,
                errleft: "根據過往的紀錄，學生在資訊課中的理解能力逐步提升，尤其在編程和數據分析方面展現出色。",
                errright: "建議學生可以參與更多實踐項目，進一步強化理論知識的應用能力。"
            },
            "張小強": {
                basic: 5,
                deep: 4,
                errleft: "張小強在輔導課中展示出良好的理解能力，尤其在小組活動中積極參與。",
                errright: "建議他進一步提升溝通能力，並多進行自我反思以鞏固學習成果。"
            }
        }
    };
    
    const courseSelect = document.getElementById("course-select");
    const selectedCourseName = document.getElementById("selected-course-name");
    const selectedStuName = document.getElementById("selected-student-name");

    const card1 = document.getElementById("card-1");
    const card2 = document.getElementById("card-2");
    const card3 = document.getElementById("card-3");

    const interactioncards= document.getElementById("interaction-cards-id");
    const aidefault = document.getElementById("ai-default");


    const studentItems = document.querySelectorAll('.student-item');

    studentItems.forEach(item => {
        item.addEventListener('click', function() {
            const studentName = item.querySelector('.name').innerText;
            const selectedCourse = courseSelect.value;

            selectedStuName.textContent = studentName;

            // 檢查是否有選擇課程且資料存在
            if (selectedCourse && datas[selectedCourse] && datas[selectedCourse][studentName]) {
                const data = datas[selectedCourse][studentName];
                updateInfoCards(data);
            } 
        });
    });

    courseSelect.addEventListener("change", function() {
        const selectedCourse = courseSelect.value;
        selectedCourseName.textContent = selectedCourse ? selectedCourse : "";
    });

   
    function updateInfoCards(data) {


        document.querySelector("#errright").textContent =`${data.errright}`;
        document.querySelector("#errright").style.margin ="0px";
        document.querySelector("#errright").style.color = "#363636";


        document.querySelector("#errleft").textContent =`${data.errleft}`;
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
        window.location.href = "tcfb_interaction_edu.html";
    });

    document.getElementById("overview-btn").addEventListener("click", function() {
        window.location.href = "tcfb_understand_edu.html";
        });
    
});
