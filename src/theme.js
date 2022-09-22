import { createTheme } from "@mui/material";

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

export const theme = createTheme(false?lightTheme:darkTheme);
