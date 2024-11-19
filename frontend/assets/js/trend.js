
document.addEventListener("DOMContentLoaded", function() {
    var datas = {
        "資訊課": {
            
            basic:6,
            deep:4,
            errleft:"根據過往的紀錄，學生的理解程度與互動風格持續穩步進步，特別是在參與度和交流度方面表現突出。",
            errright:"學生可以繼續加強對幸福感相關理論的學習，培養批判性思考和自我分析的能力。同時，學生也可以嘗試運用幸福感的概念解決實際問題，例如設計幸福感相關的活動或研究項目。"
        },
        "輔導課": {
            
            basic:9,
            deep:3,
            errleft:"根據過往的紀錄，學生的理解程度與互動風格持續穩步進步，特別是在參與度和交流度方面表現突出。根據過往的紀錄，學生的理解程度與互動風格持續穩步進步，特別是在參與度和交流度方面表現突出。根據過往的紀錄，學生的理解程度與互動風格持續穩步進步，特別是在參與度和交流度方面表現突出。",
            errright:"學生可以繼續加強對幸福感相關理論的學習，培養批判性思考和自我分析的能力。同時，學生也可以嘗試運用幸福感的概念解決實際問題，例如設計幸福感相關的活動或研究項目。學生可以繼續加強對幸福感相關理論的學習，培養批判性思考和自我分析的能力。同時，學生也可以嘗試運用幸福感的概念解決實際問題，例如設計幸福感相關的活動或研究項目。"
        },
        
        
    };
    
    const courseSelect = document.getElementById("course-select");
    const selectedCourseName = document.getElementById("selected-course-name");

    const card1 = document.getElementById("card-1");
    const card2 = document.getElementById("card-2");
    const card3 = document.getElementById("card-3");

    const interactioncards= document.getElementById("interaction-cards-id");
    const aidefault = document.getElementById("ai-default");




    courseSelect.addEventListener("change", function() {
        const selectedCourse = courseSelect.value;
        // console.log("selectedCourse",selectedCourse)
        selectedCourseName.textContent = selectedCourse ? selectedCourse : "";
        if (selectedCourse && datas[selectedCourse]) {
            const data = datas[selectedCourse];
            // console.log("data:",data)
            // console.log("理解度:",data.理解度評語)
            updateInfoCards(data);
        } else {
            // console.log("data:",data);
            
        }
       
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
        window.location.href = "stufb_interaction_edu.html";
    });

    document.getElementById("overview-btn").addEventListener("click", function() {
        window.location.href = "stufb_understand_edu.html";
    });
    
});