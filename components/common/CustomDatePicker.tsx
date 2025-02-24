import { styled } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { AdditionalFilter } from "./Filters";

const StyledStaticDatePicker = styled(DatePicker)({
  "& .MuiFormLabel-root": {
    color: "#fdc936 !important",
  },
  "& .MuiInputBase-input": {
    padding: "8.6px 14px",
  },
});

interface CustomDatePickerProps {
  value: string;
  onChange: (key: string, value: string) => void;
  filter: AdditionalFilter;
}

export default function CustomDatePicker({
  value,
  onChange,
  filter,
}: CustomDatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <StyledStaticDatePicker
          label="Basic date picker"
          value={dayjs(value)}
          onChange={(e) => onChange(filter.key, e?.format() ?? "")}
          slotProps={{
            calendarHeader: {
              className: "text-greyCustom",
            },
            day: {
              className: "text-greyCustom",
            },
            yearButton: {
              className: "text-greyCustom",
            },
            toolbar: {
              className: "text-greyCustom",
            },
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}
