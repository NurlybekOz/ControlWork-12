import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {Button, Card, CardActions, CardContent, CardMedia, Grid, Typography} from '@mui/material';
import {useEffect} from "react";
import Spinner from "../../UI/Spinner/Spinner.tsx";
import { Link } from "react-router-dom";
import {apiUrl} from "../../../globalConstants.ts";
import { selectUser } from "../users/UserSlice.ts";
import {selectGroups, selectGroupsLoading} from "./groupsSlice.ts";
import {deleteGroupByAuthor, fetchAllGroups, patchGroup} from "./groupsThunk.ts";
import {toast} from "react-toastify";


const MyGroups = () => {
    const dispatch = useAppDispatch()
    const groups = useAppSelector(selectGroups)
    const loading = useAppSelector(selectGroupsLoading)
    const user = useAppSelector(selectUser)

    useEffect(() => {
        if (user?._id) {
            dispatch(fetchAllGroups(user._id));
        }
    }, [dispatch, user]);

    const isAdmin = user?.role === 'admin';

    const handleDelete = async (GroupId: string) => {
        await dispatch(deleteGroupByAuthor(GroupId))
        toast.success("Group successfully deleted.");
        if (user?._id) {
            dispatch(fetchAllGroups(user._id));
        }
    }
    const handlePatch = async (GroupId: string) => {
        await dispatch(patchGroup(GroupId))
        toast.success("Group successfully published.");
        if (user?._id) {
            dispatch(fetchAllGroups(user._id));
        }
    }
    return (
        <>
            {loading ? <Spinner /> :
                (groups.length === 0 ?
                        <Typography variant='h4' color='textDisabled' mt={2}>No groups</Typography> :
                        <Grid container direction='row' spacing={3} mt={2}>
                            {groups.map((group, index) => {
                                return (
                                    <Card sx={{ minWidth: 250, maxWidth: 350 }} key={index} >
                                        <CardMedia
                                            component="img"
                                            alt={group.title}
                                            height="250"
                                            image={apiUrl + '/' + group.image}
                                        />
                                        <CardContent>
                                            <Button component={Link} to={'/groups/' + group._id}>
                                                {group.title}
                                            </Button>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Author: {group.user.displayName}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            {isAdmin && !group.isPublished &&
                                                <Button onClick={() => handlePatch(group._id)} variant='contained' color='success'>Publish</Button>
                                            }
                                            {isAdmin && group.isPublished &&
                                                <Button onClick={() => handleDelete(group._id)} variant='contained' color='error'>Delete</Button>
                                            }
                                        </CardActions>
                                    </Card>



                                );
                            })}
                        </Grid>
                )}
        </>
    );
};

export default MyGroups;