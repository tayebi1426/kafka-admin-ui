import React, {useEffect, useState} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';

import {MultiSelect} from 'primereact/multiselect';
import {Dropdown} from 'primereact/dropdown';

import {Button, Card, CardActionArea, CardContent, Grid, IconButton, TextField, Toolbar} from "@material-ui/core";
import {DeleteForeverSharp} from "@material-ui/icons";
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import AddBoxIcon from '@material-ui/icons/AddBox';
import KafkaClientService from '../services/KafkaClientService'


import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import DeleteAclConfirm from "./DeleteAclConfirm";


const KAFKA_RESOURCE_TYPE = [
    {label: 'TOPIC', value: 'TOPIC'},
    {label: 'GROUP', value: 'GROUP'},
    {label: 'TRANSACTION', value: 'TRANSACTIONAL_ID'},
    {label: 'CLUSTER', value: 'CLUSTER'}
]
const KAFKA_PATTERN_TYPE = ['PREFIXED', 'LITERAL']

function KafkaAclList(props) {
    let {history} = props;
    console.log('props > ', props)
    let dataTableRef;
    const [rowData, setRowData] = useState([]);
    const [showDeleteAclConfirm, setShowDeleteAclConfirm] = useState(false);
    const [selectedResourceType, setSelectedResourceType] = useState();
    const [selectedPatternType, setSelectedPatternType] = useState();
    const [globalFilter, setGlobalFilter] = useState();
    const fetchAclList = () => {
        KafkaClientService.getAclList().then(data => {
            data.forEach((item, index) => {
                item.id = index
            })
            setRowData(data)
        })
    }
    useEffect(() => {
        fetchAclList();
    }, [])
    let actionBodyTemplate = (rowData) => {
        return (
            <IconButton aria-label="upload picture" size="medium" color="secondary" variant="contained" onClick={() => {
                setShowDeleteAclConfirm(true)
            }}><DeleteForeverSharp/></IconButton>
        );
    };
    let changeResourceTypeFilter = (opt) => {
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
            <Grid container spacing={4}>
                <Grid item={true} lg={4}>
                    <TextField variant="outlined" value={globalFilter}
                               onChange={(e) => setGlobalFilter(e.target.value)}
                               placeholder="Global Search"/>

                    <Button endIcon={<RotateLeftIcon/>}
                            label="Clear" color="primary" variant="contained"
                            icon="pi pi-filter-slash"
                            onClick={restDataTableFilter} style={{margin: '0 1em'}}>Reset Filter</Button>
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
        <DeleteAclConfirm open={showDeleteAclConfirm}
                          handleClose={() => setShowDeleteAclConfirm(false)}
                          handleConfirm={() => {
                              setShowDeleteAclConfirm(false)
                              KafkaClientService.deleteAclEntry(rowData).then((r) => {
                                  fetchAclList();
                              });
                          }}/>
        <CardActionArea>
            <Toolbar>
                <Button color="primary" variant="contained" startIcon={<AddBoxIcon/>} onClick={(e) => {
                    history.push("/acl/add")
                }}>Add Acl</Button>
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
                <Column field='resourceName' header='resourceName' width={300} filter={true} sortable
                        filterMatchMode="contains"/>
                <Column field='resourceType' header='resourceType' width={300} filter={true}
                        filterElement={resourceTypeFilter} filterPlaceholder="Choose resourceTypes"/>
                <Column field='patternType' header='patternType' width={300} filter={true}
                        filterElement={patternTypeFilter}/>
                <Column field='operations' header='operations' body={({operations}) => {

                    return <div>
                        {operations.reduce((i1, i2) => i1 + ", " + i2)}
                    </div>;

                }} width={500} filter={true}/>
                <Column body={actionBodyTemplate}
                        headerStyle={{width: '8em', textAlign: 'center'}}
                        bodyStyle={{textAlign: 'center', overflow: 'visible'}}/>

            </DataTable>
        </CardContent>
    </Card>
}

export default KafkaAclList