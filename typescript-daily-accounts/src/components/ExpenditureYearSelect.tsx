import { MenuItem, Select } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { SelectChangeEvent } from '@mui/material/Select';
import { getDateFromDDDay, getDateFromYear } from "../utils/dateutils";


interface ExpenditureYearSelectProps {
    date : Date;
    onYearChange : (newDate: Date) => void;
}


function ExpenditureYearSelect(props: ExpenditureYearSelectProps) {
    // 2. Use useMemo so this list doesn't change unless the date prop changes
    const yearItems = useMemo(() => {
        const n = props.date.getFullYear() - 2018; // Assuming you want to start from 2018
        
        const rawDays = Array.from({ length: n }, (_, index) => props.date.getFullYear() - index);

        return rawDays.map((d) => {
            return `${d}`;
        });
    }, [props.date]);

    // Initialize state with the first item
    const [selectedYear, setSelectedYear] = useState<string>(yearItems[0] || "");

    // 3. Correct MUI Select Change Event type
    const handleChange = (event:SelectChangeEvent<string>) => {
        const value = event.target.value;
        setSelectedYear(value);

        // Extract the day number from the selected value
        props.onYearChange(getDateFromYear(value) || new Date()); // Default to current date if parsing fails
    };
    

    return (
        <div>
            <Select
                variant='standard'
                id="select-year" 
                value={selectedYear}
                label="Year"
                onChange={handleChange}
                >
                {yearItems.map((year) => <MenuItem key={year} value={year}>{year}</MenuItem>)}  
            </Select>
        </div>
    )

  
}

export default ExpenditureYearSelect;