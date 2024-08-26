function getListCategories(elements, _callback) {
  var cateElem = [];
  var object = {};
  var levNam = [];
  object["Elements"] = [];
  // object["Elements"]["Areas"] = []// area of element if it has value
  // object["Elements"]["Reference_Level"] = []// reference Level of element if it has value
  // object["Elements"]["SystemClassification"] = []// reference Level of element if it has value
  object["quantities"] = {};
  object["quantities"]["elements"] = {};
  object["quantities"]["Family"] = [];

  var nonRenderingCategories = [
    "Revit ",
    "Revit <Sketch>",
    "Revit <Room Separation>",
    "Revit <Space Separation>",
    "Revit <Stair/Ramp Sketch: Boundary>",
    "Revit <Stair/Ramp Sketch: Landing Center>",
    "Revit <Stair/Ramp Sketch: Riser>",
    "Revit <Stair/Ramp Sketch: Run>",
    "Revit Air Terminal Tags",
    "Revit Analytical Columns",
    "Revit Analytical Nodes",
    "Revit Automatic Sketch Dimensions",
    "Revit Building Type Settings",
    "Revit Category",
    "Revit Center Line",
    "Revit Duct Systems",
    "Revit Duct Tags",
    "Revit Family Type",
    "Revit Cameras",
    "Revit Center line",
    "Revit Constraints",
    "Revit Curtain Wall Grids",
    "Revit Zone Tags",
    "Revit Work Plane Grid",
    "Revit Wires",
    "Revit Wire Tags",
    "Revit Viewports",
    "Revit View",
    "Revit Title Blocks",
    "Revit Text Notes",
    "Revit Survey Point",
    "Revit Sun Path",
    "Revit Structural Load Cases",
    "Revit Spot Elevation Symbols",
    "Revit Spaces",
    "Revit Space Type Settings",
    "Revit Space Tags",
    "Revit Shared Site",
    "Revit Section Boxes",
    "Revit Schedules",
    "Revit Schedule Graphics",
    "Revit Revision",
    "Revit Reference Planes",
    "Revit Project Information",
    "Revit Project Base Point",
    "Revit Primary Contours",
    "Revit Piping Systems",
    "Revit Pipe Tags",
    "Revit Area Schemes",
    "Revit Color Fill Legends",
    "Revit Color Fill Schema",
    "Revit Conduit Runs",
    "Revit Detail Items",
    "Revit Dimensions",
    "Revit Document",
    "Revit Electrical Circuits",
    "Revit Electrical Demand Factor Definitions",
    "Revit Electrical Equipment Tags",
    "Revit Electrical Load Classification Parameter Element",
    "Revit Electrical Load Classifications",
    "Revit Elevations",
    "Revit Family Name",
    "Revit Generic Annotations",
    "Revit Grids",
    "Revit Group",
    "Revit HVAC Load Schedules",
    "Revit HVAC Zones",
    "Revit Legend",
    "Revit Legend Components",
    "Revit Level",
    "Revit Lighting Fixture Tags",
    "Revit Lines",
    "Revit Mass",
    "Revit Matchline",
    "Revit Material Assets",
    "Revit Materials",
    "Revit Mechanical Equipment Tags",
    "Revit Panel Schedule Templates - Branch Panel",
    "Revit Panel Schedule Templates - Data Panel",
    "Revit Panel Schedule Templates - Switchboard",
    "Revit Phases",
    "Revit Sheet",
    "Revit Views",
    "Revit Rooms",
    "Revit Analytical Walls",
    "Revit Gutters",
    "Revit Railing Rail Path Extension Lines",
    "Revit Rectangular Straight Wall Opening",
    "Revit Spot Elevations",
  ];

  for (var i = 0; i < elements.length; i++) {
    temString = String(elements[i].properties[0].displayValue);
    if (temString != "" && !nonRenderingCategories.includes(temString)) {
      object["Elements"].push(elements[i].dbId);
      object["quantities"]["Family"].push(temString);

      if (typeof object["quantities"]["elements"][temString] == "undefined") {
        object["quantities"]["elements"][temString] = [];
      }
      object["quantities"]["elements"][temString].push(elements[i].dbId);
    }
  }

  _callback(object); //this callback is an object that contains this 2 properties:
  //1) object.quantities ( which contains 2 lists: elements IDs and category names) for example: object.quantities.Family[0]=='Revit Internal Origin'.  and: object.quantities.elements['Revit Internal Origin']==[1207]
  //2)object.Elements (which contains a list of elements IDs)
}

