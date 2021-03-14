/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.9,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;

/**
 * APPLICATION STATE
 * */
let state = {
  geojson: null,
  heat: null,
  hover: {
    stateName: null,
    heatChange: null,
    screenPosition: null, // will be array of [x,y] once mouse is hovered on something
    mapPosition: null, // will be array of [long, lat] once mouse is hovered on something
    visible: false,
  }
};

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
  d3.json("../data/usState.json"),
  d3.csv("../data/usHeatExtremes.csv", d3.autoType),
]).then(([geojson, otherData]) => {
  // + SET STATE WITH DATA
  state.heat = otherData
  state.geojson = geojson
  console.log("state: ", state);
  // console.log(Array.from(new Set(state.heat.map(d => d['Change in 95 percent Days']))))
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  const projection = d3.geoAlbersUsa()
    .fitSize([width, height], state.geojson)

  // const colorScale = d3.scaleSequential(d3.interpolateBlues)
  // .domain(d3.extent(state.geojson.features, d => d.properties.AWATER))

  const pathFunction = d3.geoPath(projection)

  // const graduateCenterCoords = [{long:-73.984, lat:40.7486}] 

  // create an svg element in our main `d3-container` element
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // base layer of states 
  const states = svg.selectAll("path")
    .data(state.geojson.features)
    .join("path")
    .attr("stroke", "black")
    .attr("fill", "#f8f1f1")
    // .attr("fill", d => {
    //   return colorScale(d.properties.AWATER)
    // })
    .attr("d", pathFunction)

  radius = d3.scaleLinear([0, d3.max(state.heat, d => d.TempChange)], [3, 13])

  svg.selectAll("circle.point")
    .data(state.heat)
    // .filter(d => [d.Long, d.Lat])
    // .sort((a, b) => d3.descending(a['Change in 95 percent Days'], b['Change in 95 percent Days'])))
    .join("circle")
    .attr("r", d => radius(Math.abs(d.TempChange)))
    .attr("stroke", "#ccc")
    .attr("fill", d => {
      if (d.TempChange > 0) return "#ef2d2d";
      else if (d.TempChange === 0) return "#ffa900"
      else return "#0576d0"

    })
    .attr("fill-opacity", d => {
      if (d.TempChange > 0) return "0.7"
      else if (d.TempChange === 0) return "0.7"
      else return "0.7"
    })
    .attr("transform", d => {
      const [x, y] = projection([d.Long, d.Lat])
      return `translate(${x}, ${y})`
    })
    .on("mousemove", function (event, d) {
      d3.select(this).transition()
        .duration("30")
        .attr("stroke", "black")
        .attr("r", 16)
      const { clientX, clientY } = event
      const [long, lat] = projection.invert([clientX, clientY])

      state.hover = {
        stateName: d.State,
        heatChange: d.TempChange,
        screenPosition: [clientX, clientY],
        mapPosition: [d3.format(".2f")(long), d3.format(".2f")(lat)],
        visible: true
      }
      draw();
    })
    .on("mouseout", function (event, d) {
      d3.select(this).transition()
        .duration("50")
        .attr("stroke", "#ccc")
        .attr("r", d => radius(d.TempChange))
      state.hover.visible = false
      draw();
    })
  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/state
 * */
function draw() {
  d3.select("#d3-container")
    .selectAll('div.hover-content')
    .data([state.hover])
    .join("div")
    .attr("class", 'hover-content')
    .classed("visible", d => d.visible)
    .style("position", 'absolute')
    .style("transform", d => {
      // only move if we have a value for screenPosition
      if (d.screenPosition)
        return `translate(${d.screenPosition[0]}px, ${d.screenPosition[1]}px)`
    })
    .html(d => {
      return `
      <div> State: ${d.stateName} </div>
      <div> Coordinate: ${d.mapPosition} </div>
      <div> Temperature changes in 95 days: ${d3.format(".2f")(d.heatChange)} </div>
      `})

}


