import { Typography } from "@mui/material";

function ExpenditureLastMonth() {

    const today = new Date();
    // Converts to an Date string like "Wed Jun 26 2024"

    enum Month {
        Jan = 0,
        Feb = 1,
        Mar = 2,
        Apr = 3,
        May = 4,
        Jun = 5,
        Jul = 6,
        Aug = 7,
        Sep = 8,
        Oct = 9,
        Nov = 10,
        Dec = 11
    }   
    const formattedDate = Month[today.getMonth() === 0 ? 11 : today.getMonth() - 1] + " " + today.getFullYear();

    return (
        <Typography variant="h5" align="center" color="textPrimary">
            {formattedDate}
        </Typography>   

  )
}

export default ExpenditureLastMonth;