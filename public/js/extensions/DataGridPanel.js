const DATAGRID_CONFIG = {
    requiredProps: ['name', 'Category', 'Level','manufacturer','mark','variable'], // Which properties should be requested for each object
    columns: [ // Definition of individual grid columns (see http://tabulator.info for more details)
        { title: 'ID', field: 'dbid' },
        { title: 'קומה', field: 'level' },
        { title: 'שם במודל', field: 'name', width: 150 },
        { title: 'קטגוריה במודל', field: 'category', width: 150 },
        { title: 'יצרן', field: 'manufacturer', width: 150 },
        { title: 'קוד פריט', field: 'mark', width: 150 },
        { title:'Dropdown Filter', field: 'variable' },
        
    ],
    groupBy: 'level', // Optional column to group by
    createRow: (dbid, name, props) => { // Function generating grid rows based on recieved object properties
        const category = props.find(p => p.displayName === 'Category')?.displayValue;
        const level = props.find(p => p.displayName.includes('Level') && p.displayCategory === 'Constraints')?.displayValue;
        const mark = props.find(p => (p.displayName=="Mark"))?.displayValue;;
        const manufacturer = props.find(p => (p.displayName=="Manufacturer"))?.displayValue;;
        const  variable = props.find(p=>p.displayName===DATAGRID_CONFIG.requiredProps[DATAGRID_CONFIG.requiredProps.length-1])?.displayValue;
        
        return { dbid,level,name,category,mark,manufacturer,variable};
    },
    onRowClick: (row, viewer) => {
        const dbids = row.dbid;
        const red =  new THREE.Color(1,0,0);
        viewer.setSelectionColor(red,Autodesk.Viewing.SelectionType.OVERLAYED );
        viewer.clearSelection();
        viewer.setSelectionColor(red,Autodesk.Viewing.SelectionType.OVERLAYED );
        viewer.select([dbids]);
        viewer.isolate([dbids]);
        viewer.fitToView([dbids]);
    }
};

export class DataGridPanel extends Autodesk.Viewing.UI.DockingPanel {
    constructor(extension, id, title, options) {
        super(extension.viewer.container, id, title, options);
        this.extension = extension;
        this.container.style.left = (options.x || 0) + 'px';
        this.container.style.top = (options.y || 0) + 'px';
        this.container.style.width = (options.width || 1000) + 'px';
        this.container.style.height = (options.height || 400) + 'px';
        this.container.style.resize = 'none';
    }

    initialize() {
        this.title = this.createTitleBar(this.titleLabel || this.container.id);
        this.initializeMoveHandlers(this.title);
        this.container.appendChild(this.title);
        //--------------------------------------------10.10.22 ADDED THIS TI MAKE DYNAMIC TABLE - IF U DELETE, THE DROPDOWN WOULD BE REMOVED
        this.content = document.createElement('div');
        this.content.style.height = '30px';
        this.content.style.backgroundColor = 'white';
        this.content.innerHTML = `<div class="props-container" style="position: relative; height: 25px; padding: 0.5em;">
        <select class="props"></select>
         </div>`;
        this.select = this.content.querySelector('select.props');
        this.container.appendChild(this.content);
        //--------------------------------------------10.10.22 ADDED THIS TI MAKE DYNAMIC TABLE
        this.content = document.createElement('div');
        this.content.style.height = '350px';
        this.content.style.backgroundColor = 'white';
        this.content.innerHTML = `<div class="datagrid-container" style="position: relative; height: 350px;"></div>`;
        this.container.appendChild(this.content);
        // See http://tabulator.info
        this.table = new Tabulator('.datagrid-container', {
            height: '100%',
            layout: 'fitColumns',
            columns: DATAGRID_CONFIG.columns,
            groupBy: DATAGRID_CONFIG.groupBy,
            rowClick: (e, row) => DATAGRID_CONFIG.onRowClick(row.getData(), this.extension.viewer)
            
        });
    }

  
    update(model, dbids) {
        model.getBulkProperties(dbids, { propFilter: DATAGRID_CONFIG.requiredProps }, (results) => {
            this.table.replaceData(results.map((result) => DATAGRID_CONFIG.createRow(result.dbId, result.name, result.properties)));
        }, (err) => {
            console.error(err);
        });
    }

    setPropNames(model,propertyNames,dbids) { 
       
        this.select.innerHTML = propertyNames.map(prop => `<option style="color:gray" value="${prop}">${prop}</option>`).join('\n');// propertyNames ==category array ([Category, Area, name...])
        // const propArray= ['name', 'Category', 'Level','Area','Assembly Code','Assembly Description',this.select.value]
        //by using the .map() we loop on all the names in the array (using the "prop" variable) and filling the option  dropdown
        this.select.onchange = () =>this.dropdownUpdate(model,dbids,['name', 'Category', 'Level','manufacturer','mark',this.select.value]); // on change activates every time we change the dropdown name, or when first opening the extension
        // to o.updateChart() method we pass the model and the name of the property we chose ( by passing "this.select.value")
        // this.update(model, dbids);
    }
    dropdownUpdate(model, dbids,reqProp) {
        model.getBulkProperties(dbids, { propFilter: reqProp }, (results) => {
            DATAGRID_CONFIG.requiredProps = reqProp;
            this.table.replaceData(results.map((result) => DATAGRID_CONFIG.createRow(result.dbId, result.name, result.properties)));
        }, (err) => {
            console.error(err);
        });
    }
}
