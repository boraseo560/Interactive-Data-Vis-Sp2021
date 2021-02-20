// data load 

d3.csv('covid_data.csv', d3.autoType).then(data => {
    console.log("data", data)

    // set size of the svgContainer 
    const width = 1500;
    const height = 700;
    const margin = ({ top: 30, right: 0, bottom: 30, left: 30 })

    // creating svg container 
    const svgContainer = d3.select(".vertical-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

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
        .attr("x", (d, i) => xScale(d.Date))
        .attr("y", d => yScale(d.Case))
        .attr("fill", "orange")

    // text 
    svgContainer.append("g")
        .attr("transform", "translate(0, ${height - bottom})")
        .call(d3.axisBottom(xScale))
        .selectAll("text.Date")
        // .attr("transform", "rotate(-45)")
        // .attr("class", 'Date')
        // .attr("x", d => xScale(d.Date) + (xScale.bandwidth() / 50))
        // .attr("y", d => height - margin.bottom)
        // .attr("dx", "1em")
        .attr("dy", "-.8em")
    // .attr("text-anchor", 'middle')
    // .text(d => d.Date)

    // draw top 'count' text

    svgContainer.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .selectAll("text.Case")
        .data(data)
        .join("text")
        .attr("class", 'Case')
        .attr("x", d => xScale(d.Date) + (xScale.bandwidth() / 50))
        .attr("y", d => yScale(d.Case))
        .attr("dy", "-2.3em")
        .attr("text-anchor", 'middle')
        .text(d => d3.format(",")(d.Case))

    // horizontal chart under the vertical chart 
    const horiContainer = d3.select(".horizontal-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)

    const xScaleHori = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Case)])
        .range([margin.left, width - margin.right])

    const yScaleHori = d3.scaleBand()
        .domain(data.map(d => d.Date))
        .range([margin.top, height - margin.bottom])
        .paddingInner(.2)

    // var myColor = d3.scaleSequential().domain([0, d3.max(data, d => d.Case)])
    //     .interpolator(d3.interpolateInferno);

    // bars 
    horiContainer.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("width", d => width - xScaleHori(d.Case))
        .attr("height", yScaleHori.bandwidth())
        .attr("x", (d) => xScaleHori(d.Case))
        .attr("y", (d, i) => yScaleHori(d.Date))
        .attr("fill", "steelblue")

    // text 
    horiContainer.append("g")
        .attr("transform", "translate(0, ${height - bottom})")
        .call(d3.axisBottom(xScaleHori))
        .selectAll("text.Case")
        // .attr("transform", "rotate(-45)")
        // .attr("class", 'Date')
        // .attr("x", d => xScale(d.Date) + (xScale.bandwidth() / 50))
        // .attr("y", d => height - margin.bottom)
        // .attr("dx", "1em")
        .attr("dy", "-.8em")
        // .attr("text-anchor", 'middle')
        // .text(d => d.Date)
        .attr("text-anchor", 'middle')
        .text(d => d3.format(",")(d.Case))


    // draw top 'count' text

    horiContainer.append("g")
        .attr("transform", "translate(${margin.right}, 0")
        .selectAll("text.Date")
        .data(data)
        .join("text")
        .attr("class", 'Date')
        .attr("x", d => xScaleHori(d.Case) + (yScaleHori.bandwidth()))
        .attr("y", d => yScaleHori(d.Date))
        .attr("dy", "-2.3em")
})