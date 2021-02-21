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

    var myColor = d3.scaleSequential().domain([0, d3.max(data, d => d.Case)])
        .interpolator(d3.interpolateInferno);

    // bars 
    svgContainer.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - margin.bottom - yScale(d.Case))
        .attr("x", d => xScale(d.Date))
        .attr("y", d => yScale(d.Case))
        .attr("fill", "orange")

    // text 
    svgContainer.append("g")
        .attr("transform", "translate(0, ${height-bottom})") // Why is this not working?
        .call(d3.axisBottom(xScale))

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
    const horiContainer = d3.select(".horizontal-chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    const xScaleHori = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Case)])
        .range([0, width - margin.right])

    const yScaleHori = d3.scaleBand()
        .domain(data.map(d => d.Date))
        .range([margin.top, height - margin.bottom])
        .paddingInner(.2)

    // var myColor = d3.scaleSequential().domain([0, d3.max(data, d => d.Case)])
    //     .interpolator(d3.interpolateInferno);

    horiContainer.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("width", d => xScaleHori(d.Case))
        .attr("height", yScaleHori.bandwidth())
        .attr("y", d => yScaleHori(d.Date))
        .attr("fill", "steelblue")

    // text 
    horiContainer.append("g")
        .attr("transform", "translate(0, ${height - bottom})")
        .call(d3.axisBottom(xScaleHori))
        .attr("text-anchor", 'end')


    horiContainer.append("g")
        .attr("transform", "translate(0, margin.left)")
        .call(d3.axisLeft(yScaleHori))

})