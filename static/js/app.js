// Creating a function for the dropdown changes
function objectChanged(response) {
    // datasetID is the variable that will store the selected Test Subject ID No
    let datasetID = d3.select('#selDataset').property('value');
    console.log(`Now showing data and graphs for Test Subject ID No. ${datasetID}`);
    
    // Match the metadata ID to the selected dataset ID
    let selectedMetadata = response.metadata.find(metadata => metadata.id == datasetID);
    if (selectedMetadata) {
        let demographicInfo = d3.select('.panel-body');
        // Clear the existing information in the demographic info section
        demographicInfo.html('');
        
        // Append the keys and values from the metadata array as text in the demographic info section
        Object.entries(selectedMetadata).forEach(([key, value]) => {
            demographicInfo.append('p').text(`${key}: ${value}`);
        });
    }

    // Match the sample ID to the selected dataset ID
    let selectedSample = response.samples.find(sample => sample.id == datasetID);
    if (selectedSample) {

        // Assigning the data to the variables for the horizontal bar chart and setting the top 10 values in descending order
        let data = selectedSample.sample_values.slice(0, 10).reverse();
        let labels = selectedSample.otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse();
        let otuLabels = selectedSample.otu_labels.slice(0, 10).reverse();

        // Assigning the data to the variables for the bubble chart
        let xValues = selectedSample.otu_ids;
        let yValues = selectedSample.sample_values;
        // Scaling the Marker size to 75% to minimize visual clutter
        let markerSizes = selectedSample.sample_values.map(value => value * 0.75);
        let markerColors = selectedSample.otu_ids;
        let textValues = selectedSample.otu_labels;
    
        // Setting up the bubble chart
        let bubble = {
            x: xValues,
            y: yValues,
            mode: 'markers',
            marker: {
                size: markerSizes,
                color: markerColors,
                colorscale: 'Viridis'
            },
            text: textValues,
            hoverinfo:'text'
        };
    
        let layout = {
            xaxis: {
                title: 'OTU ID'            
            }
        };
    
        Plotly.newPlot('bubble', [bubble], layout);

        // Setting up the horizontal bar graph
        let bar = {
            x: data,
            y: labels,
            type: 'bar',
            orientation: 'h',
            text: otuLabels,
            hoverinfo: 'text'
        };

        Plotly.newPlot('bar', [bar]);
}}

// Using the d3 library to read samples.json from the URL
const URL = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

d3.json(URL).then(response => {

    // Setting up the dropdown options
    let dropdown = d3.select('#selDataset');
    response.names.forEach(name => {
        // Appending each Test Subject ID No to the dropdown selection
        dropdown.append("option").text(name).attr("value", name);
    });

    // Calling the function to show the graphs and data for the first ID before any changes are made
    objectChanged(response);    

    // Event listener for when dropdown is changed. Function is called to update the graphs and data
    dropdown.on("change", function () {
        objectChanged(response);
    });
})
