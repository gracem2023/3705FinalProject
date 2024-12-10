//Scatterplot Graphs
var width = 500;
var height = 500;

var width2 = 700;
var svg = d3.select('svg');

var padding = { t: 60, r: 40, b: 30, l: 120 };

var scatterChartWidth = width2 - padding.l - padding.r;
var scatterChartHeight = height - padding.t - padding.b;

//Questionnaire Data
d3.csv("quest.csv", function (csv) {
    csv.forEach(d => {
        d.ids = String(d.ID);
        d.timeToComplete = +d.timeToComplete;
        d.percentComplete = +d.percentComplete;
        d.numQuestions = +d.numQuestions;
        d.percentAccepted = +d.percentAccepted;
        d.usedAI = String(d.usedAI);
    });

    console.log(csv);

    const percentCompleteExtent = d3.extent(csv, d => d.percentComplete);
    const percentAcceptedExtent = d3.extent(csv, d => d.percentAccepted);

    //Scales
    const xScale = d3.scaleLinear()
        .domain(percentCompleteExtent)
        .range([padding.l, scatterChartWidth]);

    const yScale = d3.scaleLinear()
        .domain(percentAcceptedExtent)
        .range([scatterChartHeight, padding.t]);

    //Scatterplot
    const chart1 = d3.select("#chart1")
        .append("svg")
        .attr("id", "svg1")
        .attr("width", width2)
        .attr("height", height);

    //Axes
    chart1.append("g")
        .attr("transform", `translate(0, ${scatterChartHeight})`)
        .call(d3.axisBottom(xScale));

    chart1.append("g")
        .attr("transform", `translate(${padding.l}, 0)`)
        .call(d3.axisLeft(yScale));

    //Labels
    chart1.append("text")
        .attr("x", scatterChartWidth / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Percent Complete");

    chart1.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -scatterChartHeight / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Percent of AI Answers Accepted");

    //Scatterplot Points
    var circles1 = chart1.selectAll("circle")
        .data(csv)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.percentComplete))
        .attr("cy", d => yScale(d.percentAccepted))
        .attr("r", 5)
        .attr("fill", d => (d.usedAI === "Yes" ? "purple" : "black"))
        .attr("opacity", 0.8)
        .attr("stroke", "white")
        .attr("stroke-width", 1);

    //Title
    chart1.append("text")
        .attr("x", scatterChartWidth / 2)
        .attr("y", padding.t - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .style("color", "white")
        .text("Percent Questionnaire Was Completed vs. AI Answers Accepted");

    //Legend
    d3.select("#UsedAI")
        .append("circle")
        .attr("cx", 10)
        .attr("cy", 10)
        .attr("r", 8)
        .attr("fill", "purple");

    d3.select("#DidNotUseAI")
        .append("circle")
        .attr("cx", 10)
        .attr("cy", 10)
        .attr("r", 8)
        .attr("fill", "black");

    //Scatterplot
    const xScale2 = d3.scaleLinear()
        .domain(d3.extent(csv, d => d.percentAccepted))
        .range([50, 470]);

    const yScale2 = d3.scaleLinear()
        .domain(d3.extent(csv, d => d.timeToComplete))
        .range([470, 30]);

    const chart2 = d3
        .select("#chart2")
        .append("svg:svg")
        .attr("id", "svg2")
        .attr("width", width)
        .attr("height", height);

    chart2.append("g")
        .attr("transform", "translate(0," + (width - 30) + ")")
        .call(d3.axisBottom(xScale2));

    chart2.append("g")
        .attr("transform", "translate(50, 0)")
        .call(d3.axisLeft(yScale2));

    chart2.append("text")
        .attr("x", width / 2)
        .attr("y", height)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("% of AI Answers Accepted");

    chart2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Time Spent on Questionnaire");

    //Title
    chart2.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Complete Time vs. Percent of AI Responses Accepted");

    var circles2 = chart2.selectAll("circle")
        .data(csv)
        .enter()
        .append("circle")
        .attr("cx", d => xScale2(d.percentAccepted))
        .attr("cy", d => yScale2(d.timeToComplete))
        .attr("r", 5)
        .attr("stroke", "black")
        .attr("fill", d => (d.usedAI === "Yes" ? "purple" : "black"))

    //Brushes
    var scatterBrush1 = d3.brush()
        .extent([[50, 30], [scatterChartWidth, scatterChartHeight]])
        .on("start", brushstartScatter1)
        .on("brush", highlightBrushedScatter2)
        .on("end", displayValuesScatter);

    var scatterBrush2 = d3.brush()
        .extent([[50, 30], [470, 470]])
        .on("start", brushstartScatter2)
        .on("brush", highlightBrushedScatter1)
        .on("end", displayValuesScatter);

    chart1.append("g")
        .attr("class", "brush scatter-brush1")
        .call(scatterBrush1);

    chart2.append("g")
        .attr("class", "brush scatter-brush2")
        .call(scatterBrush2);

    function brushstartScatter1() {
        d3.select(".scatter-brush2").call(scatterBrush2.move, null);
        circles2.attr("class", "non_brushed");
        circles1.attr("class", "non_brushed");
    }

    function brushstartScatter2() {
        d3.select(".scatter-brush1").call(scatterBrush1.move, null);
        circles2.attr("class", "non_brushed");
        circles1.attr("class", "non_brushed");
    }

    //Highlight points in scatterplot 2
    function highlightBrushedScatter2() {
        var coords = d3.brushSelection(this);
        if (coords) {
            circles1.attr("class", "non_brushed");
            circles2.attr("class", "non_brushed");

            var selected = circles1.filter(function (d) {
                var cx = +d3.select(this).attr("cx");
                var cy = +d3.select(this).attr("cy");
                return coords[0][0] <= cx && cx <= coords[1][0] && coords[0][1] <= cy && cy <= coords[1][1];
            }).attr("class", function (d) {
                if (d.usedAI === "No") return "no-AI";
                else return "AI";
            });

            circles2.filter(function (d) {
                return selected.data().some(function (brushedData) {
                    return brushedData.ids === d.ids;
                });
            }).attr("class", function (d) {
                if (d.usedAI === "No") return "no-AI";
                else return "AI";
            });
        }
    }

    // Highlight points in scatterplot 1
    function highlightBrushedScatter1() {
        var coords = d3.brushSelection(this);
        if (coords) {
            circles1.attr("class", "non_brushed");
            circles2.attr("class", "non_brushed");

            var selected = circles2.filter(function (d) {
                var cx = +d3.select(this).attr("cx");
                var cy = +d3.select(this).attr("cy");
                return coords[0][0] <= cx && cx <= coords[1][0] && coords[0][1] <= cy && cy <= coords[1][1];
            }).attr("class", function (d) {
                if (d.usedAI === "No") return "no-AI";
                else return "AI";
            });
            
            circles1.filter(function (d) {
                return selected.data().some(function (brushedData) {
                    return brushedData.ids === d.ids;
                });
            }).attr("class", function (d) {
                if (d.usedAI === "No") return "no-AI";
                else return "AI";
            });
        }
    }

    function displayValuesScatter() {
        if (!d3.event.selection) {
            circles1.attr("class", function (d) {
                if (d.usedAI === "No") return "no-AI";
                else return "AI";
            });
            circles2.attr("class", function (d) {
                if (d.usedAI === "No") return "no-AI";
                else return "AI";
            });
        }
    }

    function getBrushData(selected) {
        console.log(selected.size());
        clearValues();
        if (selected.size() === 1) {
            populateValues(selected.data()[0]);
        } else {
            clearValues();
        }
    }


    //clear function
    function clearValues() {
        d3.select("#cereal-input").text("");
        d3.select("#calories-input").text("");
        d3.select("#fat-input").text("");
        d3.select("#carb-input").text("");
        d3.select("#fiber-input").text("");
        d3.select("#protein-input").text("");
    }

    //populate data
    function populateValues(data) {
        d3.select("#cereal-input").text(data.CerealName);
        d3.select("#calories-input").text(data.Calories);
        d3.select("#fat-input").text(data.Fat);
        d3.select("#carb-input").text(data.Carb);
        d3.select("#fiber-input").text(data.Fiber);
        d3.select("#protein-input").text(data.Protein);
    }

});

