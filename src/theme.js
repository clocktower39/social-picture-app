import { createTheme } from "@mui/material";
import { store } from './Redux/store';

const lightTheme = {
  palette: {
    mode:'light',
  },
  typography: {
  },
}

const darkTheme = {
  palette: {
    mode:'dark',
  },
  typography: {
  },
}

export const theme = () => createTheme(store.getState().user.themeMode === 'dark' ? darkTheme : lightTheme);

