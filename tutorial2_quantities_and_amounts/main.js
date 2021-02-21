

// data load 

d3.csv('covid_data.csv', d3.autoType).then(data => {
    console.log("data", data)

    // set size of the svgContainer 
    const width = window.innerWidth * .8;
    const height = 700;
    const margin = ({ top: 30, right: 0, bottom: 30, left: 30 })

    // creating svg container 
    const svgContainer = d3.select(".vertical-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    // set Scales 
    // get all the values in Date in data->scaleBand; all the values in Case in data->scaleLinear
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.Date))
        .range([margin.left, width - margin.right])
        .paddingInner(.2)

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Case)])
        .range([height - margin.bottom, margin.top])

    // gradient color 
    var myColor = d3.scaleSequential().domain([0, d3.max(data, d => d.Case)])
        .interpolator(d3.interpolateRgb("red", "blue")); // How to apply opacity setting?

    // bars
    svgContainer.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - margin.bottom - yScale(d.Case))
        .attr("x", d => xScale(d.Date))
        .attr("y", d => yScale(d.Case))
        .attr("fill", d => myColor(d.Case))

    // x-axis lables 
    svgContainer.append("g")
        .attr("transform", "translate(0, ${height-bottom})") // Why is this not working?
        .call(d3.axisBottom(xScale))

    // y-axis labels 
    svgContainer.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        // .call(d3.axisLeft(yScale))
        .selectAll("text.Case")
        .data(data)
        .join("text")
        .attr("class", 'Case')
        .attr("x", d => xScale(d.Date) + (xScale.bandwidth() / 50))
        .attr("y", d => yScale(d.Case))
        // .attr("dx", "-.5em")
        .attr("dy", "-2.3em")
        .attr("text-anchor", 'middle')
        .text(d => d3.format(",")(d.Case))

    // ** HORIZONTAL CHART **

    // set svg 
    const horiContainer = d3.select(".horizontal-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    // set x-axis and y-axis 
    const xScaleHori = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Case)])
        .range([0, width - margin.right])

    const yScaleHori = d3.scaleBand()
        .domain(data.map(d => d.Date))
        .range([margin.top, height - margin.bottom])
        .paddingInner(.2)

    // gradient color
    var myColorHori = d3.scaleSequential().domain([d3.max(data, d => d.Case), 0])
        .interpolator(d3.interpolateRgb("red", "blue"));

    // x-axis labels 
    horiContainer.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("width", d => xScaleHori(d.Case))
        .attr("height", yScaleHori.bandwidth())
        .attr("y", d => yScaleHori(d.Date))
        .attr("fill", d => myColorHori(d.Case))

    // y-axis labels 
    horiContainer.append("g")
        .attr("transform", "translate(0, ${height - bottom})")
        .call(d3.axisBottom(xScaleHori))
        .attr("text-anchor", 'end')


    horiContainer.append("g")
        // .attr("transform", "translate(0, margin.left)")
        // .call(d3.axisLeft(yScaleHori))
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        // .call(d3.axisLeft(yScale))
        .selectAll("text.Case")
        .data(data)
        .join("text")
        .attr("class", 'Case')
        .attr("y", d => yScaleHori(d.Date) + yScaleHori.bandwidth() / 50)
        .attr("x", d => xScaleHori(d.Case))
        .attr("dy", "-.8em")
        .attr("dx", "1em")
        .attr("text-anchor", 'middle')
        .text(d => d3.format(",")(d.Case))
})