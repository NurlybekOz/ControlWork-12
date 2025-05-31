import {Container, CssBaseline, Typography} from "@mui/material";
import {Route, Routes} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import Register from "./features/users/Register.tsx";
import Login from "./features/users/Login.tsx";
import AppToolbar from "./UI/AppToolbar/AppToolbar.tsx";
import Groups from "./features/groups/Groups.tsx";
import ProtectedRoute from "./UI/ProtectedRoute/ProtectedRoute.tsx";
import MyGroups from "./features/groups/MyGroups.tsx";
import {useAppSelector} from "./app/hooks.ts";
import { selectUser } from "./features/users/UserSlice.ts";
import NewGroup from "./features/groups/NewGroup.tsx";
import FullGroup from "./features/groups/FullGroup.tsx";


const App = () => {
    const user = useAppSelector(selectUser);
    return (
        <>
            <CssBaseline />
            <ToastContainer/>
            <header>
                <AppToolbar/>
            </header>
            <main>
                <Container maxWidth="xl">
                    <Routes>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/" element={<Groups/>}/>
                        <Route path="/groups" element={<Groups/>}/>
                        <Route path="/mygroups" element={
                            <ProtectedRoute isAllowed={Boolean(user)}>
                                <MyGroups/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/groups/new" element={
                            <ProtectedRoute isAllowed={Boolean(user)}>
                                <NewGroup/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/groups/:id" element={<FullGroup/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="*" element={<Typography variant="h4">Not found page</Typography>}/>
                    </Routes>
                </Container>
            </main>
        </>
    )
};

export default App
