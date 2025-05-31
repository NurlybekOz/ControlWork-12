import {useEffect, useState} from "react";
import {Button, Menu, MenuItem} from "@mui/material";
import {toast} from "react-toastify";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {logout} from "../../features/users/UserThunks.ts";
import {selectUserGroups, unsetUser} from "../../features/users/UserSlice.ts";
import {User} from "../../types";
import { Link } from "react-router-dom";
import {fetchUserGroups} from "../../features/groups/groupsThunk.ts";

interface Props {
    user: User;
}

const UserMenu: React.FC<Props> = ({user}) => {
    const dispatch = useAppDispatch();
    const [userOptionsEl, setUserOptionsEl] = useState<HTMLElement | null>(null);
    const userGroups = useAppSelector(selectUserGroups);

    useEffect(() => {
        if (user._id) {
            dispatch(fetchUserGroups(user._id));
        }
    }, [dispatch, user._id])

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setUserOptionsEl(event.currentTarget);
    };

    const handleClose = () => {
        setUserOptionsEl(null);
    };

    const handleLogout = async () => {
        await dispatch(logout());
        dispatch(unsetUser());
        handleClose();
        toast.success("Logout successfully");
    };

    return (
        <>
            <Button
                onClick={handleClick}
                color="inherit"
            >
                {user.displayName}
            </Button>
            <Menu
                keepMounted
                anchorEl={userOptionsEl}
                open={Boolean(userOptionsEl)}
                onClose={handleClose}
            >
                <MenuItem component={Link} to='/groups/new'>Add new group</MenuItem>
                <MenuItem component={Link} to='/mygroups'>My groups</MenuItem>

                {userGroups?.map((group) => (
                    <MenuItem key={group._id} component={Link} to={`/groups/${group._id}`}>
                        {group.title}
                    </MenuItem>
                ))}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;