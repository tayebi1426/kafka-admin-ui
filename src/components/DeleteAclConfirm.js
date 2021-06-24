import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core'

function DeleteAclConfirm({open, handleClose, handleConfirm}) {
    return <Dialog
        open={open}
        onClose={handleClose}>
        <DialogTitle>
            Delete Acl
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
                Do you want to delete this acl entry?
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button autoFocus onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleConfirm} color="primary">
                Confirm
            </Button>
        </DialogActions>
    </Dialog>
}

export default DeleteAclConfirm;
