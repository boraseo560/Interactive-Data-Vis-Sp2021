let svgArea;
let xScaleArea;
let yScaleArea;

/* APPLICATION STATE */
let stateArea = {
    data: [],
    selection: "Australia", // + YOUR FILTER SELECTION
};

/* LOAD DATA */
// + SET YOUR DATA PATH
d3.csv('AV_AN_WAGE_08032021040836809.csv', (d) => {
    const formatObj = {
        year: new Date(+d.Time, 0, 1),
        country: d.Country,
        value: +d.Value
    }
    // console.log(d, formatObj)
    return formatObj
})
    .then(data => {
        // console.log("raw_data", raw_data);
        stateArea.data = data;
        initArea();
    });

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function initArea() {
    // console.log('state', state)
    // + SCALES
    xScaleArea = d3.scaleTime()
        .domain(d3.extent(stateArea.data, d => d.year))
        .range([margin.left, width - margin.right])

    yScaleArea = d3.scaleLinear()
        .domain(d3.extent(stateArea.data, d => d.value))
        .range([height - margin.bottom, margin.top])

    // + AXES
    const xAxisArea = d3.axisBottom(xScaleArea)
    const yAxisArea = d3.axisLeft(yScaleArea)

    // create SVG
    svgArea = d3.select(".area-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    svgArea.append("g")
        .attr("class", "xAxis")
        .attr("transform", `translate(${0}, ${height - margin.bottom})`)
        .call(xAxisArea)
        .attr("font-size", "12")
        .append("text")
        .text("Year")
        .attr("transform", `translate(${width / 2}, ${40})`)
        .attr("fill", "black")
        .attr("font-size", "16")

    svgArea.append("g")
        .attr("class", "yAxis")
        .attr("transform", `translate(${margin.left}, ${0})`)
        .call(yAxisArea)
        .attr("font-size", "14")
        .append("text")
        .text("Annual Wage (Converted in USD PPPs")
        .attr("transform", `translate(${-70}, ${height / 2})rotate(-90)`)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-size", "16")

    // + UI ELEMENT SETUP
    const dropdownArea = d3.select("#area-dropdown")
    dropdownArea.selectAll("options")
        .data(Array.from(new Set(stateArea.data.map(d => d.country))))
        .join("option")
        .attr("value", d => d)
        .text(d => d)

    dropdownArea.on("change", event => {
        console.log("Yay", event.target.value)
        stateArea.selection = event.target.value
        console.log("new state", stateArea)
        drawArea()
    })
    drawArea(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function drawArea() {
    // + FILTER DATA BASED ON STATE
    // console.log("state.selection", state.selection)
    const filteredData = stateArea.data
        .filter(d => stateArea.selection === d.country)

    // + UPDATE SCALE(S), if needed
    yScaleArea.domain(d3.extent(filteredData, d => d.value))

    // + UPDATE AXIS/AXES, if needed
    // + DRAW CIRCLES, if you decide to
    const areaFunction = d3.area()
        .x(d => xScaleArea(d.year))
        .y0(height - margin.bottom)
        .y1(d => yScaleArea(d.value))

    svgArea.selectAll("path.line")
        .data([filteredData])
        .join("path")
        .attr("class", "line")
        .attr("fill", "turquoise")
        // .attr("stroke-width", "2")
        .attr("stroke", "darkgreen")
        .attr("d", areaFunction)

}