//Deployed Questionnaire Data
//Line graph
d3.csv("depQuest.csv", function(data) {
    data.forEach(d => {
        d.Timestamp = new Date(d.Timestamp);
        for (let key in d) {
            if (key !== "Timestamp" && key !== "Total") d[key] = +d[key] || 0;
        }
    });

    const locationColumns = ["UnitedStates", "Turkey", "India", "SouthAfrica", "Spain"];
    const industryColumns = ["Marketing", "Healthcare", "CloudManagement", "Operations", "Energy", "Ecommerce"];

    locationColumns.forEach(location => {
        d3.select("#locationFilter")
            .append("option")
            .attr("value", location)
            .text(location);
    });

    industryColumns.forEach(industry => {
        d3.select("#industryFilter")
            .append("option")
            .attr("value", industry)
            .text(industry);
    });

    //Filter Data
    function filterAndAggregateData(selectedLocation, selectedIndustry) {
        return d3.nest()
            .key(d => d.Timestamp)
            .rollup(values => {
                return d3.sum(values, d => {
                    let locationValue = selectedLocation === "All" ? 0 : d[selectedLocation];
                    let industryValue = selectedIndustry === "All" ? 0 : d[selectedIndustry];
                    return locationValue + industryValue || d.Total; // Fallback to Total if no filters are applied
                });
            })
            .entries(data)
            .map(d => ({
                Timestamp: new Date(d.key),
                TotalUserCount: d.value,
            }));
    }

    let aggregatedData = filterAndAggregateData("All", "All");

    var lineChartWidth = 800;
    var lineChartHeight = 400;
    var margin = { top: 50, right: 30, bottom: 50, left: 50 };

    var svg3 = d3.select("#line-chart")
        .append("svg")
        .attr("width", lineChartWidth + margin.left + margin.right)
        .attr("height", lineChartHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    //Scales
    var xScale = d3.scaleTime()
        .domain(d3.extent(aggregatedData, d => d.Timestamp))
        .range([0, lineChartWidth]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(aggregatedData, d => d.TotalUserCount)])
        .range([lineChartHeight, 0]);

    //Axes
    var xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b %d, %Y"));
    var yAxis = d3.axisLeft(yScale);

    svg3.append("g")
        .attr("transform", `translate(0,${lineChartHeight})`)
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-45)");

    svg3.append("g").call(yAxis);

    //Labels
    svg3.append("text")
        .attr("x", lineChartWidth / 2)
        .attr("y", lineChartHeight + margin.bottom - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Time");

    svg3.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -lineChartHeight / 2)
        .attr("y", -margin.left + 10)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Total Questionnaires Deployed");

    svg3.append("text")
        .attr("x", (lineChartWidth + margin.left + margin.right) / 2) 
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Total Questionnaires Deployed December 2023-2024");

    var line = d3.line()
        .x(d => xScale(d.Timestamp))
        .y(d => yScale(d.TotalUserCount));

    //annotation
    var path = svg3.append("path")
    .datum(aggregatedData)
    .attr("fill", "none")
    .attr("stroke-width", 2)
    .attr("stroke", "steelblue")
    .attr("d", line);
    const annotationDate = new Date('2024-04-01');

    svg3.append("line")
        .attr("x1", xScale(annotationDate))
        .attr("x2", xScale(annotationDate))
        .attr("y1", 0)
        .attr("y2", lineChartHeight)
        .attr("stroke", "purple")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,4");

    svg3.append("text")
        .attr("x", xScale(annotationDate) + 5)
        .attr("y", 20)
        .attr("text-anchor", "start")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", "purple")
        .text("AI Beta tool released");


    //Update chart on filter
    function updateChart() {
        const selectedLocation = d3.select("#locationFilter").property("value");
        const selectedIndustry = d3.select("#industryFilter").property("value");
        aggregatedData = filterAndAggregateData(selectedLocation, selectedIndustry);

        xScale.domain(d3.extent(aggregatedData, d => d.Timestamp));
        yScale.domain([0, d3.max(aggregatedData, d => d.TotalUserCount)]);

        path.datum(aggregatedData)
            .transition()
            .duration(500)
            .attr("d", line);

        svg3.select(".x-axis").call(xAxis);
        svg3.select(".y-axis").call(yAxis);
    }

    d3.select("#locationFilter").on("change", updateChart);
    d3.select("#industryFilter").on("change", updateChart);
});

