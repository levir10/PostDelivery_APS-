function createUniversalBarChart(name, title, input){// name of the id of canvas, title  of the chart, input= ["type","level","","area","id"]
    var _this = this;
    var ctx = document.getElementById(name);
    var dataToolTips = [];
    // var unitToolTips = [];

    // input.data!=undefined?input.data.map(p=>dataToolTips.push(p.toFixed(2))):0;
    var myLabels =[];//labels (names of columns)
    var id_elements = [];
    input.map(p=>myLabels.push(p[0]));
    myLabels.shift();
    var myData=[];// y values for each label (numbers)
    input.map(p=>myData.push(p[3]) && id_elements.push(p[4]));
    // input.map(p=>!isNaN(p[2])?unitToolTips.push(p[2]):0);
    myData.shift();//get the fucking header off
    id_elements.shift();//get the fucking header off
    myData.map(p=>typeof(p)=='number'?dataToolTips.push(p.toFixed(2)):0);

    
    var data = {
        labels: myLabels,//try histogram  keys?
        datasets: [{
            label:'Amount:',
            data: dataToolTips,//try  histogram values
            backgroundColor: DashBoardColors.background.slice(0, myData.length),// histogram length
            borderColor: DashBoardColors.background.slice(0, myData.length),//"" " """
            borderWidth: 1

        }]
    };

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            hover: {
                animationDuration: 1000, // duration of animations when hovering an item.
                easing: "easeOutQuart"
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:false
                    },
                    ticks: {
                        display: true
                    },            
                }],
                yAxes: [{
                    gridLines: {
                        display:false
                    },
                }]
            },
            title: {
                display: true,
                text: title
            },
            legend: {
                display: false
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
            hover: {
                onHover: function(e){
                    var point = myChart.getElementAtEvent(e);
                    if (point.length) e.target.style.cursor = 'pointer';
                    else e.target.style.cursor = 'default';
                    
                }
            },
        },
    });

    
}

