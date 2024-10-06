// Data setup
const areas = [
    "North West", "North", "North East",
    "West", "Central", "East",
    "South West", "South", "South East"
];
const years = d3.range(2014, 2024);
const fullData = [];

// Generate more realistic data
areas.forEach(area => {
    let basePopulation = 1.5 + Math.random() * 0.5;
    const growthRate = 1 + (Math.random() * 0.08);
    
    years.forEach(year => {
        basePopulation *= growthRate;
        fullData.push({
            year: year,
            area: area,
            population: basePopulation + (Math.random() * 0.2 - 0.1)
        });
    });
});

// Set up dimensions
const margin = {top: 50, right: 100, bottom: 50, left: 50};
const width = 600 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

// Create color scale with heat colors
const colorScale = d3.scaleSequential()
    .domain([d3.min(fullData, d => d.population), d3.max(fullData, d => d.population)])
    .interpolator(d3.interpolateInferno);

// Create SVG
const svg = d3.select("#heatmap")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Create scales for 3x3 grid
const xScale = d3.scaleBand()
    .domain([0, 1, 2])
    .range([0, width])
    .padding(0.05);  // Reduced padding to bring squares closer

const yScale = d3.scaleBand()
    .domain([0, 1, 2])
    .range([0, height])
    .padding(0.05);  // Reduced padding to bring squares closer

// Function to update visualization
function updateViz(selectedYear) {
    const yearData = fullData.filter(d => d.year === selectedYear);
    
    // Update cells
    const cells = svg.selectAll(".cell")
        .data(yearData, d => d.area);

    cells.enter()
        .append("rect")
        .attr("class", "cell")
        .attr("rx", 10)  // Rounded corners
        .attr("ry", 10)  // Rounded corners
        .merge(cells)
        .transition()
        .duration(500)
        .attr("x", (d, i) => xScale(i % 3))
        .attr("y", (d, i) => yScale(Math.floor(i / 3)))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .style("fill", d => colorScale(d.population));

    // Update area labels
    const labels = svg.selectAll(".area-label")
        .data(yearData, d => d.area);

    labels.enter()
        .append("text")
        .attr("class", "area-label")
        .merge(labels)
        .attr("x", (d, i) => xScale(i % 3) + xScale.bandwidth() / 2)
        .attr("y", (d, i) => yScale(Math.floor(i / 3)) + yScale.bandwidth() / 2)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .text(d => d.area)
        .style("fill", d => d3.lab(colorScale(d.population)).l < 50 ? "white" : "black");

    // Update events
    svg.selectAll(".cell")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("stroke", "white")
                .attr("stroke-width", 2);
            
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`${d.area}<br>Population: ${d.population.toFixed(2)}M`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("stroke", null);
            
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Update year display
    d3.select("#yearValue").text(selectedYear);
    d3.select("#yearSlider").property("value", selectedYear);
}

// Add legend
const legendWidth = 20;
const legendHeight = height;

const legendScale = d3.scaleLinear()
    .domain([d3.min(fullData, d => d.population), d3.max(fullData, d => d.population)])
    .range([legendHeight, 0]);

const legendAxis = d3.axisRight(legendScale)
    .tickFormat(d => d.toFixed(1) + "M");

const legend = svg.append("g")
    .attr("transform", `translate(${width + 10},0)`);

const gradient = legend.append("defs")
    .append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "100%")
    .attr("x2", "0%")
    .attr("y2", "0%");

const numberStops = 10;
for (let i = 0; i <= numberStops; i++) {
    const offset = i / numberStops;
    const value = d3.min(fullData, d => d.population) + 
                  (d3.max(fullData, d => d.population) - d3.min(fullData, d => d.population)) * offset;
    gradient.append("stop")
        .attr("offset", `${offset * 100}%`)
        .attr("stop-color", colorScale(value));
}

legend.append("rect")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#gradient)");

legend.append("g")
    .attr("transform", `translate(${legendWidth},0)`)
    .call(legendAxis);

// Create tooltip
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Initialize visualization
updateViz(2023);

// Slider event listener
d3.select("#yearSlider").on("input", function() {
    updateViz(+this.value);
});

// Play button functionality
let interval;
d3.select("#playButton").on("click", function() {
    const button = d3.select(this);
    if (button.text() === "▶ Play Animation") {
        button.text("⏸ Pause");
        let currentYear = +d3.select("#yearSlider").property("value");
        interval = setInterval(() => {
            currentYear = currentYear >= 2023 ? 2014 : currentYear + 1;
            updateViz(currentYear);
        }, 1000);
    } else {
        button.text("▶ Play Animation");
        clearInterval(interval);
    }
});