import { MenuItem, Select } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { SelectChangeEvent } from '@mui/material/Select';
import { getDateFromDDDay } from "../utils/dateutils";


interface ExpenditureDaySelectProps {
    date : Date;
    onDayChange : (newDate: Date) => void;
}

// 1. Move static data outside to prevent re-creation
const DAYS = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

function ExpenditureDaySelect(props: ExpenditureDaySelectProps) {
    // 2. Use useMemo so this list doesn't change unless the date prop changes
    const dateItems = useMemo(() => {
        const n = props.date.getDate();
        const rawDays = Array.from({ length: n }, (_, index) => n - index); // Simplified reverse logic

        return rawDays.map((d) => {
            const dayIndex = props.date.getDay() - (props.date.getDate() - d);
            const normalizedIndex = ((dayIndex % 7) + 7) % 7; // The "Double Modulo" trick
            return `${d} - ${DAYS[normalizedIndex]}`;
        });
    }, [props.date]);

    // Initialize state with the first item
    const [selectedDate, setSelectedDate] = useState<string>(dateItems[0] || "");

    // 3. Correct MUI Select Change Event type
    const handleChange = (event:SelectChangeEvent<string>) => {
        const value = event.target.value;
        setSelectedDate(value);

        // Extract the day number from the selected value
        props.onDayChange(getDateFromDDDay(value) || new Date()); // Default to current date if parsing fails
    };
    

    return (
        <div>
            <Select
                variant='standard'
                id="select-day" 
                value={selectedDate}
                label="Day"
                onChange={handleChange}
                >
                {dateItems.map((day) => <MenuItem key={day} value={day}>{day}</MenuItem>)}  
            </Select>
        </div>
    )

  
}

export default ExpenditureDaySelect;