import { Typography } from "@mui/material";

function ExpenditureDate() {

    const today = new Date();
    // Converts to an Date string like "Wed Jun 26 2024"
    const formattedDate = today.toDateString();

    return (
        <Typography variant="h5" align="center" color="textPrimary">
            {formattedDate}
        </Typography>   

  )
}

export default ExpenditureDate;