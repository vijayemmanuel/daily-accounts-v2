import { useState } from "react";
import { Container, TableFooter } from "@mui/material"
import Expenditure from "./Expenditure"
import Header from "./Header"

export interface ExpenditureProp {
  onProgressUpdate: (value: boolean) => void;
}

function App() {
  
  const [progressValue, setProgressValue] = useState<boolean>(false);

  return (
    <Container>
      <Header progressValue = {progressValue} />
      <Expenditure setIsFetching = {setProgressValue}/>   
    </Container>
  )
}

export default App
