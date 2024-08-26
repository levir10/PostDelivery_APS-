

//Buttons
function switchButton(buttonName){

  //update canvases
  if(buttonName=="button01"){//מיזוג אוויר

  }
  else if(buttonName=="button11"){//  קירות זכוכית ומחיצות גבס 


  }else if(buttonName=="button02"){//חשמל
    var _this = this;


  }
  else if(buttonName=="button03"){//חשמל
    var _this = this;


  }
  else if(buttonName=="button05"){//חדרים
    var _this = this;


  }
  else if(buttonName=="button06"){//דלתות
    var _this = this;

    

  }
  else if(buttonName=="button08"){//ריצופים
    var _this = this;


  }

   


  var buttons = document.getElementById("containerButtons").childNodes;
  for (i = 0; i < buttons.length; i++) {
      if(buttons[i].id != buttonName)
      {
          buttons[i].style.background='white';
          buttons[i].style.color='#2d2d2d';
      }
      else
      {
          buttons[i].style.background='#2d2d2d';
          buttons[i].style.color='white'
      }
  } 



}



async function Quantities(input){// i turned Quantities to async at 1/11/22
  var _this = this;
  removeParentContent(["row01","col01","col02","col03","col04","row004"]);//removes all the children of the inserted parent array
  updateCanvas(["position03","position02","position01"],["col02","col04","col01"]);//position03->circuits; position02->fixtures;position01->fixtures;position04->cabletrays
  createUniversalBarChart('position03',"Rooms Area By Name[m²]",modData.Elements.roomsMatrix);
  createPolarChart('position01',"Rooms count by name",modData.Elements.roomHistogram);
  createDataChart('#dataTable',modData.Elements.rooms,_this);
  createDataChart('#dataTable3',modData.Elements.Marks,_this);
  updateDataTable(["dataTable","dataTable2","dataTable3"],["row01","row004","row01"]);
  document.getElementById("id-select-prop").style.visibility= "visible";
  document.getElementById("id-select-area").style.visibility= "visible";


}



//--------------------------------------------------------------------------
  


//update tables by deleting the old table content, and inserting new content       
function updateDataTable(table_id,parentElement_id,table_width){//table_id -->string name. parentElement_id-->string name of row, table_width--> string of number in precentage like "50%"

  for(var i=0;i<table_id.length;i++){

    var dataTableDOM = document.getElementById(table_id[i]);
    //first table
      if(dataTableDOM!=undefined){
          if(dataTableDOM.parentElement.id != parentElement_id[i])
          {
              var firstRowChild = document.getElementById(parentElement_id[i]).firstChild;
              firstRowChild.remove();
          }
          else{
              dataTableDOM.remove();
          }
      }
 
      var row = document.getElementById(parentElement_id[i]);
      //Add data table
      const table = document.createElement("table");
      table.setAttribute("id", table_id[i]);
      table.classList.add("display");
      table.style.width = "50%";
      row.appendChild(table);

  }
         
}
// update chart canvases by deleting the old canvas, and updating the new one
function updateCanvas(canvas_id,parentElement_id){// canvas_id-->string of canvas id like "position04" . parentElement_id--> the id string of the parent element "col01"
  
  for(var i=0;i<canvas_id.length;i++){
    if(document.getElementById(canvas_id[i])!=undefined){
      document.getElementById(canvas_id[i]).remove();//make sure the canvas is removed
    }
     //update canvas
     var col = document.getElementById(parentElement_id[i]);
  
     const canvas = document.createElement("canvas");
     canvas.setAttribute("id", canvas_id[i]);
     canvas.classList.add("canvasfill");
     col.appendChild(canvas);

  }
 
}



function removeParentContent(listOfParents){// removes the children of all the parent element list 

  for(const parentId of listOfParents){
    if(document.getElementById(parentId)!=undefined){
      document.getElementById(parentId).replaceChildren();
      
    }
  }
  document.getElementById("id-select-prop").style.visibility= "hidden";// hide the property selection from HVAC dashboard
  document.getElementById("id-select-flow").style.visibility = "hidden";// hide the flow selection from HVAC dashboard
  document.getElementById("id-select-area").style.visibility = "hidden";// hide the flow selection from HVAC dashboard
}