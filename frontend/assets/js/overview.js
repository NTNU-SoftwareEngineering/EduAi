
document.addEventListener("DOMContentLoaded", function() {
    // drawRadarChart()
    var datas = {
        "資訊課": {
            fieldNames: ['理解度', '參與度', '積極度'],
            values: [
                [78, 82, 50]
            ],
            理解度評語: "在課程中展現出良好的理解能力，能夠掌握大部分的課程要點。",
            參與度評語: "積極參與課堂討論與活動，展現出高度的學習興趣。",
            積極度評語: "偶爾主動提出問題或協助他人，有待加強主動性。"
        },
        "輔導課": {
            fieldNames: ['理解度', '參與度', '積極度'],
            values: [
                [90, 70, 65]
            ],
            理解度評語: "在課堂上表現出卓越的理解能力，能夠深入理解課程內容。",
            參與度評語: "雖然參與度高，但有時表現出被動接受的狀態。",
            積極度評語: "主動性較強，能夠自主解決問題並協助同學。"
        }
        
    };
    
    drawRadarChart(0,'.chart-section', datas, "資訊課");
    
    const courseSelect = document.getElementById("course-select");
    const selectedCourseName = document.getElementById("selected-course-name");
    const understandingdiv = document.getElementById("understanding-score");
    const engagementdiv = document.getElementById("engagement-score");
    const positivediv = document.getElementById("positive-score");
    const a = courseSelect.value;

    courseSelect.addEventListener("change", function() {
        const selectedCourse = courseSelect.value;
        // console.log("selectedCourse",selectedCourse)
        drawRadarChart( 1, '.chart-section', datas, selectedCourse);

        selectedCourseName.textContent = selectedCourse ? selectedCourse : "";
        if (selectedCourse && datas[selectedCourse]) {
            const data = datas[selectedCourse];
            // console.log("data:",data)
            // console.log("理解度:",data.理解度評語)
            updateInfoCards(data);
        } else {
            // console.log("data:",data);
            drawRadarChart();
            clearInfoCards();
        }
       
    });

    // function clearChart() {
    //     d3.select("#radarChart").selectAll("*").remove();
    // }

    function clearInfoCards() {
        document.querySelector("#understanding-value").textContent = "";
        document.querySelector("#engagement-value").textContent = "";
        document.querySelector("#positive-value").textContent = "";
        document.querySelector("#understanding-comment").textContent = "";
        document.querySelector("#engagement-comment").textContent = "";
        document.querySelector("#positive-comment").textContent = "";

        understandingdiv.style.display = "none";
        engagementdiv.style.display = "none";
        positivediv.style.display = "none";
    }

    function updateInfoCards(data) {
        document.querySelector("#understanding-score").textContent = `${data.values[0][0]}%`;
        document.querySelector("#engagement-score").textContent = `${data.values[0][1]}%`;
        document.querySelector("#positive-score").textContent = `${data.values[0][2]}%`;

        document.querySelector("#understanding-value").style.fontWeight = "normal";
        document.querySelector("#understanding-value").style.color = "#000000";
        document.querySelector("#understanding-value").textContent = data.理解度評語;

        document.querySelector("#engagement-value").textContent = data.參與度評語;
        document.querySelector("#engagement-value").style.fontWeight = "normal";
        document.querySelector("#engagement-value").style.color = "#000000";

        document.querySelector("#positive-value").textContent = data.積極度評語;
        document.querySelector("#positive-value").style.fontWeight = "normal";
        document.querySelector("#positive-value").style.color = "#000000";

        understandingdiv.style.display = "block";
        engagementdiv.style.display = "block";
        positivediv.style.display = "block";
    
    }


    function drawRadarChart(flag, container, data, classname, options = {}) {
    // 設定預設選項，讓使用者可以自訂圖表參數
    const config = {
        width: options.width || 600,
        height: options.height || 300,
        radius: options.radius || 125,
        levels: options.levels || 3,
        fillColor: options.fillColor || '#ffa726',
        strokeColor: options.strokeColor || '#e8e8f3',
        textColor: options.textColor || '#333',
        fontSize: options.fontSize || '14px',
        valueColors: options.valueColors || ['#8665cd', '#f9b042', '#0dbd09']
    };

    // 清空容器並初始化主SVG元素
    d3.select(container).select('svg').remove();
    const svg = d3.select(container).append('svg')
        .attr('width', config.width)
        .attr('height', config.height);

    const main = svg.append('g')
        .classed('main', true)
        .attr('transform', `translate(${config.width / 2.2},${config.height /2.4})`);

    // 取得指定課程名稱的資料
    const fieldNames = data[classname].fieldNames;
    const values = data[classname].values;

    // 計算常量
    const total = fieldNames.length;
    const rangeMin = 0;
    const rangeMax = 100;
    const arc = 2 * Math.PI;
    const onePiece = arc / total;

    // 畫同心圓的網格
    const circles = main.append('g').classed('circles', true);
    for (let k = 1; k <= config.levels; k++) {
        circles.append('circle')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', (config.radius / config.levels) * k)
            .attr('fill', 'none')
            .attr('stroke', config.strokeColor);
    }

    // 畫從中心到每個指標的線
    const lines = main.append('g').classed('lines', true);
    for (let i = 0; i < total; i++) {
        const x = config.radius * Math.sin(i * onePiece);
        const y = config.radius * Math.cos(i * onePiece);
        lines.append('line')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', x)
            .attr('y2', y)
            .attr('stroke', config.strokeColor);
    }

    // 計算雷達圖表的座標
    const areasData = values.map(value => {
        return value.map((val, k) => {
            const r = config.radius * (val - rangeMin) / (rangeMax - rangeMin);
            const x = r * Math.sin(k * onePiece);
            const y = r * Math.cos(k * onePiece);
            return { x, y };
        });
    });

    // 繪製雷達圖區域
    const areas = main.append('g').classed('areas', true);

    if(flag == 1 ){
        areasData.forEach(areaData => {
            const line = d3.line()
                .x(d => d.x)
                .y(d => d.y);
    
            areas.append('path')
                .attr('d', line(areaData) + 'Z')
                .attr('fill', config.fillColor)
                .attr('fill-opacity', 0.2);
            
            areas.selectAll('.circles')
                .data(areaData)
                .enter()
                .append('circle')
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .attr('r', 4)
                .attr('fill', config.fillColor);
        });
    }
    

    // 標示每個指標的文字標籤
    const textRadius = config.radius + 25;
    const textPoints = fieldNames.map((fieldName, i) => {
        const x = textRadius * Math.sin(i * onePiece);
        const y = textRadius * Math.cos(i * onePiece);
        return { x, y, name: fieldName, value: `${values[0][i]}%`, color: config.valueColors[i] };
    });

    const texts = main.append('g').classed('texts', true);

    texts.selectAll('text')
        .data(textPoints)
        .enter()
        .append('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('font-size', config.fontSize)
        .attr('font-weight', 'bold')
        .attr('fill', config.textColor)
        .attr('text-anchor', 'middle')
        .each(function(d) {
            d3.select(this).append('tspan')
                .attr('x', d.x)
                .attr('dy', 0)
                .text(d.name)
                .attr('fill', config.textColor);

            if(flag==1)
            {
                d3.select(this).append('tspan')
                .attr('x', d.x)
                .attr('dy', 20) // 確保每個值顯示在正確位置
                .text(d.value)
                .attr('fill', d.color);
            }
            
        });
        
        
}

    // 設定按鈕切換頁面
    document.getElementById("interaction-btn").addEventListener("click", function() {
        window.location.href = "interaction_edu.html";
    });

    document.getElementById("trend-btn").addEventListener("click", function() {
        window.location.href = "trend_edu.html";
        });
    
        
        
    
});
