/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 30, bottom: 60, left: 100, right: 40 },
  radius = 5;

// const formatBillions = (num) => d3.format(".2s")(num).replace(/G/, 'B')
// const formatDate = d3.timeFormat("%Y")

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.

let xScale;
let yScale;

/* APPLICATION STATE */
let state = {
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
    state.data = data;
    init();
  });

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  console.log('state', state)
  // + SCALES
  xScale = d3.scaleTime()
    .domain(d3.extent(state.data, d => d.year))
    .range([margin.left, width - margin.right])

  yScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => d.value))
    .range([height - margin.bottom, margin.top])

  // + AXES
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)

  // create SVG
  svg = d3.select(".singleline-chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${0}, ${height - margin.bottom})`)
    .call(xAxis)
    .attr("font-size", "12")
    .append("text")
    .text("Year")
    .attr("transform", `translate(${width / 2}, ${40})`)
    .attr("fill", "black")
    .attr("font-size", "16")

  svg.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.left}, ${0})`)
    .call(yAxis)
    .attr("font-size", "14")
    .append("text")
    .text("Annual Wage (Converted in USD PPPs")
    .attr("transform", `translate(${-70}, ${height / 2})rotate(-90)`)
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .attr("font-size", "16")

  // + UI ELEMENT SETUP
  const dropdown = d3.select("#dropdown")
  dropdown.selectAll("options")
    .data(Array.from(new Set(state.data.map(d => d.country))))
    .join("option")
    .attr("value", d => d)
    .text(d => d)

  dropdown.on("change", event => {
    console.log("Yay", event.target.value)
    state.selection = event.target.value
    console.log("new state", state)
    draw()
  })
  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() {
  // + FILTER DATA BASED ON STATE
  // console.log("state.selection", state.selection)
  const filteredData = state.data
    .filter(d => state.selection === d.country)

  // + UPDATE SCALE(S), if needed
  yScale.domain(d3.extent(filteredData, d => d.value))

  // + UPDATE AXIS/AXES, if needed

  // + DRAW CIRCLES, if you decide to
  const lineFunction = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.value))


  svg.selectAll("path.line")
    .data([filteredData])
    .join("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke-width", "2")
    .attr("stroke", "darkgreen")
    .attr("d", lineFunction)
  // const dot = svg
  //   .selectAll("circle")
  //   .data(filteredData, d => d.name)
  //   .join(
  //     enter => enter, // + HANDLE ENTER SELECTION
  //     update => update, // + HANDLE UPDATE SELECTION
  //     exit => exit // + HANDLE EXIT SELECTION
  //   );
  //
  // + DRAW LINE AND AREA
}

