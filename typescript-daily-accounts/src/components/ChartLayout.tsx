import { useState } from "react";
import { Container, TableFooter } from "@mui/material"
import Chart from "./Charts"
import Header from "./Header"

export interface ChartProp {
  onProgressUpdate: (value: boolean) => void;
}

function ChartLayout() {
  
  const [progressValue, setProgressValue] = useState<boolean>(false);

  return (
    <Container>
      <Header progressValue = {progressValue} />
      <Chart setIsFetching = {setProgressValue}/>   
    </Container>
  )
}

export default ChartLayout
