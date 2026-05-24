import { Dialog, DialogContent, Typography, Button } from '@mui/material';

interface ExpenseAboutProps {
    title?: string;
    description?: string;
    dialogState: boolean;
    onClose: () => void;
}


function ExpenseAbout( props: ExpenseAboutProps) {
    return (
        <Dialog open={props.dialogState} onClose={props.onClose}>
            <DialogContent>
                <Typography align="center" variant="body1">
                    Made with &#x2764;&#xfe0f;,  Powered with MaterialUI and Typescript React
                </Typography>
                <Button color="primary" variant="contained" size="small" onClick={props.onClose}>
                    Ok
                </Button>
            </DialogContent>
        </Dialog>
    );
  };


export default ExpenseAbout;