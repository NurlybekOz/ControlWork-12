import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {Button, Container, Grid, Typography} from "@mui/material";
import Spinner from "../../UI/Spinner/Spinner.tsx";
import {apiUrl} from "../../../globalConstants.ts";
import {selectGroupById, selectGroupsLoading} from "./groupsSlice.ts";
import {
    deleteGroupByAuthor,
    fetchGroupById,
    fetchUserGroups,
    leaveGroup,
    removeUserFromGroup
} from "./groupsThunk.ts";
import {selectUser} from "../users/UserSlice.ts";
import { toast } from "react-toastify";


const FullGroup = () => {
    const dispatch = useAppDispatch();
    const group = useAppSelector(selectGroupById);
    const fetchLoading = useAppSelector(selectGroupsLoading);
    const user = useAppSelector(selectUser);
    const navigate = useNavigate()

    const {id} = useParams();

    useEffect(() => {
        if (id) {
            dispatch(fetchGroupById(id));
        }
    }, [id, dispatch]);

    const isUserInGroup = user && group?.people.some(person => person.user._id === user._id);

    const handleLeave = async () => {
        if (user?._id && group?._id) {
            await dispatch(leaveGroup({ groupId: group._id, userId: user._id }));
            dispatch(fetchGroupById(group._id));
            dispatch(fetchUserGroups(user._id));
            toast.success('You successfully left group.');
            navigate('/')

        }
    };

    const handleRemoveUser = async (userIdToRemove: string) => {
        if (!group?._id) return;
        await dispatch(removeUserFromGroup({ groupId: group._id, userIdToRemove }));
        dispatch(fetchGroupById(group._id));
    };

    const handleDelete = async (GroupId: string) => {
        await dispatch(deleteGroupByAuthor(GroupId))
        toast.success('Group successfully deleted')
        navigate('/')
    }

    const isAuthor = user?._id === group?.user._id;

    return (
        <Container >
            {fetchLoading ? <Spinner/> : null}

            {!fetchLoading && group ?
               <Grid>
                   <Grid sx={{display: "flex", gap: "15px"}}>
                       <img src={apiUrl + '/' + group.image} alt={group.title} style={{width: '350px', height: '400px', borderRadius: "15px", marginBottom: '10px'}}/>
                       <Grid sx={{display: "flex", flexDirection: "column", gap: '15px'}}>
                            <h1 style={{margin: "0px"}}>{group.title}</h1>
                            <h2 style={{margin: '0px'}}>Author: {group.user.displayName}</h2>
                            <Typography color='textSecondary'>{group.description}</Typography>
                           {isUserInGroup && !isAuthor && (
                               <Button sx={{width: '200px'}} variant="outlined" color="error" onClick={handleLeave}>
                                   Leave Group
                               </Button>
                           )}
                           {isAuthor &&
                               <Button sx={{width: '200px'}} onClick={() => handleDelete(group._id)} variant='contained' color='error'>Delete</Button>
                           }
                       </Grid>
                   </Grid>
                   <Grid sx={{display: "flex", flexDirection: "column"}}>
                        <ul>
                            <b>Group people</b>
                            {isUserInGroup && (
                                <Grid sx={{ display: "flex", flexDirection: "column" }}>
                                    <ul>
                                        {group.people.map((person) => (
                                            <li key={person._id}>
                                                <b>{person.user.displayName}</b>
                                                {isAuthor && person.user._id !== user._id && (
                                                    <Button color="error" onClick={() => handleRemoveUser(person.user._id)}>
                                                        X
                                                    </Button>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </Grid>
                            )}
                            {!isUserInGroup && (
                                <Typography variant="body2" color="textSecondary">
                                    You are not a member of this group.
                                </Typography>
                            )}
                        </ul>
                   </Grid>
               </Grid>
                :
                <Typography variant="h6">Not found group</Typography>
            }
        </Container>
    );
};

export default FullGroup;