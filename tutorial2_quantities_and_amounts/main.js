

// data load 

d3.csv('covid_data.csv', d3.autoType).then(data => {
    console.log("data", data)

    // set size of the svgContainer 
    const width = window.innerWidth * .8;
    const height = 768;
    const margin = ({ top: 30, right: 30, bottom: 30, left: 30 })

    // set Scales 
    // get all the values in Date in data->scaleBand; all the values in Case in data->scaleLinear
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Date))
        .range([margin.left, width - margin.right])
        .paddingInner(.2)

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Case)])
        .range([height - margin.bottom, margin.top]);

    // creating svg container 
    const svgContainer = d3.select(".vertical-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // gradient color 
    var myColor = d3.scaleSequential().domain([d3.max(data, d => d.Case), 0])
        .interpolator(d3.interpolateInferno) // How to apply opacity setting?

    // bars
    svgContainer.append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - margin.bottom - yScale(d.Case))
        .attr("x", d => xScale(d.Date))
        .attr("y", d => yScale(d.Case))
        .attr("fill", d => myColor(d.Case))

    // x-axis lables 
    svgContainer.append("g")
        .call(d3.axisBottom(xScale).tickSize(3))
        .attr("transform", "translate(0, ${height-margin.bottom})") // Why is this not working?
        .attr("font-size", "14")

    // y-axis labels 
    svgContainer.selectAll("text.Case")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        // .call(d3.axisLeft(yScale))
        .data(data)
        .join("text")
        .attr("class", 'Case')
        .attr("x", d => xScale(d.Date) + (xScale.bandwidth() / 2))
        .attr("y", d => yScale(d.Case))
        // .attr("dx", "-.5em")
        .attr("dy", "-.5em")
        .attr("text-anchor", 'middle')
        .text(d => d3.format(",")(d.Case))
        .attr("fill", "red")

    // ** HORIZONTAL CHART **

    // set x-axis and y-axis 
    const xScaleHori = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Case)])
        .range([60, width - margin.right])

    const yScaleHori = d3.scaleBand()
        .domain(data.map(d => d.Date))
        .range([margin.top, height - margin.bottom])
        .paddingInner(.2)

    // set svg 
    const horiContainer = d3.select(".horizontal-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    // gradient color
    var myColorHori = d3.scaleSequential().domain([d3.max(data, d => d.Case), 0])
        .interpolator(d3.interpolateInferno)

    // x-axis labels 
    horiContainer.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("width", d => xScaleHori(d.Case))
        .attr("height", yScaleHori.bandwidth())
        // .attr("x", d => 0)
        .attr("y", d => yScaleHori(d.Date))
        .attr("fill", d => myColorHori(d.Case))

    // y-axis labels 
    horiContainer.selectAll("text.Case")
        // .append("g")
        // .call(d3.axisBottom(xScaleHori))
        // .attr("transform", "translate(0, ${height - bottom})")
        // .attr("text-anchor", 'end')
        // .attr("font-size", "14")
        .data(data)
        .join("text")
        .attr("class", 'Case')
        .attr("y", d => yScaleHori(d.Date) + (yScaleHori.bandwidth() / 2))
        .attr("x", d => xScaleHori(d.Case))
        .attr("dy", ".3em")
        .attr("dx", "1.5em")
        .attr("text-anchor", 'middle')
        .text(d => d3.format(",")(d.Case))
    // .attr("fill", "red")

    horiContainer.append("g")
        // .selectAll("text.Date")
        // .attr("transform", "translate(0, margin.left)")
        .call(d3.axisLeft(yScaleHori).tickSize(3))
        .attr("transform", "translate(65, 0)") //"translate(" + margin.left + "," + margin.top + ")"
        .attr("font-size", "14") // Why does this not work? 
    // .call(d3.axisLeft(yScale))
    // .selectAll("text.Case")


})