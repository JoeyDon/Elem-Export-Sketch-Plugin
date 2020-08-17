var sketch = require("sketch/dom");
var document = sketch.getSelectedDocument();
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();

var todayDate = `${dd}${mm}${yyyy}`;
const doc = sketch.getSelectedDocument();
const selectedLayers = doc.selectedLayers;
const selectedCount = selectedLayers.length;

// Async is available via polyfill, add if needed
export default function () {
  if (selectedCount === 0) {
    sketch.UI.message("No layers are selected.");
  } else {
    launchExport(selectedLayers);
    sketch.UI.message(`Success! ${selectedCount} layers are launched.`);
  }
}

function launchExport(selectedLayers) {
  // Loop through each selected Artboard
  for (let i = 0; i < selectedLayers.layers.length; i++) {
    let artboardName = selectedLayers.layers[i].name;

    // Loop through each element in Artboards[i]
    for (let j = 0; j < selectedLayers.layers[i].layers.length; j++) {
      selectedLayers.layers[i].name = `${j.toString()}`;

      // Hide all elements
      selectedLayers.layers[i].layers.map((x) => {
        x.hidden = true;
        return x;
      });

      // Only un-hide the j-th element
      selectedLayers.layers[i].layers[j].hidden = false;

      // Screenshot & output
      const pngoptions = {
        scales: 2,
        formats: "png",
        output: `~/Documents/Sketch Exports/${todayDate}/${artboardName}`,
      };
      sketch.export(selectedLayers.layers, pngoptions);

      // const jpgoptions = {
      //   scales: 2,
      //   formats: "jpg",
      //   output: `~/Documents/Sketch Exports/${todayDate}/${artboardName}`,
      //   compression: 0.4,
      // };
      // sketch.export(selectedLayers.layers, jpgoptions);

      // Display all elements
      selectedLayers.layers[i].layers.map((x) => {
        x.hidden = false;
        return x;
      });
    }

    // Changeback the Artboard name
    selectedLayers.layers[i].name = artboardName;
  }
}
