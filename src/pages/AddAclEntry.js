import React, {useState} from 'react';
import {
    Button,
    Card,
    CardActionArea,
    CardContent,
    Checkbox,
    FormControlLabel,
    FormLabel,
    Grid,
    MenuItem,
    Radio,
    RadioGroup,
    TextField,
    Toolbar
} from '@material-ui/core'
import {useFormik} from "formik";

const validateAclEntry = (values) => {
    const errors = {};
    if (!values.email) {
        errors.email = 'Required';
    } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
    ) {
        errors.email = 'Invalid email address';
    }
    return errors;
}
const saveAclEntry = (values) => {
    console.log(JSON.stringify(values, null, 2));
}

function AddAclEntry() {
    let [clientGroup, setClientGroup] = useState('PRODUCER');
    let [aclEntry, setAclEntry] = useState({});

    const formik = useFormik({
        initialValues: {patternType: 'PREFIXED', topicName: '', groupName: ''},
        onSubmit: saveAclEntry
    })
    return <Card className='root'>
        <CardContent>
            <form onSubmit={formik.handleSubmit} onInvalid={event => console.error('invalid form ', event)}>
                <Grid container={true} spacing={4}>
                    <Grid item={true} xs={12}>
                        <FormLabel component="legend">Client Group</FormLabel>
                        <RadioGroup aria-label="clientGroup"
                                    name="clientGroup"
                                    value={clientGroup}
                                    onChange={e => setClientGroup(e.target.value)}>
                            <FormControlLabel value="PRODUCER" control={<Radio/>} label="Producer"/>
                            <FormControlLabel value="CONSUMER" control={<Radio/>} label="Consumer"/>
                        </RadioGroup>
                    </Grid>
                </Grid>
                <Grid style={{marginTop: '2em'}} container={true} spacing={8}>
                    <Grid item={true} xs={12}>
                        <TextField name="patternType" select={true} label="Pattern Type" required={true}
                                   variant="outlined"
                                   fullWidth={true} value={formik.values.patternType} onChange={formik.handleChange}>
                            <MenuItem value='PREFIXED'>PREFIXED</MenuItem>
                            <MenuItem value='LITERAL'>LITERAL</MenuItem>
                        </TextField>
                    </Grid>

                    <Grid item={true} xs={12}>
                        <TextField name='topicName' label='Topic Name' required={true} variant="outlined"
                                   fullWidth={true} value={formik.values.topicName} onChange={formik.handleChange}/>
                    </Grid>

                    {clientGroup === 'PRODUCER' ? <AddProducerAcl/> : <AddConsumerAcl/>}

                    <Grid item={true} xs={12}>

                        {/*   <Select
                                label="Age"
                                value={null}
                                fullWidth={true}
                                variant="outlined">
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>*/}
                    </Grid>
                </Grid>
                <Toolbar>
                    <Button variant="contained" color="primary" type="submit">save</Button>
                    <Button variant="contained" color="secondary">discard</Button>
                </Toolbar>
            </form>

        </CardContent>
        <CardActionArea>

        </CardActionArea>
    </Card>
}


function AddProducerAcl() {
    return <React.Fragment>
        <Grid item={true} xs={12}>
            <FormControlLabel control={<Checkbox name="hasTransaction" checked={false}/>}
                              label="transaction is required?"
                              labelPlacement="start" variant="outlined"/>
        </Grid>
    </React.Fragment>
}

function AddConsumerAcl() {
    return <React.Fragment>
        <Grid item={true} xs={12}>
            <TextField name='groupName' label='Group Name' required={true} variant="outlined" fullWidth={true}/>
        </Grid>
    </React.Fragment>
}

export default AddAclEntry