import * as React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";

export const DatePickerValue = (props) => {
  const { formikTouchEmail, formikErrorEmail, handleDate, dateValue, dateError } = props;
  const [value, setValue] = React.useState("");
  const [currentError, setCurrentError] = React.useState(null);
  const [errorDate, setErrorDate] = React.useState(false);

  const handleChange = (newValue) => {
    let date = new Date(newValue);

    let dateMDY = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    setValue(newValue);
    handleDate(dateMDY);
  };

  React.useEffect(() => {
    setValue(dateValue);
  }, [dateValue]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Date Of Birth"
        views={["day", "month", "year"]}
        inputFormat="DD-MM-YYYY"
        value={value}
        onChange={(newValue) => handleChange(newValue)}
        onError={(reason, value) => {
          if (reason) {
            setCurrentError(reason);
            setErrorDate(true);
          } else {
            setCurrentError(null);
            setErrorDate(false);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            fullWidth
            id="dob"
            name="name"
            required
            error={dateError}
            helperText={currentError ?? currentError}
            InputLabelProps={{
              shrink: true,
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};
