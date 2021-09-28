function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var alldata= data.alldata;
      var resultsarray= alldata.filter(sampleobject => sampleobject.id == sample);
      var selectresult= resultsarray[0]
      var meta = d3.select("#sample-metadata");
      meta.html("");
      Object.entries(selectresult).forEach(([key, value]) => {
        meta.append("h5").text(`${key}: ${value}`);
      });    
    });
  }

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples= data.samples;
    var resultsarray= samples.filter(sampleobject => sampleobject.id == sample);
    var selectresult= resultsarray[0]

    var otu_ids = selectresult.otu_ids;
    var otu_labels = selectresult.otu_labels;
    var values = selectresult.sample_values;


    //bubble Chart
    var LayoutBubble = {
      margin: { t: 0 },
      xaxis: { title: "Id's" },
      hovermode: "closest",
      };

      var DataBubble = [
      {
        x: otu_ids,
        y: values,
        text: otu_labels,
        mode: "markers",
        marker: {
          color: otu_ids,
          size: values,
          }
      }
    ];

    Plotly.plot("bubble", DataBubble, LayoutBubble);

    //bar Chart
    var bar_data =[
      {
        y:otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:values.slice(0,10).reverse(),
        text:otu_labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"

      }
    ];

    var barLayout = {
      title: "Top 10 OTUs",
      margin: { t: 30, l: 100 }
    };

    Plotly.newPlot("bar", bar_data, barLayout);
  });
}   
 
function init() {
  //dropdown
  var selector = d3.select("#selDataset");
  d3.json("samples.json").then((data) => {
    var dataNames = data.names;
    dataNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    const firstSample = dataNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

init();