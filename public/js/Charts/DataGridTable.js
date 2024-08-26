
function createDataChart(name, input, _this) {
    var dataTableIdName = document.getElementById(name);//'#dataTable' or wharever name there is for a table id
    var dataSet = input.map(i=>i.slice(0,4));
    var dataBase = input;
    $(document).ready(function() {
        // Create search box
        var searchBox = '<input type="text" id="'+name+'-search" placeholder="Search">';
        $(name+'_wrapper').prepend(searchBox);
        
        // Initialize DataTable with search box
        var table = $(name).DataTable({
            data: dataSet,
            data_base: dataBase,
            columns: [
                { title: dataSet[0][0] },
                { title: dataSet[0][1] },
                { title: dataSet[0][2] },
                { title: dataSet[0][3] }
            ],
            columnDefs: [
                {
                    targets: '_all',
                    className: 'dt-center'
                }
            ],
            "scrollY": '26vh',
            "scrollX": true,
            "bFilter": true, // Enable searching
            "ordering": false,
            "bInfo": false,
            "paging": false,
            "autoWidth": true
        });
    
        // Add event listener to search box
        $(name + '-search').on('keyup', function() {
            table.search($(this).val()).draw();
        });
    
        // Add row click event listener
        $(name + ' tbody').on('click', 'tr', function(evt, item) {
            const index = this._DT_RowIndex;
            const col = 4; //column of the dbId arrays
            const dbids = dataBase[index][col];
            const red = new THREE.Color(1, 0, 0);
            _this.viewer.clearSelection();
            _this.viewer.setSelectionColor(red, Autodesk.Viewing.SelectionType.OVERLAYED);
            _this.viewer.select(dbids);
            _this.viewer.isolate(dbids);
            console.log(dbids);
            _this.viewer.fitToView(dbids);
        });
    });
}
//----------------------------------------------
//NO SEARCH TABLES:
// function createDataChart(name,input,_this){
//     var dataTableIdName = document.getElementById(name);//'#dataTable' or wharever name there is for a table id
//     var dataSet = input.map(i=>i.slice(0,4));
//     var dataBase = input
//     $(document).ready(function() {
//         $(name).DataTable( {
//             data: dataSet,
//             data_base:dataBase,
//             columns: [
//                 { title: dataSet[0][0] },
//                 { title: dataSet[0][1] },
//                 { title: dataSet[0][2] },
//                 { title: dataSet[0][3] },
             
                
//             ],
//             columnDefs: [
//              {
//                  targets: '_all',
//                  className: 'dt-center'
//              }
//            ],
//            "scrollY": '26vh',
//            "scrollX": true,
//             "bFilter": false,
//             "ordering": false,
//             "bInfo": false,
//             "paging": false,
//             "autoWidth": true
//         } );
    
//         var table = $(name).DataTable();  
   
//         $(name + ' tbody').on( 'click', 'tr', function (evt, item) {
//          //  alert( table.row( this ).data());
//           const index =this._DT_RowIndex;
//           const col=4;//column of the dbId arrays
//           const dbids = dataBase[index][col];
//           const red =  new THREE.Color(1,0,0);
//           _this.viewer.clearSelection();
//           _this.viewer.setSelectionColor(red,Autodesk.Viewing.SelectionType.OVERLAYED );
//           _this.viewer.select(dbids);
//           _this.viewer.isolate(dbids);
//           console.log(dbids);
//           _this.viewer.fitToView(dbids);
      
       
//         });
    
    
    
//        } );
// }
//----------------------------------------------
