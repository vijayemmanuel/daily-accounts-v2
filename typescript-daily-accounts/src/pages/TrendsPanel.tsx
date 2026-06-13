import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { get } from '../utils/http';
import { Chart } from 'react-chartjs-2';
import type { ChartData } from 'chart.js';
import { setError } from '../utils/error';
import { yearlyExpenses } from '../datastructure/YearlyExpenses';

function TrendsPanel({setIsFetching}: {setIsFetching: (value: boolean) => void}) {

    const today = new Date();

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
        title: { display: true, text: 'Monthly Average Expenses' },
    },
    };

    const labels = Array.from({ length: today.getFullYear() - 2019 + 1 }, (_, i) => (2019 + i).toString());

    const foodData: ChartData<'line'> ={
        labels,
        datasets: [
            {
                type: 'line' as const, 
                label: 'Food',
                data: foodExpenses,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                pointRadius: 2,     // Hides the data points
                fill: false,
            }
        ],
    };

    const travelData: ChartData<'bar' | 'line'> = {
        labels,
        datasets: [
            {
                type: 'line' as const, // This adds the line
                label: 'Travel',
                data: travelExpenses,
                borderColor: 'rgba(53, 162, 235, 1)',
                borderWidth: 2,
                pointRadius: 2,     // Hides the data points
                fill: false,
            }
        ],
    };

    const utilityData:ChartData<'bar' | 'line'> = {
        labels,
        datasets: [
            {
                type: 'line' as const, // This adds the line
                label: 'Utility',
                data: utilityExpenses,
                borderColor: 'rgba(255, 205, 86, 1)',
                borderWidth: 2,
                pointRadius: 2,     // Hides the data points
                fill: false,
            }
        ],
    };

    const otherData:ChartData<'bar' | 'line'> = {
        labels,
        datasets: [
            {
                type: 'line' as const, // This adds the line
                label: 'Other',
                data: otherExpenses,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                pointRadius: 2,     // Hides the data points
                fill: false,
            }
        ],
    };

    const adhocData: ChartData<'bar' | 'line'> = {
        labels,
        datasets: [
            {
                type: 'line' as const, // This adds the line
                label: 'Adhoc',
                data: adhocExpenses,
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 2,
                pointRadius: 2,     // Hides the data points
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

                const results = await Promise.all(labels.map(async (year) => {
                let data = null;
                    try {
                    console.log(`Fetching data for year: ${year}`);
                     data = await get(
                    `${window.API_URL}/expense?date=${year}`
                    );
                } catch (error) {
                    console.error(`Error fetching data for year ${year}:`, error);
                    return {
                        year,
                        totals: {
                            foodTotal: 0,
                            transportTotal: 0,
                            utilityTotal: 0,
                            otherTotal: 0,
                            adhocTotal: 0,
                        }
                    };
                }
                    const parsedData =  yearlyExpenses.parse(data); 
                    // TypeScript "knows" that parsedData will be an array of rawMonthlyExpenses
                    // full with objects as defined by the above schema
                    return {
                            year,
                            totals: {
                                foodTotal: parsedData.message.reduce((acc, exp) => acc + Number(exp.Food || 0), 0),
                                transportTotal: parsedData.message.reduce((acc, exp) => acc + Number(exp.Transport || 0), 0),
                                utilityTotal: parsedData.message.reduce((acc, exp) => acc + Number(exp.Utility || 0), 0),
                                otherTotal: parsedData.message.reduce((acc, exp) => acc + Number(exp.Other || 0), 0),
                                adhocTotal: parsedData.message.reduce((acc, exp) => acc + Number(exp.Adhoc || 0), 0),
                            }
                        };
                    
                }));

                const expenseDictionary = results.reduce((acc, item) => {
                    acc[item.year] = item.totals;
                    return acc;
                }, {} as Record<string, typeof results[0]['totals']>);
                
                const sortedYears = Object.keys(expenseDictionary).sort((a, b) => Number(a) - Number(b));
                
                setFoodExpenses(prv => [...prv, ...sortedYears.map(year => {
                    if (year === today.getFullYear().toString()) {
                        return expenseDictionary[year].foodTotal/today.getMonth() + 1; // Average for the months passed in the current year
                    } else
                        return expenseDictionary[year].foodTotal/12;
                })]);
                setTravelExpenses(prv => [...prv, ...sortedYears.map(year => {
                    if (year === today.getFullYear().toString()) {
                        return expenseDictionary[year].transportTotal/today.getMonth() + 1; // Average for the months passed in the current year
                    } else
                        return expenseDictionary[year].transportTotal/12;
                })]);
                setUtilityExpenses(prv => [...prv, ...sortedYears.map(year => {
                    if (year === today.getFullYear().toString()) {
                        return expenseDictionary[year].utilityTotal/today.getMonth() + 1; // Average for the months passed in the current year
                    } else
                        return expenseDictionary[year].utilityTotal/12;
                })]);
                setOtherExpenses(prv => [...prv, ...sortedYears.map(year => {
                    if (year === today.getFullYear().toString()) {
                        return expenseDictionary[year].otherTotal/today.getMonth() + 1; // Average for the months passed in the current year
                    } else
                        return expenseDictionary[year].otherTotal/12;
                })]);
                setAdhocExpenses(prv => [...prv, ...sortedYears.map(year => {
                    if (year === today.getFullYear().toString()) {
                        return expenseDictionary[year].adhocTotal/today.getMonth() + 1; // Average for the months passed in the current year
                    } else
                        return expenseDictionary[year].adhocTotal/12;
                })]);
                
            }
        }catch (error) {
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

    }, []);
    
  return (
    <Box sx={ { display: 'grid', gap: 4, padding: 2, width: '100%' } }>
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

export default TrendsPanel;   