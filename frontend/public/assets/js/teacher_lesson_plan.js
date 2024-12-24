document.getElementById("submitButton").addEventListener("click", async () => {
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

    try {
        const response = await fetch("/api/lesson_plan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(lessonPlanData),
        });

        const result = await response.json();
        if (response.ok) {
            alert("教案儲存成功！");
        } else {
            alert(`儲存失敗: ${result.message}`);
        }
    } catch (error) {
        alert(`發生錯誤: ${error.message}`);
    }
});
