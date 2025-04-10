import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateThemeMode } from '../Redux/actions';
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
} from "@mui/material";

export default function ThemeSettings({ open, handleThemeClose }) {
    const dispatch = useDispatch();
    const userThemeMode = useSelector(state => state.user.themeMode);
    const options = [{ label: 'Light', value: 'light', }, { label: 'Dark', value: 'dark', }, { label: 'Custom', value: 'custom', disabled: true },]
    const [themeSelection, setThemeSelection] = useState(options.filter(option => option.value === userThemeMode)[0] || options[1]);

    const handleChange = (e, selection) => {
        setThemeSelection(selection);
    }

    const saveTheme = () => dispatch(updateThemeMode(themeSelection.value));

    return (
        <Dialog
            open={open}
            onClose={handleThemeClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                {"Theme"}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ padding: "15px" }}>
                    <Grid container size={12} sx={{ justifyContent: 'center' }}>
                        <Autocomplete
                            fullWidth
                            value={themeSelection}
                            options={options}
                            onChange={handleChange}
                            isOptionEqualToValue={(option, value) => option.value === value.value}
                            renderInput={(params) => <TextField {...params} label="Theme" />}
                            getOptionDisabled={(option) => option.value === 'custom'}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button variant="contained" onClick={handleThemeClose}>Cancel</Button>
                <Button variant="contained" onClick={saveTheme} autoFocus>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    )
}
