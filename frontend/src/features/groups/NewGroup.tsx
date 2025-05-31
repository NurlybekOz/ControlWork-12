import {Typography} from "@mui/material";
import {useAppDispatch} from "../../app/hooks.ts";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import GroupForm from "./components/GroupForm/GroupForm.tsx";
import {createGroup} from "./groupsThunk.ts";
import {GroupMutation} from "../../types";

const NewGroup = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onCreateNewGroup = async (group: GroupMutation) => {
        try {
            await dispatch(createGroup(group)).unwrap();
            toast.warning("Your group is under moderation review");
            navigate('/');
        } catch (e) {
            toast.error("Group was not successfully created");
            console.error(e);
        }
    };

    return (
        <>
            <Typography variant="h4" style={{textAlign: "center", marginBottom: "20px"}}>
                New Group
            </Typography>
            <GroupForm onSubmitGroup={onCreateNewGroup}/>
        </>
    );
};

export default NewGroup;