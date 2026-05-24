import { Menu, AppBar, IconButton, MenuItem, Toolbar, Typography, ListItemIcon } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import SettingsIcon from "@mui/icons-material/Settings"
import LinearProgress from '@mui/material/LinearProgress';
import AreaChartIcon from "@mui/icons-material/AreaChart"
import InfoIcon from "@mui/icons-material/Info"
import React from "react";
import { useNavigate } from "react-router";
import ExpenseAbout from "./ExpenseAbout";
import LogoSvg from "../assets/expense.svg?react";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';



function Header({progressValue}: {progressValue: boolean}) {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showAbout, setShowAbout] = React.useState<boolean>(false);
  let navigate = useNavigate();

  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAboutClick = (event: React.MouseEvent<HTMLElement>) => {
    setShowAbout(true);
    setAnchorEl(null);
  }

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(null);
    navigate("/settings");
  } 

  const handleHomeClick = (event: React.MouseEvent<HTMLElement>) => {                 
    setAnchorEl(null);
    navigate("/home");
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <AppBar position="static"  sx = {(theme) => ({ backgroundColor: theme.palette.primary.main,
        color : '#fafafa',
      })}>
        <Toolbar variant="dense">
          <IconButton size="large" edge="start" color="inherit" aria-label="menu"
            sx={{ mr: 2 }} onClick = {handleMenuClick}>
                  <MenuIcon />
          </IconButton>
          <AccountBalanceWalletIcon fontSize="small" />
          <Typography variant="h6" color="inherit" component="div" padding={1}>
               My Expense Tracker
            </Typography>
        </Toolbar>
        {progressValue && <LinearProgress color="inherit"/>}

      </AppBar>  
      <Menu id="basic-menu" anchorEl={anchorEl} open={openMenu} onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}>
          <MenuItem onClick={handleHomeClick} sx={{
          minWidth: 300,
        }}>
          <ListItemIcon>
            <AccountBalanceWalletIcon fontSize="small" />
          </ListItemIcon>
          <Typography variant="h6" color="inherit" component="div">
              Expense Home
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AreaChartIcon fontSize="small" />
          </ListItemIcon>
            <Typography variant="h6" color="inherit" component="div">
              Charts
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleSettingsClick}>
           <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
            <Typography variant="h6" color="inherit" component="div">
              Settings
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleAboutClick}>
           <ListItemIcon>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
            <Typography variant="h6" color="inherit" component="div">
              About
            </Typography>
          </MenuItem>
        </Menu>
        <ExpenseAbout dialogState={showAbout} onClose={() => setShowAbout(false)} />
    </div>  
  )
}

export default Header
