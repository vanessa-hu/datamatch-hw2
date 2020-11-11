// PART I: Manipulating the DOM

// Step 1: Select the body of the HTML document and append an h2 element
// with the text "We're learning D3!"
d3.select("body").append("h2").text("We're learning D3!");


// Step 2: Select the body again and append a div with the id dynamic-content
d3.select("body").append("div").attr("id", "dynamic-content");


// Step 3: Select the div you just created (using its id!) and append a
// paragraph with some text of your choice (you can also style this if you want!)
d3.select("#dynamic-content").append("p").text("JavaScript is pretty fun?!");


// PART II: Binding data

var schools = [
    { name: "Harvard", signups: 4695, region: "Northeast" },
    { name: "UW Madison", signups: 4232, region: "Midwest" },
    { name: "WashU", signups: 3880, region: "Midwest" },
    { name: "Brown", signups: 2603, region: "Northeast" },
    { name: "UChicago", signups: 2088, region: "Midwest" },
    { name: "UW", signups: 2042, region: "West" }
];

// Step 1: Append a new SVG element to HTML document with D3
// (width = 500px, height = 500px)


// Step 2: Append a new SVG circle for every object in the schools array


// Step 3: Define the following dynamic properties for each circle:
//   - Position: set the x/y coordinates and make sure that the circles don’t overlap each other
//   - Radius: schools with over 3500 signups should be twice as big as schools with less than 2500 signups
//   - Colors: use a different color for each region
//   - Border: add a border to every circle (SVG property: stroke)
var svg = d3.select("body").append("svg").attr("width", 500).attr("height", 500);
//https://www.d3-graph-gallery.com/graph/custom_color.html
//https://www.dashingd3js.com/svg-basic-shapes-and-d3js
var myColor = d3.scaleSequential().domain([1, 10])
    .interpolator(d3.interpolateViridis);

svg.selectAll("circle")
    .data(schools)
    .enter()
    .append('circle')
    .attr('cx', (row, index) => {
        return index * 60 + 15;
    })
    .attr('cy', (row, index) => {
        return index * 60 + 15;
    })
    .attr('r', (row, index) => {
        return (row.signups > 3500) ? 14 : 7;
    })
    .attr('fill', (row, index) => myColor(index))
    .attr('stroke', 'gray')
    .attr('stroke-width', 1);



// PART III: Loading data

// Step 1: Use D3 to load the CSV file "cities.csv". then, print the data
// to the console and inspect it in your browser

// Step 2: Filter the dataset: Filter the dataset to only include cities that are
// part of the EU.

// Step 3: Append a new paragraph to your HTML document that shows the
// number of EU countries

// Step 4: Prepare the data - each value of the CSV file is stored as a string,
// but we want numerical values to be numbers.


// Step 5: Draw an SVG circle for each city in the filtered dataset
//   - All the elements (drawing area + circles) should be added dynamically with D3
//   - SVG container: width = 700px, height = 550px
//   - Use the x/y coordinates from the dataset to position the circles



// Step 6: Change the radius of the circle to be data-dependent
//   - The radius should be 4px for cities with population less than one million
//   - The radius for all other cities should be 8px


const europeanUnion = ["Austria", "Belgium", "Bulgaria", "Croatia",
    "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France",
    "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania",
    "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania",
    "Slovakia", "Slovenia", "Spain", "Sweden", "United Kingdom"
];

const rowConverter = function(d) {
    return {
        country: d.country,
        city: d.city,
        population: parseInt(d.population),
        x: parseInt(d.x),
        y: parseInt(d.y),
        eu: d.eu,

    }
};
//https://benclinkinbeard.com/d3tips/attrclass-vs-classed/
const info = d3.csv("./data/cities.csv", rowConverter, function(data) {
    console.log(data);
    data = data.filter((row) => europeanUnion.includes(row.country));
    d3.select("body").append("p").text('There were ' + europeanUnion.length + ' EU countries (before the UK left).');
    var citySVG = d3.select("body").append("svg").attr("width", 700).attr("height", 550);
    var tTip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    const circles = citySVG.selectAll("circle")
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', (row) => row.x)
        .attr('cy', (row) => row.y)
        .attr('r', (row) => row.population < 1000000 ? 4 : 8)
        .attr('class', 'city-circle')

    // Optional bonus step: add tooltips displaying the country for each city
    // https://bl.ocks.org/d3noob/257c360b3650b9f0a52dd8257d7a2d73

    .on("mouseover", function(row) {
            tTip.transition()
                .duration(200)
                .style("opacity", .9);
            tTip.html("<p>" + row.country + "</p>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tTip.transition()
                .duration(500)
                .style("opacity", 0);
        });



    // Step 7: Add labels with the names of the European cities
    //   - Use the SVG text element
    //   - All the elements should be the class of city-label
    //   - The labels should only be visible for cities with population greater
    //   than one million (use opacity)
    //https://www.dashingd3js.com/svg-text-element

    var text = citySVG.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr('x', (row) => row.x)
        .attr('y', (row) => row.y - 10)
        .text((row) => row.city)
        .attr('class', 'city-label')
        .attr('opacity', (row) => row.population < 1000000 ? 0 : 1);
});
// Step 8: Styling - in the external stylesheet, do some styling
//   - Make sure to at least style city-label with font size = 11 px and
//   text anchor = middle