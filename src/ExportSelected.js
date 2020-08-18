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
      "What types of elements you want to output? It will export all selected type one by one.",
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
    let launchTarget;

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
        launchTarget = value;
        console.log(value);
      }
    );

    // Main launch function
    launchExport(selectedLayers, launchTarget);
    ui.message(`Success! ${selectedCount} layers are launched.`);
  }
}

function launchExport(selectedLayers, launchTarget) {
  // Loop through each selected Artboard
  for (let i = 0; i < selectedLayers.layers.length; i++) {
    let artboardName = selectedLayers.layers[i].name;

    // Loop through each element in Artboards[i]
    for (let j = 0; j < selectedLayers.layers[i].layers.length; j++) {
      // Hide all elements
      selectedLayers.layers[i].layers.map((x) => {
        x.hidden = true;
        return x;
      });

      // Only un-hide the j-th element
      selectedLayers.layers[i].layers[j].hidden = false;

      console.log(JSON.stringify(selectedLayers.layers[i].layers[j]));

      let pngoptions;
      if (selectedLayers.layers[i].layers[j].type === launchTarget) {
        // Rename the file - Because we export parent layer, so rename the parent layer
        selectedLayers.layers[i].name = `${launchTarget}-${i + 1}-${j + 1}`;
        pngoptions = {
          scales: 2,
          formats: "png",
          output: `~/Documents/Sketch Exports/${todayDate}/${time}`,
        };
        sketch.export(selectedLayers.layers, pngoptions);
      }

      selectedLayers.layers[i].layers.map((x) => {
        x.hidden = false;
        return x;
      });
    }

    // Changeback the Artboard name
    selectedLayers.layers[i].name = artboardName;
  }
}
