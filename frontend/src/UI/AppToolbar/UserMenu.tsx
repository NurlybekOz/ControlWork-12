import {useState} from "react";
import {Button, Menu, MenuItem} from "@mui/material";
import {toast} from "react-toastify";
import {useAppDispatch} from "../../app/hooks.ts";
import {logout} from "../../features/users/UserThunks.ts";
import {unsetUser} from "../../features/users/UserSlice.ts";
import {User} from "../../types";

interface Props {
    user: User;
}

const UserMenu: React.FC<Props> = ({user}) => {
    const dispatch = useAppDispatch();
    const [userOptionsEl, setUserOptionsEl] = useState<HTMLElement | null>(null);

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

                <MenuItem>My groups</MenuItem>
                <MenuItem>My trained groups</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;