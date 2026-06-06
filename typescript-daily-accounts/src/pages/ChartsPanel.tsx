import { useEffect, useState, useRef } from 'react';
import { z } from 'zod';
import Header from "../components/Header";
import Box from '@mui/material/Box';
import { get } from '../utils/http';
import { Stack, Typography, Container, useColorScheme } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import ExpenditureYearSelect from '../components/ExpenditureYearSelect';
import { formatToYYYY } from '../utils/dateutils';
import { setError } from '../utils/error';
import transformedYearlyExpenses, { yearlyExpenses } from '../datastructure/YearlyExpenses';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


function ChartsPanel() {

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
        title: { display: true, text: 'Yearly Expenses' },
    },
    };

    const labels = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    const foodData = {
        labels,
        datasets: [
            {
            label: 'Food',
            data: labels.map((key:string) => foodExpenses[Number(key) - 1] || 0),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            }
        ],
    };

    const travelData = {
        labels,
        datasets: [
            {
            label: 'Travel',
            data: labels.map((key:string) => travelExpenses[Number(key) - 1] || 0),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            }
        ],
    };

    const utilityData = {
        labels,
        datasets: [
            {
            label: 'Utility',
            data: labels.map((key:string) => utilityExpenses[Number(key) - 1] || 0),
            backgroundColor: 'rgba(255, 205, 86, 0.5)',
            }
        ],
    };

    const otherData = {
        labels,
        datasets: [
            {
            label: 'Other',
            data: labels.map((key:string) => otherExpenses[Number(key) - 1] || 0),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            }
        ],
    };

    const adhocData = {
        labels,
        datasets: [
            {
            label: 'Adhoc',
            data: labels.map((key:string) => adhocExpenses[Number(key) - 1] || 0),
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
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
        
        try {
        
        if (!ignore) {
            console.log(`Fetching data for year: ${formatToYYYY(selectedYear)}`);
            const data = await get(
            `${window.API_URL}/expense?date=${formatToYYYY(selectedYear)}`
            );
            const parsedData =  yearlyExpenses.parse(data); 
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

        }

    }
    fetchExpense();

    // Cleanup function: runs when the component unmounts
    return () => {
        ignore = true;
    };

    }, [selectedYear]);
    
  return (
    <Container>
        <Header progressValue={false} />
        <Stack direction="row" spacing={2} justifyContent="center">
            <Typography variant="h5" align="center" color="textPrimary">Select year </Typography>
            <ExpenditureYearSelect date={today} onYearChange={setSelectedYear}/>
        </Stack>
        <Box sx={{ display: 'grid', gap: 4, padding: 2, width: '100%' }}>
            {/* Remove the Stacks, use a Box to provide height */}
            <Box sx={{ height: '300px', width: '100%' }}>
                <Bar options={options} data={foodData} />
            </Box>
            <Box sx={{ height: '300px', width: '100%' }}>
                <Bar options={options} data={travelData} />
            </Box>
            <Box sx={{ height: '300px', width: '100%' }}>
                <Bar options={options} data={utilityData} />
            </Box>
            <Box sx={{ height: '300px', width: '100%' }}>
                <Bar options={options} data={otherData} />
            </Box>
            <Box sx={{ height: '300px', width: '100%' }}>
                <Bar options={options} data={adhocData} />
            </Box>
        </Box>
    </Container>
    );
}

export default ChartsPanel;   