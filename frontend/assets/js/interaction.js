

document.addEventListener("DOMContentLoaded", function () {

    const mockData = {
        "資訊課": {
            respondtime: "25",
            avrdataPoints: 2,
            dataPoints: [1, 2, 1, 0, 4],
            labels: ["12/01", "12/02", "12/03", "12/08", "12/15"],
            alytext: "積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。",
            suggesttext: "建議多參與課後練習，鞏固學習成效。建議多參與課後練習，鞏固學習成效。建議多參與課後練習，鞏固學習成效。建議多參與課後練習，鞏固學習成效。建議多參與課後練習，鞏固學習成效。建議多參與課後練習，鞏固學習成效。建議多參與課後練習，鞏固學習成效。建議多參與課後練習，鞏固學習成效。建議多參與課後練習，鞏固學習成效。建議多參與課後練習，鞏固學習成效。"
        },
        "輔導課": {
            respondtime: "35",
            avrdataPoints: 2,
            dataPoints: [3, 2,6,8],
            labels: ["12/01", "12/02", "12/03","12/04"],
            alytext: "積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。積極參與課堂討論，理解能力良好。",
            suggesttext: "建議多參與課後練習，鞏固學習成效。建議多參與課後練習，鞏固學習成效。建議多參與課後練習，鞏固學習成效。建議多參與課後練習，鞏固學習成效。建議多參與課後練習，鞏固學習成效。建議多參與課後練習，鞏固學習成效。建議多參與課後練習，鞏固學習成效。建議多參與課後練習，鞏固學習成效。建議多參與課後練習，鞏固學習成效。建議多參與課後練習，鞏固學習成效。"
        }
    };
    createChart(0, mockData.資訊課)

    const courseSelect = document.querySelector(".course-select");
    const card1 = document.getElementById("card-1");
    const card2 = document.getElementById("card-2");
    const card3 = document.getElementById("card-3");
    const analysistext = document.getElementById("analysis-progress-text");

    const interactioncards= document.getElementById("interaction-cards-id");
    const aidefault = document.getElementById("ai-default");

    const selectedCourseName = document.getElementById("selected-course-name");
    const improvementtext = document.getElementById("improvement-suggestions-text");

    courseSelect.addEventListener("change", function () {
        const selectedCourse = courseSelect.value;

        console.log(selectedCourse)
        
        selectedCourseName.textContent = selectedCourse ? selectedCourse : "";
        

        if (mockData[selectedCourse]) {
            console.log(selectedCourseName.textContent)
            updateInfoCards(mockData[selectedCourse]);
            createChart(1,mockData[selectedCourse])
        } else {
            clearInteractionData();
        }
    });

    // console.log(selectedCourseName.textContent)


    function updateInfoCards(data) {

        // document.getElementById(".selected-course-name").textContent = "已選課程";
        document.getElementById("response-time").textContent = data.respondtime;
        document.getElementById("response-time").style.fontWeight = "bold";
        document.getElementById("response-time").style.fontSize = "34px";
        document.getElementById("response-time").style.color = "#000000";
        document.getElementById("response-time").style.margin = "1rem 0rem 0rem 1rem";
        document.getElementById("minute").textContent = "分鐘";
        document.getElementById("minute").style.color = "#000000";
        document.getElementById("minute").style.fontWeight = "bold";


        document.getElementById("average-frequency").textContent = `${data.avrdataPoints}次`;
        document.getElementById("analysis-progress-text").textContent = data.alytext;
        document.getElementById("improvement-suggestions-text").textContent = data.suggesttext;
        card1.style.display = "block";
        card2.style.display = "block";
        card3.style.display = "block";


        interactioncards.style.border = "#ffffff";
        
        aidefault.style.display = "none";
        analysistext.style.marginTop="1rem";
        analysistext.style.color = "#000000";
        analysistext.style.fontWeight = "normal";


        improvementtext.style.marginTop="1rem";
        improvementtext.style.color = "#000000";

        // if (data.dataPoints && data.labels) {
        //     drawInteractionChart(data.dataPoints, data.labels);
        // } else {
        //     clearInteractionChart();
        //     console.warn("dataPoints or labels data is missing or mismatched.");
        // }
    }

    function clearInteractionData() {
        document.getElementById("selected-course-name").textContent = "";
        document.getElementById("response-time").textContent = "暫無資料";
        document.getElementById("average-frequency").textContent = "";
        document.getElementById("analysis-progress-text").textContent = "暫無資料";
        document.getElementById("improvement-suggestions-text").textContent = "暫無資料";
        // clearInteractionChart();
    }


    // Initialize with no data
    clearInteractionData();
});



document.getElementById("overview-btn").addEventListener("click", function() {
    window.location.href = "overview_edu.html";
});

document.getElementById("trend-btn").addEventListener("click", function() {
    window.location.href = "trend_edu.html";
});

function createChart(flag, data) {

    d3.select("#lineChart").select("svg").remove();
    // 設定圖表的尺寸
    const width = 400;
    const height = 80;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    // 建立 SVG
    const svg = d3.select("#lineChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 設定 x 軸和 y 軸的比例尺
    const x = d3.scalePoint()
        .domain(data.labels)
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data.dataPoints) + 1])
        .range([height, 0]);

    // 添加水平實線作為多個X軸
    svg.selectAll(".grid-line")
        .data(y.ticks(3))
        .enter()
        .append("line")
        .attr("class", "grid-line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", d => y(d))
        .attr("y2", d => y(d))
        .attr("stroke", "#e0e0e0");  // 設定實線顏色

    // 設定 x 軸
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(3).tickSizeOuter(0))
        .call(g => g.selectAll(".tick text")
            .attr("fill", "#8E8E93")   // 設定 X 軸文字顏色
            .attr("font-size", "1.3rem") // 設定 X 軸文字大小
        )
        .call(g => g.selectAll(".domain").attr("stroke", "#e0e0e0"))   // 設定 X 軸線顏色
        .call(g => g.selectAll(".tick line").attr("opacity", 0));

    // 設定 y 軸
    svg.append("g")
        .call(d3.axisLeft(y).ticks(3))
        .call(g => g.selectAll(".tick text")
            .attr("fill", "#8E8E93")   // 設定 Y 軸文字顏色
            .attr("font-size", "1.3rem") // 設定 Y 軸文字大小
        )
        .call(g => g.selectAll(".domain").attr("stroke", "#e0e0e0"))   // 設定 Y 軸線顏色
        .call(g => g.selectAll(".domain").attr("display", "none"))
        .call(g => g.selectAll(".tick line").attr("opacity", 0));

    // 定義漸層
    const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "line-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#ffcc80") // 更淺的橙色
        .attr("stop-opacity", 0.4);

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#ffcc80")
        .attr("stop-opacity", 0);

    if(flag == 1){

        // 建立折線
        const line = d3.line()
            .x((d, i) => x(data.labels[i]))
            .y(d => y(d))
            .curve(d3.curveMonotoneX);

        svg.append("path")
            .datum(data.dataPoints)
            .attr("fill", "none")
            .attr("stroke", "#f5a623")  // 淺橙色的折線
            .attr("stroke-width", 2)
            .attr("d", line);

        // 建立區域填充
        const area = d3.area()
            .x((d, i) => x(data.labels[i]))
            .y0(y(0))
            .y1(d => y(d))
            .curve(d3.curveMonotoneX);

        svg.append("path")
            .datum(data.dataPoints)
            .attr("fill", "url(#line-gradient)")
            .attr("d", area);
    }
        
}

