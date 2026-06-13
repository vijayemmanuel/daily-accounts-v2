import { Tabs, Tab } from "@mui/material"
import React from "react";
import ChartsPanel from "../pages/ChartsPanel";
import TrendsPanel from "../pages/TrendsPanel";

function Charts( {setIsFetching} : {setIsFetching: (value: boolean) => void}) {

  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Tabs value={tabValue} onChange={handleTabChange} textColor="inherit" indicatorColor="secondary" centered
      sx = {(theme) => ({ backgroundColor: theme.palette.primary.main,
        color : '#fafafa',
      })}>
        <Tab color="inherit" label="Spends"></Tab>
        <Tab color="inherit" label="Trends"></Tab>
      </Tabs>
      {tabValue === 1 && (
        <TrendsPanel setIsFetching = {setIsFetching}/>
      )}
      {tabValue === 0 && (
        <ChartsPanel setIsFetching = {setIsFetching}/>
      )}
    </>
  )
}

export default Charts
