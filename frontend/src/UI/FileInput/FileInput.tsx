import {useRef, useState} from "react";

import {Button, Grid, TextField} from "@mui/material";

interface Props {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    label: string;
}

const FileInput: React.FC<Props> = ({onChange, name, label = 'image'}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState('');

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        } else {
            setFileName('');
        }

        onChange(e);
    };
    const activateInput = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }
    return (
        <>
            <input
                style={{display: 'none'}}
                type="file"
                name={name}
                onChange={onFileChange}
                ref={inputRef}
            />

            <Grid container spacing={2} direction='row' alignItems='center'>
                <Grid>
                    <TextField
                        disabled
                        value={fileName}
                        label={label}
                        onClick={activateInput}
                    />

                </Grid>
                <Button variant='contained' onClick={activateInput}>
                    Browse
                </Button>
            </Grid>

        </>
    );
};

export default FileInput;