function getProps(elements, levelName, property) {
  const marks_array = Array(1).fill(Array(5).fill(0));
  levelName == undefined ? (levelName = "Select All Levels") : 0;
  marks_array.push(["Category", "Chosen Property", "Mark", "Type", "ID"]);
  for (const element of elements) {
    if (element.properties.length >= 1) {
      // for(var j=0;j<element.properties.length;j++){
      var mark_value = element.properties.find(
        (p) => p.displayName == property // tidhar space or other chosen parameter
      )?.displayValue; //Mark

      if (mark_value != undefined && mark_value != "") {
        if (
          element.properties.find((p) => p.displayCategory === "Constraints")
            ?.displayValue == levelName ||
          levelName == "Select All Levels"
        ) {
          const mark_category = element.properties.find(
            (p) => p.displayName == "Category"
          )?.displayValue; //Type name
          mark_category == undefined ? (mark_category = "None") : 0;
          const mark_level = levelName; // level
          var type_name = element.properties.find(
            (p) => p.displayName == "Type Name"
          )?.displayValue; //Type name
          type_name == undefined || type_name == "" ? (type_name = "None") : 0;
          const mark_id = element.dbId; //ID
          var mark_prop = element.properties.find(
            (p) => p.displayName == property
          )?.displayValue; //property
          mark_prop == undefined ? (mark_prop = "Not Defined") : 0;
          marks_array.push([
            mark_category,
            mark_prop,
            mark_value,
            type_name,
            mark_id,
          ]);
        }

        // break;
        // }
      }
    }
  }
  marks_array.shift();

  //----------rooms:
  const rooms_array = Array(1).fill(Array(5).fill(0));
  const rooms = Array(1).fill(Array(5).fill(0));
  rooms.push(["Room Name", "Level", "Number", "Chosen Property", "Id"]);
  for (const element of elements) {
    if (element.properties.length >= 3) {
      // for(var j=0;j<element.properties.length;j++){

      if (
        element.properties.find((p) => p.displayName == "Category")
          ?.displayValue != undefined &&
        element.properties[0].displayValue == "Revit Rooms"
      ) {
        if (
          element.properties.find((p) => p.displayCategory === "Constraints")
            ?.displayValue == levelName ||
          levelName == "Select All Levels"
        ) {
          const rooms_name = element.properties.find(
            (p) => p.displayName == "Name"
          )?.displayValue; //Type name
          const rooms_level = levelName; // level
          const rooms_id = element.dbId; //ID
          const rooms_area = element.properties.find(
            (p) => p.displayName == "Area"
          )?.displayValue; //Type name
          const rooms_number = element.properties.find(
            (p) => p.displayName == "Number"
          )?.displayValue; //Type name
          var chosenProperty = element.properties.find(
            (p) => p.displayName == property
          )?.displayValue; //Type name
          chosenProperty == undefined ? (chosenProperty = "None") : 0;
          rooms_array.push([
            rooms_name,
            rooms_level,
            1,
            chosenProperty,
            rooms_id,
          ]);
          rooms.push([
            rooms_name,
            rooms_level,
            rooms_number,
            chosenProperty,
            rooms_id,
          ]);
        }

        // break;
        // }
      }
    }
  }
  rooms.shift();
  var finel_room_names = instanceToSum(
    rooms_array,
    ["Room Name", "Room Level", "Count", "Room Area", "Id"],
    4,
    3,
    "area"
  );
  var finel_room_num = instanceToSum(
    rooms_array,
    ["Room Name", "Room Level", "Count", "Rooms Count", "Id"],
    4,
    3,
    "units"
  );
  var finel_room_types = [],
    rooms_count_by_type = [],
    rooms_id = [];
  finel_room_num.map((p) =>
    p[0] != "Room Name" ? finel_room_types.push(p[0]) : 0
  );
  finel_room_num.map((p) =>
    p[3] != "Rooms Count" ? rooms_count_by_type.push(p[3]) : 0
  );
  finel_room_names.map((p) => (p[4] != "Id" ? rooms_id.push(p[4]) : 0));
  var finel_histogram = [finel_room_types, rooms_count_by_type, rooms_id];

  return [marks_array, finel_room_names, finel_histogram, rooms];
  // return([histogram,ocurrence_histogram]);
}

