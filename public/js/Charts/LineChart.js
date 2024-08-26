function createLineChart(name, title, input){
    // var _this = this;
    
    // var ctx = document.getElementById(name);

    
    // var data = {
    //   labels: input.xReference,
    //   datasets: [
    //   ]
    // };

    // var cumulativeSum = (sum => value => sum += value)(0);

    // for(var i=0; i<input.labels.length; i++){
    //   data.datasets[i] = {
    //     label: input.labels[i],
    //     data: input.data[input.labels[i]].map(cumulativeSum)
    // };
    //   data.datasets[i].borderColor = DashBoardColors.background[i + 4]
    //   data.datasets[i].fill = false;
    //   cumulativeSum = (sum => value => sum += value)(0);
    // }
    var _this = this;
    var ctx = document.getElementById(name);
    var dataToolTips = [];
    // input.data!=undefined?input.data.map(p=>dataToolTips.push(p.toFixed(2))):0;
    var myLabels =[];//labels (names of columns)
    var id_elements = [];
    input.map(p=>myLabels.push(p[0]));
    myLabels.shift();
    var myData=[];// y values for each label (numbers)
    input.map(p=>!isNaN(p[3])?myData.push(p[3]) && id_elements.push(p[4]):0);
    myData.shift();//get the fucking header off
    id_elements.shift();//get the fucking header off
    myData.map(p=>typeof(p)=='number'?dataToolTips.push(p.toFixed(2)):0);
    
    // input.map(p=>p[4]!='Id'?id_elements.push(p[4]):0);
    
    var data = {
        labels: myLabels,//try histogram  keys?
        datasets: [{
            label:'Amount:',
            data: dataToolTips,//try  histogram values
            backgroundColor: DashBoardColors.background.slice(0, myData.length),// histogram length
            borderColor: DashBoardColors.background.slice(0, myData.length),//"" " """
            borderWidth: 3,
            pointRadius:6,
            tension: 0.1
            
        }]
    };


    var stackedLine = new Chart(ctx, {
        type: 'line',
        data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: { 
              position: 'top',
              labels: {
                       boxWidth: 10,
                       fontSize: 8
                     } 
                    },
            elements: {
                point: {
                    pointStyle: 'circle',
                },
                line: {
                    tension: 0
                }
            },
            title: {
              display: true,
              text: title
            },
            scales: {
                yAxes: [{
                    ticks: {
                        stacked: true,
                        beginAtZero: true,
                        callback: function (value) { if (value % 1 === 0) { return value; } },
                        suggestedMax: 4.1,
                        // display: false //this will remove only the label
                    }
                }],
                xAxes: [{ gridLines: { display: false } }]
            },
            'onClick': function (evt, items) {
              // GraphOnClick(input.elements, _this, item);
              
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


