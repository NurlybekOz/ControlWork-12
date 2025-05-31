import * as React from 'react';
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { Button, Card, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { useEffect } from "react";
import Spinner from "../../UI/Spinner/Spinner.tsx";
import { apiUrl } from "../../../globalConstants.ts";
import { selectGroups, selectGroupsLoading } from "./groupsSlice.ts";
import { deleteGroup, fetchAllGroups, patchGroup } from "./groupsThunk.ts";
import { selectUser } from "../users/UserSlice.ts";
import GroupDetailsModal from "../../UI/Modal/Modal.tsx";
import {IGroup} from "../../types";
import { Link } from 'react-router-dom';
import {toast} from "react-toastify";

const Groups = () => {
    const dispatch = useAppDispatch();
    const groups = useAppSelector(selectGroups);
    const loading = useAppSelector(selectGroupsLoading);
    const user = useAppSelector(selectUser);

    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedGroup, setSelectedGroup] = React.useState<any | null>(null);

    useEffect(() => {
        dispatch(fetchAllGroups(null));
    }, [dispatch]);

    const isAdmin = user?.role === 'admin';

    const handleDelete = async (GroupId: string) => {
        await dispatch(deleteGroup(GroupId));
        dispatch(fetchAllGroups(null));
        toast.success("Group successfully deleted.");
    };

    const handlePatch = async (GroupId: string) => {
        await dispatch(patchGroup(GroupId));
        toast.success("Group successfully published.");
        dispatch(fetchAllGroups(null));
    };

    const handleOpenModal = (group: IGroup) => {
        setSelectedGroup(group);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedGroup(null);
    };

    return (
        <>
            {loading ? (
                <Spinner />
            ) : groups.length === 0 ? (
                <Typography variant="h4" color="textDisabled" mt={2}>
                    No groups
                </Typography>
            ) : (
                <Grid container direction="row" spacing={3} mt={2}>
                    {groups.map((group, index) => {
                        if (!group.isPublished && !isAdmin) {
                            return null;
                        }
                        return (
                            <Card sx={{ minWidth: 250, maxWidth: 350 }} key={index}>
                                <CardMedia
                                    component="img"
                                    alt={group.title}
                                    height="250"
                                    image={apiUrl + '/' + group.image}
                                    onClick={() => handleOpenModal(group)}
                                />
                                <CardContent>
                                    <Button component={Link} to={`/groups/${group._id}`}>
                                        {group.title}
                                    </Button>
                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                        Author: {group.user.displayName}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    {isAdmin && !group.isPublished && (
                                        <Button
                                            onClick={() => handlePatch(group._id)}
                                            variant="contained"
                                            color="success"
                                        >
                                            Publish
                                        </Button>
                                    )}
                                    {isAdmin && group.isPublished && (
                                        <Button
                                            onClick={() => handleDelete(group._id)}
                                            variant="contained"
                                            color="error"
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </CardActions>
                            </Card>
                        );
                    })}
                </Grid>
            )}

            <GroupDetailsModal
                open={modalOpen}
                group={selectedGroup}
                onClose={handleCloseModal}
            />
        </>
    );
};

export default Groups;