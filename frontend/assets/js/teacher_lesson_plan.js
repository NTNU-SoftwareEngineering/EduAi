document.getElementById("submitButton").addEventListener("click", function () {
    const lessonPlanData = {
        name: document.getElementById("lesson-plan-name").value,
        author: document.getElementById("lesson-plan-author").value,
        target: document.getElementById("lesson-plan-target").value,
        time: document.getElementById("lesson-plan-time").value,
        motivation: document.getElementById("lesson-plan-motivation").value,
        place: document.getElementById("lesson-plan-place").value,
        coreValue: document.getElementById("lesson-plan-core_value").value,
        coreImportance: document.getElementById("lesson-plan-core_importance").value,
        source: document.getElementById("lesson-plan-source").value,
        facilities: document.getElementById("lesson-plan-facilities").value,
        goal: document.getElementById("lesson-plan-goal").value,
    };

    console.log(lessonPlanData); // 用來檢查資料是否正確

    // 發送 POST 請求到 Flask 服務
    fetch("http://localhost:5000/save_to_txt", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(lessonPlanData),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);  // 顯示成功訊息
    })
    .catch(error => {
        console.error("Error:", error);
        alert("儲存失敗，請稍後再試。");
    });
});
