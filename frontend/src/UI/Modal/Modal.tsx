import * as React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Slide} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import {apiUrl} from "../../../globalConstants.ts";
import { Link } from 'react-router-dom';
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {selectUser} from "../../features/users/UserSlice.ts";
import {fetchUserGroups, joinGroup} from '../../features/groups/groupsThunk.ts';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface GroupDetailsModalProps {
    open: boolean;
    group: any | null;
    onClose: () => void;
}

const GroupDetailsModal: React.FC<GroupDetailsModalProps> = ({ open, group, onClose }) => {
    if (!group) return null;
    const user = useAppSelector(selectUser);
    const dispatch = useAppDispatch();

    const handleJoin = () => {
        if (user) {
            dispatch(joinGroup({ groupId: group._id, userId: user._id }));
            dispatch(fetchUserGroups(user._id));
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={onClose}
            aria-describedby="group-details-description"
            sx={{
                '& .MuiDialog-paper': {
                    minWidth: '40%',
                    maxWidth: '50%',
                    minHeight: '50%',
                    maxHeight: '70%',
                    padding: '20px',
                    justifyContent: 'space-between',
                },
            }}
        >
            <Grid spacing={2} sx={{ display: "flex", flexDirection: 'row', gap: '10px' }}>
                <Grid size={6}>
                    <img src={apiUrl + '/' + group.image} style={{width: '400px', height: '350px', borderRadius: '10px'}} alt={group.title}/>
                </Grid>
                <Grid size={6} sx={{width: '50%'}}>
                    <DialogTitle><h1 style={{margin: '0px'}}>{group.title}</h1></DialogTitle>
                    <DialogContent>
                        <DialogContentText id="group-details-description">
                            <strong>Author:</strong> {group.user.displayName}
                        </DialogContentText>
                        <DialogContentText>
                            <strong>Description:</strong> {group.description || 'No description available.'}
                        </DialogContentText>
                        <DialogContentText>
                        </DialogContentText>
                    </DialogContent>
                </Grid>
            </Grid>
            <DialogActions sx={{justifyContent: 'center'}}>
                {user ? <Button component={Link} onClick={handleJoin} variant="outlined" color="success" to={`/groups/${group._id}`}>
                    Join
                </Button> : null}
                <Button onClick={onClose} variant="outlined" color="error">
                    Close
                </Button>
            </DialogActions>

        </Dialog>
    );
};

export default GroupDetailsModal;
