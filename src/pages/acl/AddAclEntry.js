import React, {useEffect, useState} from 'react';
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
import * as Yup from 'yup';
import KafkaClientService from '../../services/KafkaClientService.js'
import Typography from "@material-ui/core/Typography";

const aclEntryValidationSchema = Yup.object().shape({
    principal: Yup.string().required(),
    patternType: Yup.string().required(),
    topicName: Yup.string()
        .min(3, 'Too Short!')
        .max(50, 'Too Long!')
        .required('topicName is required'),
    hasTransaction: Yup.boolean().notRequired(),
    groupName: Yup.string()
        .min(3, 'Too Short!')
        .max(50, 'Too Long!')
        .notRequired()
})
const saveAclEntry = (history, values) => {
    console.log('history >> ', history);
    console.log(JSON.stringify(values, null, 4));
    KafkaClientService.addAclEntry(values).then(() => {
        history.push('/acl')
    })
}

function AddAclEntry({history}) {
    let [principalList, setPrincipalList] = useState([]);

    const formik = useFormik({
        initialValues: {
            principal: '',
            clientGroup: 'PRODUCER',
            patternType: 'PREFIXED',
            topicName: '',
            groupName: '',
            hasTransaction: false,
            transactionIdPrefix: ''
        },
        validateOnChange: true,
        validationSchema: aclEntryValidationSchema,
        onSubmit: saveAclEntry.bind(saveAclEntry, history)
    })
    useEffect(() => {
        KafkaClientService.getPrincipals().then(response => {
            setPrincipalList(response)
        })
    }, [])
    return <Card className='root'>
        <Typography variant="h3" component="h1">
            Add Acl Entry
        </Typography>

        <CardContent>
            <form onSubmit={formik.handleSubmit}>
                <Grid container={true} spacing={4}>
                    <Grid item={true} xs={12}>
                        <FormLabel component="legend">Client Group</FormLabel>
                        <RadioGroup aria-label="clientGroup"
                                    name="clientGroup"
                                    value={formik.values.clientGroup}
                                    onChange={formik.handleChange}>
                            <FormControlLabel value="PRODUCER" control={<Radio/>} label="Producer"/>
                            <FormControlLabel value="CONSUMER" control={<Radio/>} label="Consumer"/>
                        </RadioGroup>
                    </Grid>
                </Grid>
                <Grid container={true}>
                    <Grid item={true} lg={6}>
                        <Grid style={{marginTop: '2em'}}
                              container={true}
                              spacing={8}>
                            <Grid item={true} xs={12}>
                                <TextField name="principal"
                                           select={true}
                                           required={true}
                                           id="principal"
                                           label="principal"
                                           variant="outlined"
                                           fullWidth={true}
                                           value={formik.values.principal}
                                           onChange={formik.handleChange}>
                                    {
                                        principalList.map(p => {
                                            return <MenuItem key={p.subjectDn}
                                                             value={p.subjectDn}>{p.alias + ' >> ' + p.subjectDn}</MenuItem>
                                        })
                                    }
                                </TextField>
                            </Grid>

                            <Grid item={true} xs={12}>
                                <TextField id="patternType"
                                           select={true} label="Pattern Type" required={true}
                                           variant="outlined"
                                           fullWidth={true}
                                           value={formik.values.patternType}
                                           onChange={formik.handleChange}>
                                    <MenuItem value='PREFIXED'>PREFIXED</MenuItem>
                                    <MenuItem value='LITERAL'>LITERAL</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item={true} xs={12}>
                                <TextField id='topicName' label='Topic Name' variant="outlined"
                                           fullWidth={true}
                                           value={formik.values.topicName}
                                           onChange={formik.handleChange}
                                           error={formik.touched.topicName && Boolean(formik.errors.topicName)}
                                           helperText={formik.touched.topicName && formik.errors.topicName}
                                />
                            </Grid>

                            {formik.values.clientGroup === 'PRODUCER' ? <AddProducerAcl formik={formik}/> :
                                <AddConsumerAcl formik={formik}/>}

                        </Grid>

                    </Grid>
                </Grid>
                <Toolbar>
                    <Grid container={true} spacing={2}>
                        <Grid item={true} >
                            <Button variant="contained" color="primary" type="submit">save</Button>
                        </Grid>
                        <Grid item={true}>
                            <Button variant="contained" color="secondary" onClick={(e) => {
                                history.push('/acl')
                            }}>discard</Button>

                        </Grid>
                    </Grid>
                </Toolbar>
            </form>

        </CardContent>
        <CardActionArea>

        </CardActionArea>
    </Card>
}


function AddProducerAcl({formik}) {
    return <React.Fragment>
        <Grid item={true} xs={12}>
            <FormLabel htmlFor="hasTransaction">
                transaction is required?
            </FormLabel>
            <Checkbox name="hasTransaction"
                      onChange={formik.handleChange}
                      value={formik.values.hasTransaction}
            />
        </Grid>
        {
            formik.values.hasTransaction &&
            <Grid item={true} xs={12}>
                <TextField id='transactionIdPrefix' label='transactionId Prefix' variant="outlined"
                           fullWidth={true}
                           value={formik.values.transactionIdPrefix}
                           onChange={formik.handleChange}
                           error={formik.touched.transactionIdPrefix && Boolean(formik.errors.transactionIdPrefix)}
                           helperText={formik.touched.transactionIdPrefix && formik.errors.transactionIdPrefix}
                />
            </Grid>
        }
    </React.Fragment>
}

function AddConsumerAcl({formik}) {
    return <React.Fragment>
        <Grid item={true} xs={12}>
            <TextField name='groupName' label='Group Name'
                       variant="outlined" fullWidth={true}
                       onChange={formik.handleChange}
                       value={formik.values.groupName}
                       error={formik.touched.groupName && Boolean(formik.errors.groupName)}
                       helperText={formik.touched.groupName && formik.errors.groupName}/>
        </Grid>
    </React.Fragment>
}

export default AddAclEntry