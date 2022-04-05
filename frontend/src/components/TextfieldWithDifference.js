import { Paper, Typography, Divider } from "@mui/material";
import ButtonWithPopover from "./ButtonWithPopover";

export default function TextfieldWithDifference(props) {
    return (
        <Paper
            variant="outlined"
            style={{padding: "12px", width: "50%"}}
        >
            <Typography textAlign="center" variant="h6">
                Исправленный текст
            </Typography>
            <Divider style={{margin: "12px"}}/>
            <div 
                style={{ 
                    display: 'flex', 
                    flexFlow: "wrap", 
                    width: '100%' 
            }}>
            {
                props.corrections.map((elem, idx) => {
                    let before = elem["before"];
                    let after = elem["after"];
                    
                    if (after === before) {
                        return (
                            <Typography
                                sx={{
                                    ml: "2px",
                                    mr: "2px"
                                }}
                            >
                                {before}
                            </Typography>
                        );
                    } else if (after === " ") {
                        return (
                            <ButtonWithPopover
                                label={before}
                            >
                                Вероятно, слово нужно удалить.
                            </ButtonWithPopover>
                        );
                    } else {
                        return (
                            <ButtonWithPopover
                                label={before}
                            >
                                Вероятно, вы имели ввиду: <b>{after}</b>
                            </ButtonWithPopover>
                        );
                    }
                })
            }
            </div>
        </Paper>
    );
}