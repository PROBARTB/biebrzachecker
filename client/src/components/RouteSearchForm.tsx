import { useState } from "react";
import { useStationsCompletions } from "../hooks/station.hooks";
import type { RouteQueryParams } from "../hooks/route.hooks";
import type { IcStation } from "../hooks/station.model";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Autocomplete,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Search, Train } from "@mui/icons-material";

interface Props {
  onSubmit: (params: RouteQueryParams) => void;
}

export const RouteSearchForm = ({ onSubmit }: Props) => {
  const [trainCategory] = useState("IC");
  const [trainNumber, setTrainNumber] = useState<string>("");

  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");

  const [fromStation, setFromStation] = useState<IcStation | null>(null);
  const [toStation, setToStation] = useState<IcStation | null>(null);

  const [departureDate, setDepartureDate] = useState<Dayjs | null>(dayjs());

  const { data: fromSuggestions } = useStationsCompletions(fromQuery);
  const { data: toSuggestions } = useStationsCompletions(toQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromStation || !toStation || !trainNumber || !departureDate) return;

    onSubmit({
      trainCategory,
      trainNumber: Number(trainNumber),
      fromEVAStationId: Number(fromStation.h),
      toEVAStationId: Number(toStation.h),
      departureDate: departureDate.toDate(),
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          maxWidth: 1000,
          mx: "auto",
          borderRadius: 4,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: '#1976d2',
            fontWeight: 'bold',
            mb: 3
          }}
        >
          <Train sx={{ mr: 2, fontSize: '2.5rem' }} />
          Dokąd chcesz się wybrać?
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Autocomplete
            options={fromSuggestions || []}
            getOptionLabel={(option) => `${option.n} (${option.h} / ${option.i})`}
            value={fromStation}
            onChange={(_, newValue) => setFromStation(newValue)}
            inputValue={fromQuery}
            onInputChange={(_, newInputValue) => setFromQuery(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Jadę z"
                required
                sx={{
                  minWidth: 200,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  }
                }}
              />
            )}
            filterOptions={(x) => x}
            sx={{ flex: 1 }}
          />
          <Autocomplete
            options={toSuggestions || []}
            getOptionLabel={(option) => `${option.n} (${option.h} / ${option.i})`}
            value={toStation}
            onChange={(_, newValue) => setToStation(newValue)}
            inputValue={toQuery}
            onInputChange={(_, newInputValue) => setToQuery(newInputValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Jadę do"
                required
                sx={{
                  minWidth: 200,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  }
                }}
              />
            )}
            filterOptions={(x) => x}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Pociąg"
            type="text"
            value={trainNumber}
            onChange={(e) => setTrainNumber(e.target.value)}
            sx={{
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              }
            }}
            required
          />
          <DateTimePicker
            label="Data wyjazdu"
            value={departureDate}
            onChange={setDepartureDate}
            ampm={false}
            format="DD/MM/YYYY HH:mm"
            slotProps={{
              textField: {
                sx: {
                  minWidth: 200,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  }
                }
              }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              minWidth: 200,
              height: 56,
              borderRadius: 3,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
              }
            }}
          >
            <Search sx={{ mr: 1 }} />
            Sprawdź trasy
          </Button>
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};
