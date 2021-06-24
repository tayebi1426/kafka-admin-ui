import React, {useEffect, useState} from 'react';

import {Button, Card, CardContent, Toolbar} from "@material-ui/core";

import AddBoxIcon from '@material-ui/icons/AddBox';
import KafkaClientService from '../services/KafkaClientService'


import DeleteAclConfirm from "../components/DeleteAclConfirm";
import KafkaAclDataTable from "../components/KafkaAclDataTable";

function KafkaAclList(props) {
    let {history} = props;

    const [rowData, setRowData] = useState([]);
    const [currentRow, setCurrentRow] = useState(null);
    const [showDeleteAclConfirm, setShowDeleteAclConfirm] = useState(false);

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

    return <Card className="root">
        <DeleteAclConfirm open={showDeleteAclConfirm}
                          handleClose={() => setShowDeleteAclConfirm(false)}
                          handleConfirm={() => {
                              setShowDeleteAclConfirm(false)
                              KafkaClientService.deleteAclEntry(currentRow).then((r) => {
                                  setCurrentRow(null)
                                  fetchAclList();
                              });
                          }}/>
        <CardContent>
            <Toolbar>
                <Button color="primary" variant="contained" startIcon={<AddBoxIcon/>} onClick={(e) => {
                    history.push("/acl/add")
                }}>Add Acl</Button>
            </Toolbar>
            <KafkaAclDataTable rowData={rowData} onDeleteAclEntry={(row) => {
                setCurrentRow(row)
                setShowDeleteAclConfirm(true)
            }}
            />
        </CardContent>
    </Card>
}

export default KafkaAclList