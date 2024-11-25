
document.addEventListener("DOMContentLoaded", function() {
    
    var datas = {
        "資訊課": {
            "王小明": {
                basic: 8,
                deep: 7,
                inter: 6,
                basicdescription: "學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。",
                deepdescription: "學生偶爾沒有聽清楚同學的意見或沒有回應同學的問題。",
                interdes: "學生與同學的交流良好，能夠分享自己的意見和與同學討論。",
                errleft: "內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內"
            },
            "張小強": {
                basic: 6,
                deep: 4,
                inter: 7,
                basicdescription: "張小強在輔導課中積極參與，能夠提出見解並與同學討論。",
                deepdescription: "偶爾在小組討論中表現出理解的不足。",
                interdes: "與同學的交流良好，積極參與並能傾聽他人的意見。",
                errleft: "內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內"
            },
            "李小華": {
                basic: 7,
                deep: 6,
                inter: 5,
                basicdescription: "李小華積極參與討論，能提出一些見解。",
                deepdescription: "在與同學討論中，有時未能聽清或回應對方。",
                interdes: "與同學的互動良好，能夠參與討論並分享意見。",
                errleft: "內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內"
            }
        },
        "輔導課": {
            "王小明": {
                basic: 9,
                deep: 3,
                inter: 5,
                basicdescription: "學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。",
                deepdescription: "學生偶爾沒有聽清楚同學的意見或沒有回應同學的問題。",
                interdes: "學生與同學的交流良好，能夠分享自己的意見和與同學討論。",
                errleft: "內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內"
            },
            "張小強": {
                basic: 6,
                deep: 4,
                inter: 7,
                basicdescription: "張小強在輔導課中積極參與，能夠提出見解並與同學討論。",
                deepdescription: "偶爾在小組討論中表現出理解的不足。",
                interdes: "與同學的交流良好，積極參與並能傾聽他人的意見。",
                errleft: "內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內"
            },
            "李小華": {
                basic: 7,
                deep: 6,
                inter: 5,
                basicdescription: "李小華積極參與討論，能提出一些見解。",
                deepdescription: "在與同學討論中，有時未能聽清或回應對方。",
                interdes: "與同學的互動良好，能夠參與討論並分享意見。",
                errleft: "內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內"
            }
        }
    };
    
    
    const courseSelect = document.getElementById("course-select");
    const selectedStuName = document.getElementById("selected-student-name");

    const selectedCourseName = document.getElementById("selected-course-name");

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
   
        document.querySelector("#deep-id").textContent = `${data.deep}/10`;
        document.querySelector("#basic-id").textContent = `${data.basic}/10`;
        document.querySelector("#inter-id").textContent = `${data.inter}/10`;

        document.querySelector("#deep-ids").textContent = `${data.deep}/10`;
        document.querySelector("#basic-ids").textContent = `${data.basic}/10`;
        document.querySelector("#inter-ids").textContent = `${data.inter}/10`;

        document.querySelector("#basic-des").textContent =`${data.basicdescription}`;
        document.querySelector("#basic-des").style.margin ="0px";
        document.querySelector("#basic-des").style.color = "#363636";


        document.querySelector("#deep-des").textContent =`${data.deepdescription}`;
        document.querySelector("#deep-des").style.margin ="0px";
        document.querySelector("#deep-des").style.color = "#363636";

        document.querySelector("#inter-des").textContent =`${data.interdes}`;
        document.querySelector("#inter-des").style.margin ="0px";
        document.querySelector("#inter-des").style.color = "#363636";

        document.querySelector("#errleft").textContent =`${data.errleft}`;
        document.querySelector("#errleft").style.margin ="0px";
        document.querySelector("#errleft").style.color = "#363636";
    
    }

    // 設定按鈕切換頁面
    document.getElementById("overview-btn").addEventListener("click", function() {
        window.location.href = "tcfb_understand_edu.html";
    });

    document.getElementById("trend-btn").addEventListener("click", function() {
        window.location.href = "tcfb_trend_edu.html";
        });
    
});
