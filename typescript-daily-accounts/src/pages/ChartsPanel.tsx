import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { get } from '../utils/http';
import { Stack, Typography, Container } from "@mui/material";
import { Chart } from 'react-chartjs-2';
import type { ChartData } from 'chart.js';
import ExpenditureYearSelect from '../components/ExpenditureYearSelect';
import { formatToYYYY } from '../utils/dateutils';
import { setError } from '../utils/error';
import yearlyExpensesForMonth from '../datastructure/YearlyExpenses';

function ChartsPanel({setIsFetching}: {setIsFetching: (value: boolean) => void}) {

    const today = new Date();
    const [selectedYear, setSelectedYear] = useState<Date>(today);

    const [foodExpenses, setFoodExpenses] = useState<Array<number>>([]);
    const [travelExpenses, setTravelExpenses] = useState<Array<number>>([]);
    const [utilityExpenses, setUtilityExpenses] = useState<Array<number>>([]);
    const [otherExpenses, setOtherExpenses] = useState<Array<number>>([]);
    const [adhocExpenses, setAdhocExpenses] = useState<Array<number>>([]);

    const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows you to set a fixed height
    plugins: {
        legend: { position: 'top' as const },
        title: { display: true, text: 'Monthly Expenses' },
    },
    };

    const labels = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    const calculateAverage = (dataArray: number[]) => {
        const total = dataArray.reduce((acc, val) => acc + val, 0);
        const count = dataArray.filter(val => val > 0).length;
        let avg = 0;
        if (count === 0) {
            avg = total;
        } else {
            avg = total / count;
        }
        return Array(12).fill(avg);
    };

    const foodData: ChartData<'bar' | 'line'> ={
        labels,
        datasets: [
            {
                type : 'bar',
                label: 'Food',
                data: labels.map((key:string) => foodExpenses[Number(key) - 1] || 0),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                type: 'line', 
                label: `${'Average : ₹ ' + calculateAverage(foodExpenses)[0].toFixed(2)}`,
                data: calculateAverage(foodExpenses),
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                borderDash: [5, 5], // Makes it a dashed line
                pointRadius: 0,     // Hides the data points
                fill: false,
            }
        ],
    };

    const travelData: ChartData<'bar' | 'line'> = {
        labels,
        datasets: [
            {
                type : 'bar',
                label: 'Travel',
                data: labels.map((key:string) => travelExpenses[Number(key) - 1] || 0),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
            {
                type: 'line' as const, // This adds the line
                label: `${'Average : ₹ ' + calculateAverage(travelExpenses)[0].toFixed(2)}`,
                data: calculateAverage(travelExpenses),
                borderColor: 'rgba(53, 162, 235, 1)',
                borderWidth: 2,
                borderDash: [5, 5], // Makes it a dashed line
                pointRadius: 0,     // Hides the data points
                fill: false,
            }
        ],
    };

    const utilityData:ChartData<'bar' | 'line'> = {
        labels,
        datasets: [
            {
                type : 'bar',
                label: 'Utility',
                data: labels.map((key:string) => utilityExpenses[Number(key) - 1] || 0),
                backgroundColor: 'rgba(255, 205, 86, 0.5)',
            },
            {
                type: 'line' as const, // This adds the line
                label: `${'Average : ₹ ' + calculateAverage(utilityExpenses)[0].toFixed(2)}`,
                data: calculateAverage(utilityExpenses),
                borderColor: 'rgba(255, 205, 86, 1)',
                borderWidth: 2,
                borderDash: [5, 5], // Makes it a dashed line
                pointRadius: 0,     // Hides the data points
                fill: false,
            }
        ],
    };

    const otherData:ChartData<'bar' | 'line'> = {
        labels,
        datasets: [
            {
                type : 'bar',
                label: 'Other',
                data: labels.map((key:string) => otherExpenses[Number(key) - 1] || 0),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            },
            {
                type: 'line' as const, // This adds the line
                label: `${'Average : ₹ ' + calculateAverage(otherExpenses)[0].toFixed(2)}`,
                data: calculateAverage(otherExpenses),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                borderDash: [5, 5], // Makes it a dashed line
                pointRadius: 0,     // Hides the data points
                fill: false,
            }
        ],
    };

    const adhocData: ChartData<'bar' | 'line'> = {
        labels,
        datasets: [
            {
                type : 'bar',
                label: 'Adhoc',
                data: labels.map((key:string) => adhocExpenses[Number(key) - 1] || 0),
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
            },
            {
                type: 'line' as const, // This adds the line
                label: `${'Average : ₹ ' + calculateAverage(adhocExpenses)[0].toFixed(2)}`,
                data: calculateAverage(adhocExpenses),
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                borderDash: [5, 5], // Makes it a dashed line
                pointRadius: 0,     // Hides the data points
                fill: false,
            }
        ],
    };



    function handleClear() {
        setFoodExpenses([]);
        setTravelExpenses([]);
        setUtilityExpenses([]);
        setAdhocExpenses([]);
        setOtherExpenses([]);
    }

    useEffect(() => {
    // Flag to track if component is still mounted
    let ignore = false;

    async function fetchExpense() {
        setIsFetching(true);
        try {
        
        if (!ignore) {
            console.log(`Fetching data for year: ${formatToYYYY(selectedYear)}`);
            const data = await get(
            `${window.API_URL}/expense?date=${formatToYYYY(selectedYear)}`
            );
            const parsedData =  yearlyExpensesForMonth.parse(data); 
            // TypeScript "knows" that parsedData will be an array of rawMonthlyExpenses
            // full with objects as defined by the above schema

            const grouped = Object.groupBy(parsedData.message, (expense) => expense.Month);
            // Reduce to calculate totals
            const filteredExpenses = Object.entries(grouped).map(([month, items]) => ({
                month,
                foodTotal: items!.reduce((sum, item) => sum + item.Food, 0),
                transportTotal: items!.reduce((sum, item) => sum + item.Transport, 0),
                utilityTotal: items!.reduce((sum, item) => sum + item.Utility, 0),
                otherTotal: items!.reduce((sum, item) => sum + item.Other, 0),
                adhocTotal: items!.reduce((sum, item) => sum + item.Adhoc, 0)
            }));

            console.log(parsedData);
            
            setFoodExpenses(filteredExpenses.map(e => e.foodTotal));
            setTravelExpenses(filteredExpenses.map(e => e.transportTotal));
            setUtilityExpenses(filteredExpenses.map(e => e.utilityTotal));
            setOtherExpenses(filteredExpenses.map(e => e.otherTotal));
            setAdhocExpenses(filteredExpenses.map(e => e.adhocTotal));

            if (filteredExpenses.length === 0) {
                handleClear();
            }
        }
        } catch (error) {
        if (!ignore && error instanceof Error) {
            setError(error.message);
        }
        }
        finally {
            setIsFetching(false);
        }

    }
    fetchExpense();

    // Cleanup function: runs when the component unmounts
    return () => {
        ignore = true;
    };

    }, [selectedYear]);
    
  return (
    <Box sx={ { display: 'grid', gap: 4, padding: 2, width: '100%' } }>
        <Stack direction="row" spacing={2} justifyContent="center">
            <Typography variant="h5" align="center" color="textPrimary">Select year </Typography>
            <ExpenditureYearSelect date={today} onYearChange={setSelectedYear}/>
        </Stack>
        <Box sx={{ height: '300px', width: '100%' }}>
            <Chart type="bar" options={options} data={foodData as any} />
        </Box>
        <Box sx={{ height: '300px', width: '100%' }}>
            <Chart type="bar" options={options} data={travelData as any} />
        </Box>
        <Box sx={{ height: '300px', width: '100%' }}>
            <Chart type="bar" options={options} data={utilityData as any} />
        </Box>
        <Box sx={{ height: '300px', width: '100%' }}>
            <Chart type="bar" options={options} data={otherData as any} />
        </Box>
        <Box sx={{ height: '300px', width: '100%' }}>
            <Chart type="bar" options={options} data={adhocData as any} />
        </Box>
    </Box>
    );
}

export default ChartsPanel;   