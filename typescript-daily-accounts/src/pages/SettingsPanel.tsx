import Header from "../components/Header";
import { Switch, Typography, Container, useColorScheme } from "@mui/material";
import { useAppTheme,  ThemeContextType } from "../theme/theme";

function SettingsPanel() {
    //const { mode, setMode } = useColorScheme();

    //if (!mode) {
    //    return null;
    //}]
    const { mode, toggleColorMode } = useAppTheme() as ThemeContextType;
    const isDark = mode === 'dark';

    //const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //    (theme.palette.mode ? 'dark' : 'light');
    //}
    
    return (
        <Container>
            <Header progressValue={false} />
            <Typography variant="h6" color="inherit" component="div" sx={{ padding: 4 }}>
                Dark Mode <Switch checked={isDark} onChange={toggleColorMode}/>
            </Typography>
        </Container>
    );
}

export default SettingsPanel;   