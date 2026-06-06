import { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { Button, Stack } from '@mui/material';
import NumberField from '../components/NumberField';
import ExpenditureDate from '../components/ExpenditureDate';
import rawMonthlyExpenses, { ExpenseRequest, rawDayExpenses } from '../datastructure/MonthlyExpenses'
import { get, put } from '../utils/http';
import { formatToYYYYMM, formatToYYYYMMDD } from '../utils/dateutils';
import { setError } from '../utils/error';

function TodayPanel({setIsFetching}: {setIsFetching: (value: boolean) => void}) {

  const today = new Date();

  const saveButtonRef = useRef<HTMLButtonElement>(null);

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
    console.log(`Saving data for date: ${formatToYYYYMM(today)}`);
    setIsFetching(true);
    if (saveButtonRef.current) {
          saveButtonRef.current.disabled = true;
      try {
        const requestBody = ExpenseRequest.parse({
          in: {
            Date: formatToYYYYMMDD(today),
            Food: foodExpense?.toString() ?? "0",
            Transport: travelExpense?.toString() ?? "0",
            Utility: utilityExpense?.toString() ?? "0",
            Other: otherExpense?.toString() ?? "0",
            Adhoc: adhocExpense?.toString() ?? "0"
          }
        });

        const response = await fetch(`${window.API_URL}/expense`, {
        method: 'POST',
        // Omit credentials (cookies, HTTP auth headers) to comply with "without credentials"
        credentials: 'omit', 
        headers: {
          'Content-Type': 'application/json',
          // The browser automatically adds the Origin header, but if you need to 
          // strictly enforce no credentials at the protocol level:
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
      });

        const data = await response.json();
        console.log(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setIsFetching(false);
        saveButtonRef.current.disabled = false;
      } 
    }
      
  }

  useEffect(() => {
    // Flag to track if component is still mounted
    let ignore = false;

    async function fetchExpense() {
      
      setIsFetching(true);
      
      try {
        if (!ignore) {
          console.log(`Fetching data for date: ${formatToYYYYMM(today)}`);
          const data = await get(
            `${window.API_URL}/expense?date=${formatToYYYYMM(today)}`
          );
          const parsedData =  rawMonthlyExpenses.parse(data); 
          // TypeScript "knows" that parsedData will be an array of rawMonthlyExpenses
          // full with objects as defined by the above schema
          parsedData.message.filter(expense => expense.Date === formatToYYYYMMDD(today)).map((expense) => {
            setFoodExpense(Number(expense.Food));
            setTravelExpense(Number(expense.Transport));
            setUtilityExpense(Number(expense.Utility));
            setAdhocExpense(Number(expense.Adhoc));
            setOtherExpense(Number(expense.Other));
          });
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

  }, []);

    return (
          <Box sx={{ display: 'grid', gap: 4 , padding: 4}}>
            <ExpenditureDate/>
            <Stack direction="row" spacing={2} justifyContent="center">
              <NumberField label="Enter Food Expense" size="small" value={foodExpense ?? null} onValueChange={(value) => setFoodExpense(value ?? null)}/>
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="center">
            <NumberField label="Enter Travel Expense" size="small" value={travelExpense ?? null} onValueChange={(value) => value !== null && setTravelExpense(value)}/>
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="center">
              <NumberField label="Enter Utility Expense" size="small" value={utilityExpense ?? null} onValueChange={(value) => value !== null && setUtilityExpense(value)}/>
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="center">
              <NumberField label="Enter AdHoc Expense" size="small" value={adhocExpense ?? null} onValueChange={(value) => value !== null && setAdhocExpense(value)}/>
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="center">
              <NumberField label="Enter Other Expense" size="small" value={otherExpense ?? null} onValueChange={(value) => value !== null && setOtherExpense(value)}/>
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

export default TodayPanel;


