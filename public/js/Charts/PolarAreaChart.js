function createPolarChart(Name, Title, input){
    var _this = this;
    
    input==undefined?input = [["No Floors Apeared"],[0],[0]]:0;
    var id_elements = input[2];
    var data = {
      datasets: [{   
        data: input[1],
        backgroundColor: DashBoardColors.background.slice(0, input[1].length),
        borderColor: DashBoardColors.background.slice(0, input[1].length),
        borderWidth: 1,
      }],   // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: input[0]
    };
  
    var ctx = document.getElementById(Name);
    var myDoughnutChart = new Chart(ctx, {
      backgroundColor: "transparent",
      type: 'pie',
      data: data,
      options: {
        cutoutPercentage: 0,
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            gridLines: {
              display:false
            },
            ticks: {
              display: true
            },
            display: false
          }],
          yAxes: [{
            gridLines: {
              display:false
            },
            display: false
          }]
        },
        title: {
          display: true,
          text: Title,
          wrap: true,
          maxWidth: 25,
        },
        legend: {
          display: false,
         
          labels: {
            usePointStyle: true,
            text: "Hello World",
            fontColor: "black",
            fontSize: 15,
          },
          position: "bottom",
         
        },
        'onClick': function (evt, items) {
            if (items.length === 1) {
                const index = items[0]._index;
                const dbids = id_elements[index];
                const red =  new THREE.Color(1,0,0);
                _this.viewer.clearSelection();
                _this.viewer.setSelectionColor(red,Autodesk.Viewing.SelectionType.OVERLAYED );
                _this.viewer.select(dbids);
                _this.viewer.isolate(dbids);
                _this.viewer.fitToView(dbids);
            }
        },
        
      }
    });
}