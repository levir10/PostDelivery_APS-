var viewer;
var modData = {};
// @urn the model to show
// @viewablesId which viewables to show, applies to BIM 360 Plans folder
function launchViewer(urn, viewableId) {
  var options = {
    //   env: 'AutodeskProduction',
    //   getAccessToken: getForgeToken,
    //   api: 'derivativeV2' + (atob(urn.replace('_', '/')).indexOf('emea') > -1 ? '_EU' : '') // handle BIM 360 US and EU regions
    env: "AutodeskProduction2",
    getAccessToken: getForgeToken,
    api: "streamingV2", // handle BIM 360 US and EU regions
    getAccessToken: getForgeToken,
    language: "en",
  };

  Autodesk.Viewing.Initializer(options, () => {
    const config = {
      // an object with a different properties
      //here we transfer the string name of the extentions
      // extensions: [ 'Autodesk.DocumentBrowser','HandleSelectionExtension','ModelSummaryExtension','testTest', 'HistogramExtension','DataGridExtension',] // OLD list of strings that represent the extentions we want to load to the viewer

      extensions: [
        "Autodesk.DocumentBrowser",
        "HistogramExtension",
        "DataGridExtension",
        "ToolBar",
        "Autodesk.VisualClusters",
        "Autodesk.AEC.LevelsExtension",
      ], // ACTUAL list of strings that represent the extentions we want to load to the viewer
    };
    viewer = new Autodesk.Viewing.GuiViewer3D(
      document.getElementById("forgeViewer"),
      config
    );
    viewer.start();
    // viewer.setLOD(3);

    var documentId = "urn:" + urn;
    Autodesk.Viewing.Document.load(
      documentId,
      onDocumentLoadSuccess,
      onDocumentLoadFailure
    );
  });

  //This section will run only when the model will load fully
  function onDocumentLoadSuccess(doc) {
    // if a viewableId was specified, load that view, otherwise the default view
    var viewables = viewableId
      ? doc.getRoot().findByGuid(viewableId)
      : doc.getRoot().getDefaultGeometry();
    viewer.loadDocumentNode(doc, viewables).then((i) => {
      // any additional action here?

      this.viewer.addEventListener(
        //
        Autodesk.Viewing.GEOMETRY_LOADED_EVENT, //-->(10) geometry load event - go to "extensions"
        onGeometryLoaded
      );
    });
  }
  function onGeometryLoaded() {
    //  a fix for the bug that makes the dashboards disapear when switching models or phases--->04.03.23
    if (document.getElementById("maindashcontainer") != undefined) {
      var maindashcontainer = document.getElementById("maindashcontainer");
      document.getElementById("main-container").removeChild(maindashcontainer);
      modData = {};
    }
    //  a fix for the bug that makes the dashboards disapear when switching models or phases--->04.03.23

    //--> this part makes a hover listener to make the usershub apear only on hovers
    const body = document.querySelector("body");
    const colSm4Fill = document.querySelector(".col-sm-4.fill");
    body.addEventListener("mousemove", (event) => {
      if (event.clientX < body.offsetWidth * 0.2) {
        colSm4Fill.style.transition = "opacity 0.5s ease-in-out";
        colSm4Fill.style.opacity = "1";
        colSm4Fill.style.transform = "translateX(0%)";
      } else {
        colSm4Fill.style.transition = "opacity 0.8s ease-in-out";
        colSm4Fill.style.opacity = "0";
        colSm4Fill.style.transform = "translateX(-100%)";
      }
    });
    //--> this part makes a hover listener to make the usershub apear only on hovers
    viewer.impl.setLightPreset(0); //-->this is to make the background white

    console.log("Geometry Loaded");
    areaArray = Array(1).fill(Array(5).fill(0)); // added this ne05.01.23

    // Get the model object
    var model = viewer.model;

    // Find the leaf nodes in the model
    findLeafNodes(model).then(
      function (leafNodes) {
        // Get the bulk properties of the leaf nodes
        model.getBulkProperties(
          leafNodes,
          {
            propFilter: [
              "Category",
              "System Classification",
              "Area",
              "Reference Level",
              "System Type",
              "Level",
              "Type Name",
              "Size",
              "Length",
              "Revit Walls",
              "Base Constraint",
              "Comments",
              "Schedule Level",
              "Name",
              "Gross Building",
              "Revit Areas",
              "Area Scheme",
              "Number",
              "Type Mark",
            ],
          }, //05.01.23 added gross building
          function (elements) {
            // elements=elements.splice(1,elements.length/2);
            // var levelName = setLevelDropDown(elements);//-->the  first time- get the first level name
            var levelNames = FindLevelNames(elements); //-->the  first time- get the first level name
            var property = "AF_Flow";
            getListCategories(elements, function (cateElem) {
              arraySimplify(
                elements,
                "Select All Levels",
                property,
                cateElem,
                areaArray,
                function (object) {
                  //05.01.23 added areaArray [INDEX =5 ARGUMENT] to here
                  modData.quantities = object.quantities;
                  modData.Elements = object.Elements;
                  modData.elem = object.Elements.ele;
                  modData["Load"] = "Done";
                  // console.log(propNames);
                  // showPowerBIReport(levelNames,propNames);
                  console.log("Big calculation done");
                  showPowerBIReport(levelNames, leafNodes, elements);
                }
              );
            });
          }
        );
      },
      null,
      ["Comments"]
    );

    DashBoardColors = generateColorsRandom();
  }
  function findLeafNodes(model) {
    return new Promise(function (resolve, reject) {
      model.getObjectTree(function (tree) {
        let leaves = [];
        tree.enumNodeChildren(
          tree.getRootId(),
          function (dbid) {
            if (tree.getChildCount(dbid) === 0) {
              leaves.push(dbid);
            }
          },
          true
        );
        resolve(leaves);
      }, reject);
    });
  }

  function onDocumentLoadFailure(viewerErrorCode, viewerErrorMsg) {
    console.error(
      "onDocumentLoadFailure() - errorCode:" +
        viewerErrorCode +
        "\n- errorMessage:" +
        viewerErrorMsg
    );
  }
}

