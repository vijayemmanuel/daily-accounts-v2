import { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import { Button, Stack, Typography } from '@mui/material';
import NumberField from '../components/NumberField';
import { formatToYYYYMM, formatToYYYYMMDD } from '../utils/dateutils';
import { get } from '../utils/http';
import rawMonthlyExpenses, { ExpenseRequest } from '../datastructure/MonthlyExpenses'
import ExpenditureDaySelect from '../components/ExpenditureDaySelect';
import { setError } from '../utils/error';

interface Totals {
  Food: number;
  Transport: number;
  Utility: number;
  Other: number;
  Adhoc: number;
}

function CurrentMonthPanel({setIsFetching}: {setIsFetching: (value: boolean) => void}) {

  const today = new Date();

  const saveButtonRef = useRef<HTMLButtonElement>(null);

  const  [totals, setTotals] = useState<Totals>({ Food: 0, Transport: 0, Utility: 0, Other: 0 , Adhoc: 0});

  const [selectedDay, setSelectedDay] = useState<Date>(today);

  const [foodExpense, setFoodExpense] = useState<number | null>(null);
  const [travelExpense, setTravelExpense] = useState<number| null>(null);
  const [utilityExpense, setUtilityExpense] = useState<number | null>(null);
  const [adhocExpense, setAdhocExpense] = useState<number| null>(null);
  const [otherExpense, setOtherExpense] = useState<number | null>(null);  

  function handleClear() {
    setFoodExpense(null);
    setTravelExpense(null);
    setUtilityExpense(null);
    setAdhocExpense(null);
    setOtherExpense(null);
  }

  async function handleSave() {
    setIsFetching(true);
    if (saveButtonRef.current) {
      saveButtonRef.current.disabled = true;
      try {
        const requestBody = ExpenseRequest.parse({
        in: {
          Date: formatToYYYYMMDD(selectedDay),
          Food: foodExpense?.toString() ?? "0",
          Transport: travelExpense?.toString() ?? "0",
          Utility: utilityExpense?.toString() ?? "0",
          Other: otherExpense?.toString() ?? "0",
          Adhoc: adhocExpense?.toString() ?? "0"
        }
      });

      const response = await fetch(`${window.API_URL}/expense`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(requestBody),
        });
  
      const result = await response.json();
      console.log(result);

      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        saveButtonRef.current.disabled = false;
      }
    }
    setIsFetching(false);
  }

   


  useEffect(() => {
  // Flag to track if component is still mounted
  let ignore = false;

  async function fetchExpense() {
    
    setIsFetching(true);
    
    try {
    
      if (!ignore) {
        console.log(`Fetching data for date: ${formatToYYYYMM(selectedDay)}`);
        const data = await get(
          `${window.API_URL}/expense?date=${formatToYYYYMM(selectedDay)}`
        );
        const parsedData =  rawMonthlyExpenses.parse(data); 
        // TypeScript "knows" that parsedData will be an array of rawMonthlyExpenses
        // full with objects as defined by the above schema

        const filteredExpenses = parsedData.message.filter(expense => expense.Date === formatToYYYYMMDD(selectedDay));
        if (filteredExpenses.length === 1) {
          const expense = filteredExpenses[0];
          setFoodExpense(Number(expense.Food));
          setTravelExpense(Number(expense.Transport));
          setUtilityExpense(Number(expense.Utility));
          setAdhocExpense(Number(expense.Adhoc));
          setOtherExpense(Number(expense.Other));
        }
        else {
          handleClear();
        }

        //Calculate the sums using reduce
        setTotals(parsedData.message.reduce((acc, expense) => {
          return {
            Food: acc.Food + Number(expense.Food || 0),
            Transport: acc.Transport + Number(expense.Transport || 0),
            Utility: acc.Utility + Number(expense.Utility || 0),
            Other: acc.Other + Number(expense.Other || 0),
            Adhoc: acc.Adhoc + Number(expense.Adhoc || 0)
          };
        }, { Food: 0, Transport: 0, Utility: 0, Other: 0, Adhoc: 0 }));
      }
    } catch (error) {
      if (!ignore && error instanceof Error) {
        setError(error.message);
      }
    }
      finally {
        if (!ignore) {
        setIsFetching(false);
        } 
    }

  }
  fetchExpense();

  // Cleanup function: runs when the component unmounts
  return () => {
    ignore = true;
  };

}, [selectedDay]);
  
return (
    <Box sx={{ display: 'grid', gap: 4 , padding: 4}}>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Typography variant="h5" align="center" color="textPrimary">Select day </Typography>
        <ExpenditureDaySelect date={today} onDayChange={setSelectedDay}/>
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center">
        <NumberField label="Enter Food Expense" size="small" value={foodExpense ?? null} onValueChange={(value) => setFoodExpense(value ?? null)}/>
        <NumberField endAdornmentFlag={false} label="Total Food Spending" value={foodExpense !== null ? foodExpense +totals.Food : totals.Food} readOnly={true} size="small"/>
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center">
        <NumberField label="Enter Travel Expense" size="small" value={travelExpense ?? null} onValueChange={(value) => value !== null && setTravelExpense(value)}/>
        <NumberField endAdornmentFlag={false} label="Total Travel Spending" value={travelExpense !== null ? travelExpense + totals.Transport : totals.Transport} readOnly={true} size="small"/>
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center">
        <NumberField label="Enter Utility Expense" size="small" value={utilityExpense ?? null} onValueChange={(value) => value !== null && setUtilityExpense(value)}/>
        <NumberField endAdornmentFlag={false} label="Total Utility Spending" value={utilityExpense !== null ? utilityExpense + totals.Utility : totals.Utility} readOnly={true} size="small"/>
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center">
        <NumberField label="Enter AdHoc Expense" size="small" value={adhocExpense ?? null} onValueChange={(value) => value !== null && setAdhocExpense(value)}/>
        <NumberField endAdornmentFlag={false} label="Total AdHoc Spending" value={adhocExpense !== null ? adhocExpense + totals.Adhoc : totals.Adhoc} readOnly={true} size="small"/>
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center">
      <NumberField label="Enter Other Expense" size="small" value={otherExpense ?? null} onValueChange={(value) => value !== null && setOtherExpense(value)}/>
      <NumberField endAdornmentFlag={false} label="Total Other Spending" value={otherExpense !== null ? otherExpense + totals.Other : totals.Other} readOnly={true} size="small"/>
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Button variant="contained" color="secondary" onClick={handleClear}>
          Clear  
        </Button>
        <Button variant="contained" color="primary" ref={saveButtonRef} onClick={handleSave}>
          Save  
        </Button>
      </Stack>
    </Box>
  );
}

export default CurrentMonthPanel;