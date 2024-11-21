/*
function fetchCourses() {
    const token = localStorage.getItem('token');
    if ( !token ) window.location.href = 'login.html';
    
    fetch('http://localhost:8080/moodle/webservice/rest/server.php', { //取得用戶資訊（userid）
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            wstoken: token,
            wsfunction: 'core_webservice_get_site_info',
            moodlewsrestformat: 'json'
        })
    })
    .then( response => response.json() )
    .then( (data) => {
        return fetch('http://localhost:8080/moodle/webservice/rest/server.php', { //取得該用戶註冊的課程列表
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                wstoken: token,
                wsfunction: 'core_enrol_get_users_courses',
                moodlewsrestformat: 'json',
                userid: data.userid
            })
        });
    })
    .then( response => response.json() )
    .then( data => {
        console.log("取得用戶註冊的課程列表");
        return data.map( j => j.fullname );
    })
    .then( courses => {
        // 更改 sourse-select 下拉選單的值
        const course_select_ele = document.getElementById('course-select');
        
        // 將靜態網頁預填的選項清空
        // course_select_ele.innerHTML = '<option value="" disabled selected>請選擇課程</option>';
        
        courses.forEach ( course => {
            const option = document.createElement('option');
            option.value = course;
            option.textContent = course;
            course_select_ele.appendChild(option);
        });
    })
    .catch( error => {
        console.error('錯誤:', error);
    });
}
document.addEventListener("DOMContentLoaded", fetchCourses);
*/

document.addEventListener("DOMContentLoaded", function() {

    var datas = {
        "資訊課": {
            
            basic:8,
            deep:7,
            inter:6,
            basicdescription: "學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。",
            deepdescription: "學生偶爾沒有聽清楚同學的意見或沒有回應同學的問題。",
            interdes:"學生與同學的交流良好，能夠分享自己的意見和與同學討論。",
            errleft:"內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內",
        },
        "輔導課": {
            
            basic:9,
            deep:3,
            inter:5,
            basicdescription: "學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。學生積極多與討論，多次發言分享自己的想法。",
            deepdescription: "學生偶爾沒有聽清楚同學的意見或沒有回應同學的問題。學生偶爾沒有聽清楚同學的意見或沒有回應同學的問題。學生偶爾沒有聽清楚同學的意見或沒有回應同學的問題。學生偶爾沒有聽清楚同學的意見或沒有回應同學的問題。學生偶爾沒有聽清楚同學的意見或沒有回應同學的問題。",
            interdes:"學生與同學的交流良好，能夠分享自己的意見和與同學討論。學生與同學的交流良好，能夠分享自己的意見和與同學討論。學生與同學的交流良好，能夠分享自己的意見和與同學討論。學生與同學的交流良好，能夠分享自己的意見和與同學討論。",
            errleft:"內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內",
        },
        
        
    };
    
    const courseSelect = document.getElementById("course-select");
    const selectedCourseName = document.getElementById("selected-course-name");

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
        window.location.href = "stufb_understand_edu.html";
    });

    document.getElementById("trend-btn").addEventListener("click", function() {
        window.location.href = "stufb_trend_edu.html";
        });
    
});