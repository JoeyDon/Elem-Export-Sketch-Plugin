var sketch = require("sketch/dom");
var ui = require("sketch/ui");
var today = new Date();
var time =
  today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
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
    ui.message("No layers are selected.");
  } else {
    launchExport(selectedLayers);
    ui.message(`Success! ${selectedCount} layers are launched.`);
  }
}

function launchExport(selectedLayers) {
  // Loop through each selected Artboard
  for (let i = 0; i < selectedLayers.layers.length; i++) {
    let artboardName = selectedLayers.layers[i].name;

    // Loop through each element in Artboards[i]
    for (let j = 0; j < selectedLayers.layers[i].layers.length; j++) {
      selectedLayers.layers[i].name = `${artboardName}-${j.toString()}`;

      // Hide all elements
      selectedLayers.layers[i].layers.map((x) => {
        x.hidden = true;
        return x;
      });

      // Only un-hide the j-th element
      selectedLayers.layers[i].layers[j].hidden = false;

      const pngoptions = {
        scales: 2,
        formats: "png",
        output: `~/Documents/Sketch Exports/${todayDate}/${time}`,
      };
      sketch.export(selectedLayers.layers, pngoptions);

      selectedLayers.layers[i].layers.map((x) => {
        x.hidden = false;
        return x;
      });
    }

    // Changeback the Artboard name
    selectedLayers.layers[i].name = artboardName;
  }
}