//returns final array - headers should be the size of the columns amount. array needs to be at least in the size of 3
function instanceToSum(array, headers, id_index, arrSize, chart_purpose) {
  array.shift();
  var final_arr = Array(1).fill(Array(arrSize).fill(0));
  var units_count = 0; //represents the number of unitsof grills
  var IdArray = []; // list of id for each grill
  var idArrayOdArrays = [];
  var areas = 0;
  array.sort();
  if (array.length == 1) {
    chart_purpose == "units"
      ? final_arr.push([
          array[0][0],
          array[0][1],
          array[0][2],
          1,
          array[0][id_index],
        ])
      : final_arr.push([
          array[0][0],
          array[0][1],
          1,
          array[0][4],
          array[0][id_index],
        ]);
  } else {
    for (var i = 1; i < array.length; i++) {
      //check if array[i][4] is number or char:
      if (isNaN(array[i][4])) {
        array[i][4] = 0;
      }
      //check if the i and the (i-1) elements in the SORTED ARRAY are the same. if so: add 1 unit to the count. if not: make new final array row

      if (
        array[i][0] == array[i - 1][0] &&
        array[i][1] == array[i - 1][1] &&
        i != array.length - 1
      ) {
        // if type and level is the same then :
        if (i == 1) {
          //first itertation
          units_count += 2;
          IdArray.push(array[i][id_index]);
          IdArray.push(array[i - 1][id_index]);
          chart_purpose == "area"
            ? (areas += array[i - 1][4] + array[i][4])
            : (areas += 0);
        } else {
          units_count += 1;
          IdArray.push(array[i][id_index]);
          chart_purpose == "area" ? (areas += array[i][4]) : (areas += 0);
        }
      } else {
        // if the current type or level is not equal to the former, it is a new one. or if we are  in the last iteration
        //close the former collection (of (i-1) index)
        if (
          array[i][0] == array[i - 1][0] &&
          array[i][1] == array[i - 1][1] &&
          i == array.length - 1
        ) {
          // we are at the last iteration, and the level and type are the same
          units_count += 1;
          IdArray.push(array[i][id_index]);
          chart_purpose == "area" ? (areas += array[i][4]) : (areas += 0);
        } else if (array[i][1] == array[i - 1][1] && i == array.length - 1) {
          // covers the case of last item is from the correct level, but from new type
          units_count += 1;
          IdArray.push(array[i][id_index]);
          chart_purpose == "area" ? (areas += array[i][4]) : (areas += 0);
        }
        chart_purpose == "area" ? (array[i - 1][4] = areas) : 0;

        chart_purpose == "units"
          ? final_arr.push([
              array[i - 1][0],
              array[i - 1][1],
              array[i - 1][2],
              units_count,
              IdArray,
            ])
          : final_arr.push([
              array[i - 1][0],
              array[i - 1][1],
              units_count,
              array[i - 1][4],
              IdArray,
            ]);
        units_count = 1; // start new count for the new index
        IdArray = [array[i][id_index]]; // start new collection of dbIds
        areas = array[i][4];
      }
    }

    //remove first array of [0,0,0,0,] from array
    final_arr.shift();
    final_arr.unshift(headers); // add first row with names for the dataTable
  }

  return final_arr;
}

