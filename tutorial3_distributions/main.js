/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.9,
  margin = { top: 30, bottom: 60, left: 60, right: 30 },
  radius = 3.5;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selectStatus: "All" // + YOUR FILTER SELECTION
};

/* LOAD DATA */
d3.json("healthcare-dataset-stroke-data.json", d3.autoType).then(raw_data => {
  // + SET YOUR DATA PATH
  console.log("raw_data", raw_data);
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in 
function init() {
  console.log('state', state)

  // + SCALES
  xScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => d.age))
    .range([margin.left, width - margin.right])
  // console.log("xScale", xScale, xScale(67))

  yScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => d.bmi))
    .range([height - margin.bottom, margin.top])

  // + AXES
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)

  // + CREATE SVG ELEMENT
  svg = d3.select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  // + CALL AXES
  svg.append("g")
    .attr("class", "xAxis")
    .attr("transform", `translate(${0}, ${height - margin.bottom})`)
    .call(xAxis)
    .attr("font-size", "14")
    .append("text")
    .text("Age")
    .attr("transform", `translate(${width / 2}, ${40})`)
    .attr("fill", "black")

  svg.append("g")
    .attr("class", "yAxis")
    .attr("transform", `translate(${margin.left}, ${0})`)
    .call(yAxis)
    .attr("font-size", "14")
    .append("text")
    .text("BMI")
    .attr("transform", `translate(${-30}, ${height / 2})`)
    .attr("fill", "black")

  draw();
  // + UI ELEMENT SETUP
  const dropdown = d3.select("#dropdown")
  //   .on("change", function () {
  //   // `this` === the selectElement
  //   // 'this.value' holds the dropdown value a user just selected

  //   state.selection = this.value
  //   console.log("new value is", this.value);
  //   draw(); // re-draw the graph based on this new selection

  // add in dropdown options from the unique values in the data
  d3.select("#dropdown")
    .selectAll("option")
    .data(["All", "Had stroke", "Never had stroke"]) // + ADD UNIQUE VALUES
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  dropdown.on("change", event => {
    // console.log("dropdown changed!", event.target.value)
    state.selectStatus = event.target.value
    draw();
  })

  draw(); // calls the draw function
};

/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() {
  console.log("Drawing function")

  // + FILTER DATA BASED ON STATE
  const filteredData = state.data
    .filter(d => {
      if (state.selectStatus == "All") return true
      else return d.stroke == state.selectStatus
    })

  var symbol = d3.symbol();

  svg.selectAll("circle")
    .data(filteredData, d => d.id)
    .join(
      enter => enter.append("circle")
        .attr("r", radius)
        .attr("cy", margin.top)
        // .attr("opacity", "0.5")
        .attr("fill", d => {
          if (d.stroke == "Had stroke") return "#fc3232"
          else return "rgba(0,70,274, 0.3)"
        })
        .call(enter => enter.transition()
          .duration(1500)
          .attr("cy", d => yScale(d.bmi))
        )
      ,
      update => update,
      exit => exit.remove()
    )
    // .attr("r", radius)
    // .attr("cx", d => xScale(d.age))
    .attr("cx", d => xScale(d.age))

  // const dot = svg
  //   .selectAll("circle")
  //   .data(filteredData, d => d.name)
  //   .join(
  //     enter => enter, // + HANDLE ENTER SELECTION
  //     update => update, // + HANDLE UPDATE SELECTION
  //     exit => exit // + HANDLE EXIT SELECTION
  //   );
}
