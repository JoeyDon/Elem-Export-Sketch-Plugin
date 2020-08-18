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
    ui.getInputFromUser(
      "What elements you want to skip? It will export the all elements except the type you select.",
      {
        type: ui.INPUT_TYPE.selection,
        possibleValues: ["Text", "ShapePath", "SymbolInstance", "Group"],
      },
      (err, value) => {
        if (err) {
          // most likely the user canceled the input
          console.log(err);
          return;
        }
        console.log(value);
      }
    );
  } else {
    let skipTarget;

    // Get user input
    ui.getInputFromUser(
      "What do you want to output",
      {
        type: ui.INPUT_TYPE.selection,
        possibleValues: ["Text", "ShapePath", "SymbolInstance", "Group"],
      },
      (err, value) => {
        if (err) {
          // most likely the user canceled the input
          return;
        }
        skipTarget = value;
        console.log(value);
      }
    );

    // Main launch function
    launchExport(selectedLayers, skipTarget);
    ui.message(`Success! ${selectedCount} layers are launched.`);
  }
}

function launchExport(selectedLayers, skipTarget) {
  // Loop through each selected Artboard
  for (let i = 0; i < selectedLayers.layers.length; i++) {
    let artboardName = selectedLayers.layers[i].name;

    // Loop through each element in Artboards[i]
    for (let j = 0; j < selectedLayers.layers[i].layers.length; j++) {
      // Hide the element that user selected
      selectedLayers.layers[i].layers.map((x) => {
        if (x.type === skipTarget) x.hidden = true;
        return x;
      });
    }

    let jpgoptions = {
      scales: 2,
      formats: "jpg",
      compression: 0.4,
      output: `~/Documents/Sketch Exports/${todayDate}/${time}`,
    };
    sketch.export(selectedLayers.layers, jpgoptions);
    // Changeback the Artboard name
    selectedLayers.layers[i].name = artboardName;
  }
}
