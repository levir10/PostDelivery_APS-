function createDoorListDataChart(name,input,_this){
    var dataTableIdName = document.getElementById(name);//'#dataTable' or wharever name there is for a table id
    var dataSet = input.map(i=>i.slice(0,16));
    var dataBase = input
    $(document).ready(function() {
        $(name).DataTable( {
            data: dataSet,
            data_base:dataBase,
            columns: [
                { title: "Door Type" },
                { title: "Level"},
                { title: "Door Number" },
                { title: "גמר כנף" },
                { title: "גמר משקוף" },
                { title: "ידית חוץ" },
                { title: "ידית פנים" },
                { title: "יצרן" },
                { title: "בקרה" },
                { title: "נעילה" },
                { title: "דלת אש" },
                { title: "דלת עשן" },
                { title: "מילוט" },
                { title: "ידית בהלה" },
                { title: "רוחב" },
                { title: "גובה" },
               
             
                
            ],
            columnDefs: [
             {
                 targets: '_all',
                 className: 'dt-center'
             }
           ],
           "scrollY": '26vh',
           "scrollX": true,
            "bFilter": false,
            "ordering": false,
            "bInfo": false,
            "paging": false,
            "autoWidth": true
        } );
    
        var table = $(name).DataTable();  
   
        $(name + ' tbody').on( 'click', 'tr', function (evt, item) {
         //  alert( table.row( this ).data());
          const index =this._DT_RowIndex;
          const col=16;//column of the dbId arrays
          const dbids = dataBase[index][col];
          const red =  new THREE.Color(1,0,0);
          _this.viewer.clearSelection();
          _this.viewer.setSelectionColor(red,Autodesk.Viewing.SelectionType.OVERLAYED );
          _this.viewer.select(dbids);
          _this.viewer.isolate(dbids);
          console.log(dbids);
          _this.viewer.fitToView(dbids);
      
       
        });
    
    
    
       } );
}

