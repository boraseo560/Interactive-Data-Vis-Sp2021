/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.9,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

let svg;
let tooltip;

/**
 * APPLICATION STATE
 * */
let state = {
  data: null,
  hover: null
  // + INITIALIZE STATE
};

/**
 * LOAD DATA
 * */
d3.json("../data/flare.json", d3.autotype).then(data => {
  state.data = data;
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {

  const colorScale = d3.scaleOrdinal(d3.schemeSet3)
  // console.log(state.data)
  const container = d3.select("#d3-container").style("position", "relative");

  svg = container
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // + INITIALIZE TOOLTIP IN YOUR CONTAINER ELEMENT
  tooltip = container.append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("top", 0)
    .style("left", 0)
    .style("background-color", "white")

  // + CREATE YOUR ROOT HIERARCHY NODE
  const root = d3.hierarchy(state.data)
    .sum(d => d.value)

  // console.log(state.data)
  // console.log(root)

  // + CREATE YOUR LAYOUT GENERATOR
  const treeLayout = d3.treemap()
    .size([width, height])
    .padding(1)

  // + CALL YOUR LAYOUT FUNCTION ON YOUR ROOT DATA
  treeLayout(root)

  // + CREATE YOUR GRAPHICAL ELEMENTS
  const leaves = root.leaves()
  // console.log(leaves)

  const leafGroup = svg.selectAll("rect")
    .data(leaves)
    // .join("rect")
    .join("g")
    .attr("transform", d => `translate(${d.x0}, ${d.y0})`)

  leafGroup.append("rect")
    .attr("fill", d => {
      const level1Ancestor = d.ancestors().find(a => a.depth === 1)
      return colorScale(level1Ancestor.data.name)
    })
    .attr("stroke", "black")
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)

  // leafGroup.append("text")
  //   .attr("dy", "1em")
  //   .text(d => d.data.name)
  //   .attr("font-size", "8")

  leafGroup.on("mouseover", (event, d) => {
    state.hover = {
      position: [d.x0, d.y0],
      name: d.data.name,
      value: d.data.value,
      ancestorsPath: d.ancestors()
        .reverse()
        .map(d => d.data.name)
        .join("/")
    }
    draw()
  })
    .on("mouseleave", () => {
      state.hover = null
      draw();
    })
  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  // + UPDATE TOOLTIP

  if (state.hover) {
    tooltip
      .html(
        `
        <div>Name: ${state.hover.name} </div>
        <div>Value: ${state.hover.value}</div>
        <div>Hierarchy Path: ${state.hover.ancestorsPath}</div>
      `
      )
      .style("font-size", "10px")
      .transition()
      .duration(180)
      .style("transform", `translate(${state.hover.position[0]}px, ${state.hover.position[1]}px )`)

  }
  tooltip.classed("visible", state.hover)
}