//Bubble Charts
d3.csv("survey.csv", function(data) {
    data.forEach(d => {
        d.numQuestions = +d.numQuestions; 
        d.percentComplete = +d.percentComplete; 
        d.usedAI = d.usedAI.trim() === "Yes" ? "AI" : "NoAI"; 
    });
    console.log(data);

    //clone
    const dataMixed = data.map(d => ({ ...d })); 
    const dataSplit = data.map(d => ({ ...d })); 

    //chart1
    const bubbleWidth = 800;
    const bubbleHeight = 600;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    const svgBubble = d3.select("#bubbleChart")
        .append("svg")
        .attr("width", bubbleWidth + margin.left + margin.right)
        .attr("height", bubbleHeight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const sizeScale = d3.scaleSqrt()
        .domain(d3.extent(dataMixed, d => d.numQuestions))
        .range([3, 30]);

    const simulation = d3.forceSimulation(dataMixed)
        .force("x", d3.forceX(bubbleWidth / 2).strength(0.05))
        .force("y", d3.forceY(bubbleHeight / 2).strength(0.05))
        .force("collide", d3.forceCollide(d => sizeScale(d.numQuestions) + 2))
        .on("tick", function () {
            bubbles
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        });

    const bubbles = svgBubble.selectAll(".bubble")
        .data(dataMixed)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("r", d => sizeScale(d.numQuestions))
        .attr("fill", d => (d.usedAI === "AI" ? "purple" : "black"))
        .attr("fill-opacity", d => d.percentComplete / 100)
        .attr("stroke", d => (d.usedAI === "AI" ? "purple" : "black"))
        .attr("stroke-width", 1.5);

    function ticked() {
        bubbles
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }

    //chart2
    const bubbleWidth2 = 900;
    const bubbleHeight2 = 600;
    const margin2 = { top: 50, right: 50, bottom: 50, left: 50 };

    const svgBubble2 = d3.select("#bubbleChart2")
        .append("svg")
        .attr("width", bubbleWidth2 + margin2.left + margin2.right)
        .attr("height", bubbleHeight2 + margin2.top + margin2.bottom)
        .append("g")
        .attr("transform", `translate(${margin2.left},${margin2.top})`);

    const sizeScale2 = d3.scaleSqrt()
        .domain(d3.extent(dataSplit, d => d.numQuestions))
        .range([3, 30]);

    const simulation2 = d3.forceSimulation(dataSplit)
        .force("x", d3.forceX(d => (d.usedAI === "AI" ? bubbleWidth2 * 0.75 : bubbleWidth2 * 0.25)).strength(0.1))
        .force("y", d3.forceY(bubbleHeight2 / 2).strength(0.1))
        .force("collide", d3.forceCollide(d => sizeScale2(d.numQuestions) + 2))
        .on("tick", ticked2);

    const bubbles2 = svgBubble2.selectAll(".bubble")
        .data(dataSplit)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("r", d => sizeScale2(d.numQuestions))
        .attr("fill", d => (d.usedAI === "AI" ? "purple" : "black"))
        .attr("fill-opacity", d => d.percentComplete / 100)
        .attr("stroke", d => (d.usedAI === "AI" ? "purple" : "black"))
        .attr("stroke-width", 1.5);

    function ticked2() {
        bubbles2
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }
});







