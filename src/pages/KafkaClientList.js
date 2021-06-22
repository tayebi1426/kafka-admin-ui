import React,{useEffect, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Button} from 'primereact/button';
import {MultiSelect} from 'primereact/multiselect';
import {Dropdown} from 'primereact/dropdown';
import {InputText} from 'primereact/inputtext';
import {Card, CardActionArea, CardContent, Grid, Toolbar} from "@material-ui/core";
import KafkaClientService from '../services/KafkaClientService'


import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'


const KAFKA_RESOURCE_TYPE = [
    {label: 'TOPIC', value: 'TOPIC'},
    {label: 'GROUP', value: 'GROUP'},
    {label: 'TRANSACTION', value: 'TRANSACTIONAL_ID'},
    {label: 'CLUSTER', value: 'CLUSTER'}
]
const KAFKA_PATTERN_TYPE = ['PREFIXED', 'LITERAL']

function KafkaClientList(props) {
    let {history} = props;
    console.log('props > ', props)
    let dataTableRef;
    const [rowData, setRowData] = useState([]);
    const [selectedResourceType, setSelectedResourceType] = useState();
    const [selectedPatternType, setSelectedPatternType] = useState();
    const [globalFilter, setGlobalFilter] = useState();
    useEffect(() => {
        KafkaClientService.getAclList().then(data => {
            data.forEach((item, index) => {
                item.id = index
            })
            setRowData(data)
        })
    }, [])
    let actionBodyTemplate = () => {
        return (
            <Button type="button" icon="pi pi-cog" className="p-button-secondary"/>
        );
    };
    let changeResourceTypeFilter = (opt) => {
        console.log('selectedResource ', opt)
        setSelectedResourceType(opt)
        dataTableRef.filter(opt, 'resourceType', 'in')
    }
    const restDataTableFilter = () => {
        setSelectedResourceType(null)
        setSelectedPatternType(null)
        setGlobalFilter(null)
        dataTableRef.reset();
    }
    const header = (
        <div className="table-header">
            <Grid container>
                <Grid item={true} lg={2} >
                    <Button type="button" label="Clear" className="p-button-outlined" icon="pi pi-filter-slash"
                            onClick={restDataTableFilter}/>
                </Grid>
                <Grid item={true} lg={10}>
                    <div className="p-input-icon-left">
                        <i className="pi pi-search"/>
                        <InputText type="search" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)}
                                   placeholder="Global Search"/>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
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

    return <Card className="root">
        <CardActionArea>
            <Toolbar >
                <Button label="Add Acl" onClick={(e) => {
                    history.push("/clients/addAcl")
                }}/>
            </Toolbar>
        </CardActionArea>
<CardContent>
        <DataTable
            value={rowData}
            ref={(el) => dataTableRef = el}
            rows={10}
            header={header}
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
            <Column field='resourceType' header='resourceType' width={300} filter={true}
                    filterElement={resourceTypeFilter} filterPlaceholder="Choose resourceTypes"/>
            <Column field='patternType' header='patternType' width={300} filter={true}
                    filterElement={patternTypeFilter}/>
            <Column field='operations' header='operations' body={({operations}) => {

                return <div>
                    {operations.reduce((i1, i2) => i1 + ", " + i2)}
                </div>;

            }} width={500} filter={true}/>
            <Column body={actionBodyTemplate} headerStyle={{width: '8em', textAlign: 'center'}}
                    bodyStyle={{textAlign: 'center', overflow: 'visible'}}/>
        </DataTable>
</CardContent>
    </Card>
}

export default KafkaClientList