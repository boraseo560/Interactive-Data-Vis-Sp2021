
let svgPack;
let tooltipPack;

/**
* APPLICATION STATE
* */
let statePack = {
    data: null,
    hover: null
    // + INITIALIZE STATE
};

/**
* LOAD DATA
* */
d3.json("../data/flare.json", d3.autotype).then(data => {
    statePack.data = data;
    initPack();
});

/**
* INITIALIZING FUNCTION
* this will be run *one time* when the data finishes loading in
* */
function initPack() {

    // const color = d3.scaleOrdinal(d3.schemeSet3)
    const color = d3.scaleSequentialSqrt([1, 8], ["#8da6a6", "#5f318a"])
    // console.log(state.data)
    const containerPack = d3.select("#pack-circle").style("position", "relative");

    svgPack = containerPack
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("text-anchor", "middle")

    // + INITIALIZE TOOLTIP IN YOUR CONTAINER ELEMENT
    tooltipPack = containerPack.append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("top", 0)
        .style("left", 0)
        .style("background-color", "white")
        .style("border-radius", "5px")
        .style("box-shadow", "0 0 7px #4e4c4c")
        .style("padding", "2.5px")

    // + CREATE YOUR ROOT HIERARCHY NODE 
    const rootPack = d3.hierarchy(statePack.data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value)

    const circlePack = d3.pack()
        .size([width - 2, height - 2])
        .padding(3)
    // console.log(state.data)
    // console.log(root)

    // + CREATE YOUR LAYOUT GENERATOR
    // const treeLayout = d3.treemap()
    //     .size([width, height])
    //     .padding(1)

    // + CALL YOUR LAYOUT FUNCTION ON YOUR ROOT DATA
    // treeLayout(root)
    circlePack(rootPack)
    const nodePack = rootPack.descendants()


    // + CREATE YOUR GRAPHICAL ELEMENTS
    // const leavesPack = rootPack.leaves()
    // console.log(leaves)

    const packGroup = svgPack.selectAll("g")
        .data(nodePack)
        .join("g")
        .attr("transform", d => `translate(${d.x},${d.y})`)

    packGroup.append("circle")
        .attr("r", d => d.r)
        .attr("fill", d => color(d.height))
        // .attr("fill", d => {
        //     const pack1Ancestor = d.ancestors().find(a => a.depth === 1)
        //     return color(pack1Ancestor.data.name)
        // })
        .attr("stroke", "black")
        .attr("width", d => d.x)
        .attr("height", d => d.y)

    // leafGroup.append("text")
    //   .attr("dy", "1em")
    //   .text(d => d.data.name)
    //   .attr("font-size", "8")

    packGroup.on("mouseover", (event, d) => {
        statePack.hover = {
            position: [d.x, d.y],
            name: d.data.name,
            value: d.data.value,
            ancestorsPath: d.ancestors()
                .reverse()
                .map(d => d.data.name)
                .join("/")
        }
        drawPack()
    })
        .on("mouseleave", () => {
            statePack.hover = null
            drawPack();
        })
    drawPack(); // calls the draw function
}

/**
* DRAW FUNCTION
* we call this everytime there is an update to the data/state
* */
function drawPack() {
    // + UPDATE TOOLTIP

    if (statePack.hover) {
        tooltipPack
            .html(
                `
       <div>Name: ${statePack.hover.name} </div>
       <div>Value: ${statePack.hover.value} </div>
       <div>Hierarchy Path: ${statePack.hover.ancestorsPath} </div>
     `
            )
            .style("font-size", "12px")
            .transition()
            .duration(200)
            .style("transform", `translate(${statePack.hover.position[0]}px, ${statePack.hover.position[1]}px )`)

    }
    tooltipPack.classed("visible", statePack.hover)
}
