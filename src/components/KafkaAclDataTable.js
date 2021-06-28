import React, {useState} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button, Grid, IconButton, TextField} from "@material-ui/core";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import {MultiSelect} from "primereact/multiselect";
import {Dropdown} from "primereact/dropdown";
import {DeleteForeverSharp} from "@material-ui/icons";

import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'


const KAFKA_RESOURCE_TYPE = [
    {label: 'TOPIC', value: 'TOPIC'},
    {label: 'GROUP', value: 'GROUP'},
    {label: 'TRANSACTION', value: 'TRANSACTIONAL_ID'},
    {label: 'CLUSTER', value: 'CLUSTER'}
]
const KAFKA_PATTERN_TYPE = ['PREFIXED', 'LITERAL']

function KafkaAclDataTable({rowData, onDeleteAclEntry}) {
    let dataTableRef;
    const [selectedResourceType, setSelectedResourceType] = useState();
    const [selectedPatternType, setSelectedPatternType] = useState();
    const [globalFilter, setGlobalFilter] = useState('');

    let actionBodyTemplate = (rowData) => {
        return <IconButton style={{padding: 0}} onClick={() => onDeleteAclEntry(rowData)}>
            <DeleteForeverSharp  color="secondary"/>
        </IconButton>
    }
    let changeResourceTypeFilter = (opt) => {
        setSelectedResourceType(opt)
        dataTableRef.filter(opt, 'resourceType', 'in')
    }
    const restDataTableFilter = () => {
        setSelectedResourceType(null)
        setSelectedPatternType(null)
        setGlobalFilter('')
        dataTableRef.reset();
    }

    const resourceTypeFilter = <MultiSelect value={selectedResourceType}
                                            options={KAFKA_RESOURCE_TYPE}
                                            onChange={e => changeResourceTypeFilter(e.value)}
                                            optionLabel="label"
                                            optionValue="value"
                                            placeholder="All"
                                            className="p-column-filter"/>;
    const patternTypeFilter = <Dropdown options={KAFKA_PATTERN_TYPE}
                                        value={selectedPatternType}
                                        onChange={e => {
                                            dataTableRef.filter(e.value, 'patternType', 'equals')
                                            setSelectedPatternType(e.value)
                                        }}
                                        placeholder="Select a Pattern"
                                        className="p-column-filter"
                                        showClear/>;
    return <DataTable
        value={rowData}
        ref={(el) => dataTableRef = el}
        rows={10}
        header={<DataTableHeader globalFilter={globalFilter} onChangeGlobalFilter={setGlobalFilter}
                                 restFilter={restDataTableFilter}/>}
        globalFilter={globalFilter}
        emptyMessage="No customers found"
        className="p-datatable-customers"
        dataKey="id"
        paginator={true}
        rowHover={true}
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}>
        <Column field='principal' header='principal' width={300} filter={true} sortable
                filterMatchMode="contains"
                filterPlaceholder="Search by username"/>
        <Column field='resourceName' header='resourceName' width={300} filter={true} sortable
                filterMatchMode="contains"/>
        <Column field='resourceType' header='resourceType' width={300} filter={true}
                filterElement={resourceTypeFilter} filterPlaceholder="Choose resourceTypes"/>
        <Column field='patternType' header='patternType' width={300} filter={true}
                filterElement={patternTypeFilter}/>
        <Column field='operations' header='operations'
                width={500} filter={true}
                body={({operations}) => {
                    return <div>
                        {operations.reduce((i1, i2) => i1 + "; " + i2)}
                    </div>;
                }}/>
        <Column body={actionBodyTemplate}
                header="Actions"
                headerStyle={{width: '6em', textAlign: 'center'}}
                bodyStyle={{textAlign: 'center'}}/>

    </DataTable>
}

function DataTableHeader({globalFilter, onChangeGlobalFilter, restFilter}) {
    return <div className="table-header">
        <Grid container spacing={2}>
            <Grid item={true}>
                <TextField variant="outlined"
                           value={globalFilter}
                           onChange={(event) => {
                               //setSearchTerm(event.target.value)
                               onChangeGlobalFilter(event.target.value)
                           }}
                           placeholder="Global Search"/>
            </Grid>
            <Grid item={true}>
                <Button endIcon={<RotateLeftIcon/>}
                        label="Clear"
                        color="primary"
                        variant="contained"
                        icon="pi pi-filter-slash"
                        onClick={restFilter}
                >Reset Filter</Button>
            </Grid>
        </Grid>
    </div>
}

export default KafkaAclDataTable