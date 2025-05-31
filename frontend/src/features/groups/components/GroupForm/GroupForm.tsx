import {useState} from "react";
import {Button, Grid, TextField} from "@mui/material";
import {toast} from "react-toastify";
import FileInput from "../../../../UI/FileInput/FileInput.tsx";
import {GroupMutation} from "../../../../types";

interface Props {
    onSubmitGroup: (group: GroupMutation) => void;
}

const GroupForm: React.FC<Props> = ({onSubmitGroup}) => {
    const [form, setForm] = useState<GroupMutation>({
        title: '',
        image: '',
        description: '',
    })

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.title.trim() || !form.description.trim() || !form.image ) {
            toast.error('All fields are required');
            return;
        }
        onSubmitGroup({...form})
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setForm({...form, [name]: value})
    }

    const fileInputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, files} = e.target

        if (files) {
            setForm(prevState => ({...prevState, [name]: files[0]}))
        }
    }

    return (
        <form onSubmit={onSubmit} style={{ width: "75%", margin: "0 auto"}}>
            <Grid container spacing={2} direction="column" alignItems="center">
                <Grid size={{sm: 12, md: 6, lg: 6}}>
                    <TextField
                        style={{width: '100%'}}
                        id="title"
                        label="Title"
                        name="title"
                        value={form.title}
                        onChange={onInputChange}
                    />
                </Grid>
                <Grid size={{sm: 12, md: 6, lg: 6}}>
                    <TextField
                        style={{width: '100%'}}
                        id="description"
                        label="Description"
                        name="description"
                        multiline rows={3}
                        value={form.description}
                        onChange={onInputChange}
                    />
                </Grid>
                <Grid size={{sm: 12, md: 6, lg: 6}}>
                    <FileInput
                        name='image'
                        label='Image'
                        onChange={fileInputChangeHandler}
                    />
                </Grid>

                <Grid size={{sm: 12, md: 6, lg: 6}}>
                    <Button style={{width: '100%'}} type="submit" color="primary" variant="contained">
                        Create
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default GroupForm;