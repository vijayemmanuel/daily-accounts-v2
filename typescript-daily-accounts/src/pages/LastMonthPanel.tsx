import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import NumberField from '../components/NumberField';
import rawMonthlyExpenses from '../datastructure/MonthlyExpenses'
import { get } from '../utils/http';
import { formatPrvMonthToYYYYMM } from '../utils/dateutils';
import { setError } from '../utils/error';
import ExpenditureLastMonth from '../components/ExpenditureLastMonth';

function LastMonthPanel({setIsFetching}: {setIsFetching: (value: boolean) => void}) {

  const today = new Date();

  const [foodExpense, setFoodExpense] = useState<number | null>(null);
  const [travelExpense, setTravelExpense] = useState<number| null>(null);
  const [utilityExpense, setUtilityExpense] = useState<number | null>(null);
  const [adhocExpense, setAdhocExpense] = useState<number| null>(null);
  const [otherExpense, setOtherExpense] = useState<number | null>(null); 
  const [totalExpense, setTotalExpense] = useState<number | null>(null);   

  function handleClear() {
    setFoodExpense(null);
    setTravelExpense(null);
    setUtilityExpense(null);
    setAdhocExpense(null);
    setOtherExpense(null);
    setTotalExpense(null);
  }

  useEffect(() => {
    // Flag to track if component is still mounted
    let ignore = false;

    async function fetchExpense() {
      
      setIsFetching(true);
      
      try {
      
        if (!ignore) {
          console.log(`Fetching data for date: ${formatPrvMonthToYYYYMM(today)}`);
          const data = await get(
            `${window.API_URL}/expense?date=${formatPrvMonthToYYYYMM(today)}`
          );
          const parsedData =  rawMonthlyExpenses.parse(data); 

          //Calculate the sums using reduce
          const totals = parsedData.message.reduce((acc, expense) => {
            return {
              Food: acc.Food + Number(expense.Food || 0),
              Transport: acc.Transport + Number(expense.Transport || 0),
              Utility: acc.Utility + Number(expense.Utility || 0),
              Other: acc.Other + Number(expense.Other || 0),
              Adhoc: acc.Adhoc + Number(expense.Adhoc || 0)
            };
          }, { Food: 0, Transport: 0, Utility: 0, Other: 0, Adhoc: 0 });

          // Set state variables once with the final totals
          setFoodExpense(totals.Food);
          setTravelExpense(totals.Transport);
          setUtilityExpense(totals.Utility);
          setAdhocExpense(totals.Adhoc);
          setOtherExpense(totals.Other);
          setTotalExpense(totals.Food + totals.Transport + totals.Utility + totals.Other + totals.Adhoc);
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
        <ExpenditureLastMonth/>
        <Stack direction="row" spacing={2} justifyContent="center">
        <NumberField endAdornmentFlag={false} label="Total Food Spending" size="small" readOnly={true} value={foodExpense ?? null} onValueChange={(value) => setFoodExpense(value ?? null)}/>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center">
        <NumberField endAdornmentFlag={false} label="Total Travel Spending" size="small" readOnly={true} value={travelExpense ?? null} onValueChange={(value) => value !== null && setTravelExpense(value)}/>
        </Stack>
        <Stack direction="row"  spacing={2} justifyContent="center">
        <NumberField endAdornmentFlag={false} label="Total Utility Spending" size="small" readOnly={true} value={utilityExpense ?? null} onValueChange={(value) => value !== null && setUtilityExpense(value)}/>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center">
        <NumberField endAdornmentFlag={false} label="Total AdHoc Spending" size="small" readOnly={true} value={adhocExpense ?? null} onValueChange={(value) => value !== null && setAdhocExpense(value)}/>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center">
        <NumberField endAdornmentFlag={false} label="Total Other Spending" size="small" readOnly={true} value={otherExpense ?? null} onValueChange={(value) => value !== null && setOtherExpense(value)}/>
        </Stack>
        <Stack direction="row" spacing={2} justifyContent="center">
        <NumberField endAdornmentFlag={false} label="Total Monthly Spending" size="small" readOnly={true} value={totalExpense ?? null} onValueChange={(value) => value !== null && setTotalExpense(value)}/>
        </Stack>
      </Box>
    );
}

export default LastMonthPanel;