function getForgeToken(callback) {
  fetch("/api/forge/oauth/token").then((res) => {
    res.json().then((data) => {
      callback(data.access_token, data.expires_in);
    });
  });
}

function generateColorsRandom() {
  var background = [];
  background.push("rgba(" + 243 + ", " + 132 + ", " + 12 + ", 0.8)");
  background.push("rgba(" + 243 + ", " + 182 + ", " + 0 + ", 0.8)");
  background.push("rgba(" + 241 + ", " + 212 + ", " + 76 + ", 0.8)");
  background.push("rgba(" + 255 + ", " + 142 + ", " + 155 + ", 0.8)");
  background.push("rgba(" + 244 + ", " + 76 + ", " + 127 + ", 0.8)");
  background.push("rgba(" + 131 + ", " + 227 + ", " + 119 + ", 0.8)");
  background.push("rgba(" + 249 + ", " + 138 + ", " + 172 + ", 0.8)");
  background.push("rgba(" + 255 + ", " + 179 + ", " + 200 + ", 0.8)");
  background.push("rgba(" + 196 + ", " + 241 + ", " + 241 + ", 0.8)");
  background.push("rgba(" + 114 + ", " + 220 + ", " + 202 + ", 0.8)");
  background.push("rgba(" + 241 + ", " + 255 + ", " + 111 + ", 0.8)");
  background.push("rgba(" + 241 + ", " + 166 + ", " + 111 + ", 0.8)");
  background.push("rgba(" + 188 + ", " + 0 + ", " + 221 + ", 0.8)");
  background.push("rgba(" + 219 + ", " + 0 + ", " + 182 + ", 0.8)");
  background.push("rgba(" + 242 + ", " + 0 + ", " + 1 + ", 0.8)");
  background.push("rgba(" + 242 + ", " + 111 + ", " + 1 + ", 0.8)");
  background.push("rgba(" + 242 + ", " + 180 + ", " + 15 + ", 0.8)");
  background.push("rgba(" + 242 + ", " + 195 + ", " + 100 + ", 0.8)");
  background.push("rgba(" + 65 + ", " + 95 + ", " + 134 + ", 0.8)");
  background.push("rgba(" + 25 + ", " + 145 + ", " + 158 + ", 0.8)");
  background.push("rgba(" + 0 + ", " + 98 + ", " + 255 + ", 0.8)");
  background.push("rgba(" + 255 + ", " + 242 + ", " + 0 + ", 0.8)");
  background.push("rgba(" + 255 + ", " + 0 + ", " + 123 + ", 0.8)");
  background.push("rgba(" + 255 + ", " + 0 + ", " + 43 + ", 0.8)");
  background.push("rgba(" + 0 + ", " + 187 + ", " + 255 + ", 0.8)");
  background.push("rgba(" + 0 + ", " + 187 + ", " + 255 + ", 0.8)");
  background.push("rgba(" + 41 + ", " + 227 + ", " + 134 + ", 0.8)");
  background.push("rgba(" + 109 + ", " + 189 + ", " + 40 + ", 0.8)");
  background.push("rgba(" + 39 + ", " + 159 + ", " + 245 + ", 0.8)");
  background.push("rgba(" + 240 + ", " + 132 + ", " + 12 + ", 0.8)");
  background.push("rgba(" + 247 + ", " + 160 + ", " + 0 + ", 0.8)");
  background.push("rgba(" + 243 + ", " + 220 + ", " + 70 + ", 0.8)");
  background.push("rgba(" + 245 + ", " + 140 + ", " + 155 + ", 0.8)");
  background.push("rgba(" + 234 + ", " + 86 + ", " + 123 + ", 0.8)");
  background.push("rgba(" + 131 + ", " + 227 + ", " + 119 + ", 0.8)");
  background.push("rgba(" + 249 + ", " + 158 + ", " + 182 + ", 0.8)");
  background.push("rgba(" + 251 + ", " + 177 + ", " + 201 + ", 0.8)");
  background.push("rgba(" + 197 + ", " + 242 + ", " + 245 + ", 0.8)");
  background.push("rgba(" + 113 + ", " + 225 + ", " + 202 + ", 0.8)");
  background.push("rgba(" + 241 + ", " + 245 + ", " + 101 + ", 0.8)");
  background.push("rgba(" + 248 + ", " + 176 + ", " + 121 + ", 0.8)");
  background.push("rgba(" + 188 + ", " + 2 + ", " + 231 + ", 0.8)");
  background.push("rgba(" + 219 + ", " + 8 + ", " + 182 + ", 0.8)");
  background.push("rgba(" + 242 + ", " + 7 + ", " + 1 + ", 0.8)");
  background.push("rgba(" + 242 + ", " + 111 + ", " + 17 + ", 0.8)");
  background.push("rgba(" + 22 + ", " + 150 + ", " + 15 + ", 0.8)");
  background.push("rgba(" + 242 + ", " + 195 + ", " + 100 + ", 0.8)");
  background.push("rgba(" + 65 + ", " + 95 + ", " + 130 + ", 0.8)");
  background.push("rgba(" + 250 + ", " + 145 + ", " + 158 + ", 0.8)");
  background.push("rgba(" + 0 + ", " + 152 + ", " + 255 + ", 0.8)");
  background.push("rgba(" + 255 + ", " + 24 + ", " + 0 + ", 0.8)");
  background.push("rgba(" + 2 + ", " + 126 + ", " + 125 + ", 0.8)");
  background.push("rgba(" + 230 + ", " + 9 + ", " + 43 + ", 0.8)");
  background.push("rgba(" + 0 + ", " + 200 + ", " + 255 + ", 0.8)");
  background.push("rgba(" + 0 + ", " + 255 + ", " + 0 + ", 0.8)");
  background.push("rgba(" + 10 + ", " + 0 + ", " + 255 + ", 0.8)");
  background.push("rgba(" + 0 + ", " + 30 + ", " + 245 + ", 0.8)");
  background.push("rgba(" + 39 + ", " + 88 + ", " + 245 + ", 0.8)");
  for (let i = 0; i < 100; i++) {
    let red = Math.floor(Math.random() * (255 - 128 + 1)) + 128;
    let green = Math.floor(Math.random() * (255 - 128 + 1)) + 128;
    let blue = Math.floor(Math.random() * (255 - 128 + 1)) + 128;

    let color = "rgba(" + red + ", " + green + ", " + blue + ", 0.8)";
    background.push(color);
  }
  shuffle(background);

  return { background: background };
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
// // for all models: find all props
// async function findPropertyNames(model,dbids,elements) {

//   return new Promise(function (resolve, reject) {
//       model.getBulkProperties(dbids, {}, function (results) {
//           let propNames = new Set();
//           for (const result of results) {
//               for (const prop of result.properties) {
//                   propNames.add(prop.displayName);
//               }
//           }
//           resolve(Array.from(propNames.values()));
//       }, reject);
//   });
// }
//for BIG ASS Models: find important props
async function findPropertyNames(model, dbids, elements) {
  return new Promise(function (resolve, reject) {
    let propNames = new Set();
    let myPropNames = [
      "DSH_AIR_FLOW",
      "AF_Flow",
      "Cost",
      "Comments",
      "Paint Area",
      "Plaster Area",
      "Circuit Number",
      "CFM",
      "Control Number",
      "C_Number_BC",
      "Airflow rate_HIGH_Cooling (m3/h)",
      "Design Supply Air Flow",
      "Airflow Rate (m3/min)",
      "Air_Design Airflow",
      "Electrical Data",
      "Electrical Data",
      "Circuit #",
      "Load",
      "Length",
      "Mark",
      "URL",
      "Assembly Code",
      "Soffit Area",
      "Soffit Length",
      "Name",
      "Department",
      "FTC Area",
      "Short Wall Area",
      "Short Wall Length",
      "Base Constraint",
      "Volume",
      "Type Name",
      "Occupancy",
      "Number",
      "Room Number",
      "Room Status",
      "Ceiling Finish",
      "Floor Finish",
      "Group",
      "Area",
      "Perimeter",
      "Unbounded Height",
      "Tidhar Specification",
      "Area Type",
      "Computation Height",
      "Nominal Air Flow",
      "Voltage",
      "Total Cooling Capacity",
      "Sensible Cooling Capacity",
      "Apparent Load",
      "Air Flow",
      "Nominal Air Flow",
      "Tidhar Space",
      "Tidhar Asset number",
      "Tidhar Drawing reference",
      "Tidhar Manufacturer",
      "Tidhar Serial no",
      "Tidhar Sub category description",
      "Tidhar_date of install",
      "Type Mark",
      "Tidhar Type Mark",
      "Tidhar Mark",
    ];
    for (const prop of myPropNames) {
      propNames.add(prop);
    }

    resolve(Array.from(propNames.values()));
  });
}

function findLeafNodes(model) {
  return new Promise(function (resolve, reject) {
    model.getObjectTree(function (tree) {
      let leaves = [];
      tree.enumNodeChildren(
        tree.getRootId(),
        function (dbid) {
          if (tree.getChildCount(dbid) === 0) {
            leaves.push(dbid);
          }
        },
        true
      );
      resolve(leaves);
    }, reject);
  });
}