function sumOfParameter(array, index) {
  //array is the array you want to sum one of its columns
  //index is the column array
  var sumParameter = 0;
  var countUnits = 1;
  for (var i = 1; i < array.length; i++) {
    if (!isNaN(array[i][index])) {
      // IF IT IS A NUMBER- ADD IT TO THE SUM
      isNaN(array[i][index - 1])
        ? (countUnits = 1)
        : (countUnits = array[i][index - 1]); // if it is the units table(thus the "count" column is a number) give its value to countUnits parameter
      sumParameter += array[i][index];
    }
  }
  return parseFloat(sumParameter.toFixed(2));
}

async function arraySimplify(
  elements,
  levelName,
  property,
  obj,
  areaArray,
  _callback
) {
  //-->obj is an object that contains what i explaind above, and _callback has come here from powerBI report and contains the data about
  var arr = obj["quantities"]["Family"]; // this is a list of categories in the project by name
  const histo = await getProps(elements, levelName, property); // histo=marks_array,finel_room_names,finel_histogram,rooms
  arr.sort(); //sort by category names ( list of sorted category names, FOR EACH INSTANCE OF ELEMENT IN THE MODEL!)
  var object = obj;
  const marksArray = histo[0]; //matrix of marks instances with the following rows: mark_category,mark_level,mark_value,type_name,mark_id
  var roomNamesArray = histo[1]; // matrix of rooms :"Room Name","Room Level","Count","Room Area","Id"
  var roomHistogram = histo[2]; //rooms histogram for future calculations(?) containing room types, count by types and ids.
  const rooms = histo[3];
  object["Elements"]["Marks"] = marksArray; // the rest of the elements from the current floor
  object["Elements"]["roomsMatrix"] = roomNamesArray; // the rest of the elements from the current floor
  object["Elements"]["rooms"] = rooms; // the rest of the elements from the current floor
  object["Elements"]["roomHistogram"] = roomHistogram; // the rest of the elements from the current floor
  console.log("Quantities Data Loaded");

  _callback(object);
}

//new asynced function 05.01.23 takes time
async function areaCalculator(levelName, selectedArea) {
  return new Promise((resolve, reject) => {
    totalLevelArea = Array(1).fill(Array(5).fill(0));
    viewer.model.search(selectedArea, async function (dbIds) {
      // Assign the dbIds array to the dbids variable
      dbids = dbIds;

      // Retrieve the properties of the elements
      viewer.model.getBulkProperties(
        dbids,
        {
          propFilter: ["Level", "Area", "Name"],
        },
        async function (elems) {
          // Filter the properties based on the "Category" property

          for (const ele of elems) {
            const areaPart = ele.properties.find((p) =>
              p != undefined ? p.displayName == "Area" : 0
            )?.displayValue;
            const areaType = ele.properties.find((p) =>
              p != undefined ? p.displayName == "Name" : 0
            )?.displayValue;
            const areaLevel = ele.properties.find((p) =>
              p != undefined
                ? p.displayName == "Level" && p.displayCategory == "Constraints"
                : 0
            )?.displayValue;
            if (selectedArea == "----Select Area ----") {
              break;
            } else if (
              ele.properties.length > 3 &&
              areaPart != undefined &&
              areaType != undefined &&
              areaLevel != undefined
            ) {
              const currentLevel = ele.properties.find(
                (p) =>
                  p.displayName.includes("Level") &&
                  p.displayCategory === "Constraints"
              )?.displayValue;
              if (
                currentLevel == levelName ||
                (currentLevel != undefined && levelName == "Select All Levels")
              ) {
                const areaUnit = 1;
                const areaElementId = ele.dbId;
                totalLevelArea.push([
                  areaType,
                  areaLevel,
                  areaUnit,
                  areaElementId,
                  areaPart,
                ]);
              }
            }
          }

          totalLevelArea.shift();
          var final_area = [];
          final_area.push(["Area Name", "Area Level", "Count", "Area"]);
          totalLevelArea.map((p) => final_area.push([p[0], p[1], p[2], p[4]]));
          var sumOfArea = 0;
          var sumOfAreaCount = totalLevelArea.length;
          totalLevelArea.map((p) => (sumOfArea += p[4]));
          final_area.push([
            "Total Area:",
            sumOfArea,
            "Areas Count:",
            sumOfAreaCount,
          ]);
          resolve(final_area);
        }
      );
    });
  });
}

