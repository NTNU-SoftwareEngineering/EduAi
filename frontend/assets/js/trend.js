
const mockData = {
    "資訊課": {
        responseTimeData: [31, 12, 45, 25, 15],
        responseTimeLabels: ["12/01", "12/02", "12/03", "12/08", "12/15"],
        learningStatusData:[50, 30, 85, 35, 100],
        learningStatusLabels : ['12/01', '12/08', '12/15', '12/23', '12/30'],
        timegap:25
    },
    "輔導課": {
        responseTimeData: [13, 20, 25, 8, 45],
        responseTimeLabels: ["12/01", "12/02", "12/03","12/04","12/25"],
        learningStatusData:[60, 40, 95, 65, 100],
        learningStatusLabels : ['12/01', '12/08', '12/15', '12/23', '12/30'],
        timegap:30
    }
};

const courseSelect = document.querySelector(".course-select");
const selectedCourseName = document.getElementById("selected-course-name");


courseSelect.addEventListener("change", function () {
    const selectedCourse = courseSelect.value;

    // console.log(selectedCourse)
    


    if (mockData[selectedCourse]) {
        console.log(selectedCourse);
        console.log(mockData[selectedCourse].responseTimeData);
        selectedCourseName.textContent = selectedCourse ? selectedCourse : "";
        document.getElementById("percentage-id").style.visibility = "visible"; 
        document.getElementById("average-frequency").textContent = `${mockData[selectedCourse].timegap}分鐘`;
        document.getElementById("content-A").textContent = "內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文文內文內文內文內文內文內文內文內文內文內內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文文內文內文內文內文內文內文內文內文內文內內文內文內文";
        document.getElementById("content-A").style.margin="0px"
        document.getElementById("content-A").style.color="#363636"
        document.getElementById("content-B").textContent = "內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文文內文內文內文內文內文內文內文內文內文內內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文內文文內文內文內文內文內文內文內文內文內文內內文內文內文";
        document.getElementById("content-B").style.margin="0px"
        document.getElementById("content-B").style.color="#363636"


        // 1. 先移除現有的圖表 SVG 元素
        d3.select("#responseTimeChart").select("svg").remove();
        d3.select("#learningStatusChart").select("svg").remove();

        // 2. 繪製新的圖表
        drawLineChart(
            1,
            mockData[selectedCourse].responseTimeData,
            mockData[selectedCourse].responseTimeLabels,
            "#responseTimeChart"
        );
        drawLineChart(
            1,
            mockData[selectedCourse].learningStatusData,
            mockData[selectedCourse].learningStatusLabels,
            "#learningStatusChart"
        );
    } else {
        console.warn("未找到課程數據：", selectedCourse);
    }
});


// 繪製折線圖的通用函數
function drawLineChart(flag, data, labels, containerId) {

    const width = 550;
    const height = 90;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };


    const svg = d3.select(containerId)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 定義 x 和 y 比例尺
    const x = d3.scalePoint()
        .domain(labels)
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data) + 10])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y).ticks(3).tickSize(-width).tickPadding(5))
        .call(g => g.select(".domain").remove()) // 移除 y 軸主線
        .call(g => g.selectAll(".tick line").attr("stroke", "#e0e0e0")) // y 軸網格線顏色
        .call(g => g.selectAll(".tick text")
            .attr("fill", "#8E8E93")            // 設定 Y 軸文字顏色為綠色
            .attr("font-size", "1.3rem")) 

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
        .attr("stop-color", "orange")
        .attr("stop-opacity", 0.4);
    
    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "orange")
        .attr("stop-opacity", 0);


        if(flag==1)
        {
             // 繪製折線
             const line = d3.line()
             .x((d, i) => x(labels[i]))
             .y(d => y(d))
             .curve(d3.curveMonotoneX);

         svg.append("path")
             .datum(data)
             .attr("fill", "none")
             .attr("stroke", "#f5a623")
             .attr("stroke-width", 2)
             .attr("d", line);

         // 繪製填充區域
         const area = d3.area()
             .x((d, i) => x(labels[i]))
             .y0(height)
             .y1(d => y(d))
             .curve(d3.curveMonotoneX);

         svg.append("path")
             .datum(data)
             .attr("fill", "url(#line-gradient)")
             .attr("d", area);

        }
           
    // 添加 x 軸和 y 軸
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(0))
        .call(g => g.selectAll(".tick text")
            .attr("fill", "#8E8E93")   // 設定 X 軸文字顏色
            .attr("font-size", "1.3rem") // 設定 X 軸文字大小
            .attr("transform", "translate(0,10)")
        )
        .call(g => g.selectAll(".domain").attr("stroke", "#e0e0e0"))   // 設定 X 軸線顏色
        .call(g => g.selectAll(".tick line").attr("opacity", 0));

    
   

        
}


document.getElementById("overview-btn").addEventListener("click", function() {
    window.location.href = "overview_edu.html";
});

document.getElementById("interaction-btn").addEventListener("click", function() {
    window.location.href = "interaction_edu.html";
});

d3.select("#responseTimeChart").select("svg").remove();
d3.select("#learningStatusChart").select("svg").remove();



document.addEventListener("DOMContentLoaded", function () {
    drawLineChart(
        0,
        [31, 12, 45, 25, 15],
        ["12/01", "12/02", "12/03", "12/08", "12/15"],
        "#responseTimeChart"
    );
    drawLineChart(
        0,
        [50, 30, 85, 35, 100],
        ['12/01', '12/08', '12/15', '12/23', '12/30'],
        "#learningStatusChart"
    );

})