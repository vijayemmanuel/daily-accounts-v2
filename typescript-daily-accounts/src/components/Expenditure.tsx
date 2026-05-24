import { Tabs, Tab } from "@mui/material"
import React from "react";
import CurrentMonthPanel from "../pages/CurrentMonthPanel";
import TodayPanel from "../pages/TodayPanel";
import LastMonthPanel from "../pages/LastMonthPanel";

function Expenditure( {setIsFetching} : {setIsFetching: (value: boolean) => void}) {

  const [tabValue, setTabValue] = React.useState(1);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Tabs value={tabValue} onChange={handleTabChange} textColor="inherit" indicatorColor="secondary" centered
      sx = {(theme) => ({ backgroundColor: theme.palette.primary.main,
        color : '#fafafa',
      })}>
        <Tab color="inherit" label="Last Month"></Tab>
        <Tab color="inherit" label="Today"></Tab>
        <Tab color="inherit" label="This Month"></Tab>
      </Tabs>
      {tabValue === 2 && (
        <CurrentMonthPanel setIsFetching = {setIsFetching}/>
      )}
      {tabValue === 1 && (
        <TodayPanel setIsFetching = {setIsFetching}/>
      )}
      {tabValue === 0 && (
        <LastMonthPanel setIsFetching = {setIsFetching}/>
      )}
    </>
  )
}

export default Expenditure