//29.10.22
//find level names
function FindLevelNames(elements) {
  var levelNames = [];
  for (var i = 0; i < elements.length; i++) {
    for (var j = 0; j < elements[i].properties.length; j++) {
      //FIND LEVELS
      if (
        elements[i].properties[j].displayCategory == "Constraints" &&
        !levelNames.includes(elements[i].properties[j].displayValue) &&
        (elements[i].properties[j].attributeName == "Reference Level" ||
          elements[i].properties[j].attributeName == "Level") &&
        elements[i].properties[j].displayValue != "" &&
        elements[i].properties[j].displayValue != "None"
      ) {
        levelNames.push(elements[i].properties[j].displayValue);
      }
      // console.log("the list of level names is: " + levelNames);
    }
  }
  levelNames.push("Select All Levels"); // adds the option of selecting all of the levels

  return levelNames;
}

async function onChangeLevel(
  levelName,
  property,
  flowCoefficient,
  areaArray,
  isDoorDashboard
) {
  console.log("Geometry Updated");
  // Get the model object
  //  var areaArray=await areaCalculator(levelName);// 05.01.23 passes area array from here
  var model = viewer.model;
  var propertyFilterArray = [
    "Category",
    "System Classification",
    "System Type",
    "Area",
    "Reference Level",
    "Level",
    "Type Name",
    "Size",
    property,
    "Length",
    "Revit Walls",
    "Base Constraint",
    "Comments",
    "Schedule Level",
    "Name",
    "Area Type",
    "Mark",
    "Number",
  ];
  if (isDoorDashboard == "button06") {
    propertyFilterArray = [
      "Category",
      "Level",
      "Type Name",
      "Size",
      property,
      "Name",
      "גמר כנף",
      "גמר משקוף",
      "ידית חוץ",
      "סוג מנעול",
      "Manufacturer",
      "ידית פנים",
      "יצרן",
      "בקרה",
      "סוג מנעול",
      "נעילה",
      "מספר דלת",
      "דרישה אקוסטית",
      "דלת אש",
      "דלת מילוט",
      "דלת עשן",
      "ידית בהלה",
      "Width",
      "Height",
    ];
  }

  return new Promise((resolve, reject) => {
    findLeafNodes(model).then((dbIds) => {
      new Promise((resolve, reject) => {
        viewer.model.getBulkProperties(
          dbIds,
          {
            propFilter: propertyFilterArray,
          },
          async function (elements) {
            await getListCategories(elements, async function (cateElem) {
              await arraySimplify(
                elements,
                levelName,
                property,
                cateElem,
                areaArray, //05.01.23 added this to pass array from here
                function (object) {
                  modData.quantities = object.quantities;
                  modData.Elements = object.Elements;
                  modData.elem = object.Elements.ele;
                  modData["Load"] = "Done";
                }
              );
            });
            resolve();
          }
        );
      }).then(() => {
        DashBoardColors = generateColorsRandom();

        resolve(modData);
      });
    });
  });
}
//29.10.22
