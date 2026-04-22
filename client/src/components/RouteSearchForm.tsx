import { useState } from "react";
import { useStationsCompletions } from "../hooks/station.hooks";
import type { RouteQueryParams } from "../hooks/route.hooks";
import type { IcStation } from "../hooks/station.model";
import {
  Autocomplete,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import {
  ConfirmationNumberRounded,
  FlagRounded,
  PlaceRounded,
  SearchRounded,
  SwapHorizRounded,
  TodayRounded,
} from "@mui/icons-material";

interface Props {
  onSubmit: (params: RouteQueryParams) => void;
}

function stationLabel(station: IcStation) {
  return `${station.n} (EVA ${station.h}, EPA ${station.i})`;
}

function helperText(station: IcStation | null) {
  return station ? `EVA ${station.h} | EPA ${station.i}` : " ";
}

export function RouteSearchForm({ onSubmit }: Props) {
  const [trainCategory, setTrainCategory] = useState("IC");
  const [trainNumber, setTrainNumber] = useState("");
  const [fromQuery, setFromQuery] = useState("");
  const [toQuery, setToQuery] = useState("");
  const [fromStation, setFromStation] = useState<IcStation | null>(null);
  const [toStation, setToStation] = useState<IcStation | null>(null);
  const [departureDate, setDepartureDate] = useState<Dayjs | null>(dayjs());

  const fromSuggestionsQuery = useStationsCompletions(fromQuery);
  const toSuggestionsQuery = useStationsCompletions(toQuery);

  const fromSuggestions = fromSuggestionsQuery.data ?? [];
  const toSuggestions = toSuggestionsQuery.data ?? [];

  const swapStations = () => {
    setFromStation(toStation);
    setToStation(fromStation);
    setFromQuery(toQuery);
    setToQuery(fromQuery);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedTrainNumber = Number(trainNumber);
    if (!fromStation || !toStation || !trainNumber || !departureDate) return;
    if (!trainCategory.trim()) return;
    if (!Number.isFinite(parsedTrainNumber) || parsedTrainNumber <= 0) return;

    onSubmit({
      trainCategory: trainCategory.trim(),
      trainNumber: parsedTrainNumber,
      fromEVAStationId: Number(fromStation.h),
      toEVAStationId: Number(toStation.h),
      departureDate: departureDate.toDate(),
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Paper
        component="form"
        variant="outlined"
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 2, sm: 2.5 },
          display: "grid",
          gap: 2,
          backgroundColor: alpha("#FFFFFF", 0.82),
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={2}>
          <Typography variant="h5">Szukaj pociagu</Typography>
          <Typography variant="body2" color="text.secondary">
            EVA i EPA sa widoczne w podpowiedziach.
          </Typography>
        </Stack>

        <Grid container spacing={1.5} alignItems="center">
          <Grid item xs={12} md={5}>
            <Autocomplete
              options={fromSuggestions}
              loading={fromSuggestionsQuery.isFetching}
              getOptionLabel={stationLabel}
              isOptionEqualToValue={(option, value) => option.h === value.h}
              value={fromStation}
              onChange={(_, newValue) => setFromStation(newValue)}
              inputValue={fromQuery}
              onInputChange={(_, newInputValue) => setFromQuery(newInputValue)}
              noOptionsText={fromQuery.length > 2 ? "Brak wynikow" : "Wpisz min. 3 znaki"}
              filterOptions={(x) => x}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skad"
                  placeholder="Warszawa Centralna"
                  required
                  helperText={helperText(fromStation)}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <PlaceRounded color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={1} sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              onClick={swapStations}
              aria-label="Zamien stacje"
              sx={{
                mt: { md: -0.5 },
                width: 44,
                height: 44,
                border: "1px solid",
                borderColor: "divider",
                backgroundColor: "#FFFFFF",
              }}
            >
              <SwapHorizRounded />
            </IconButton>
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={toSuggestions}
              loading={toSuggestionsQuery.isFetching}
              getOptionLabel={stationLabel}
              isOptionEqualToValue={(option, value) => option.h === value.h}
              value={toStation}
              onChange={(_, newValue) => setToStation(newValue)}
              inputValue={toQuery}
              onInputChange={(_, newInputValue) => setToQuery(newInputValue)}
              noOptionsText={toQuery.length > 2 ? "Brak wynikow" : "Wpisz min. 3 znaki"}
              filterOptions={(x) => x}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Dokad"
                  placeholder="Krakow Glowny"
                  required
                  helperText={helperText(toStation)}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <FlagRounded color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <DateTimePicker
              label="Wyjazd"
              value={departureDate}
              onChange={setDepartureDate}
              ampm={false}
              format="DD/MM/YYYY HH:mm"
              slotProps={{
                textField: {
                  required: true,
                  helperText: " ",
                  InputProps: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <TodayRounded color="primary" />
                      </InputAdornment>
                    ),
                  },
                  sx: { width: "100%" },
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={4} md={2}>
            <TextField
              label="Kategoria"
              value={trainCategory}
              onChange={(e) => setTrainCategory(e.target.value.toUpperCase())}
              required
              helperText=" "
            />
          </Grid>

          <Grid item xs={12} sm={8} md={3}>
            <TextField
              label="Numer"
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              required
              helperText=" "
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ConfirmationNumberRounded color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={3} sx={{ display: "flex" }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchRounded />}
              sx={{
                width: "100%",
                minHeight: 56,
                boxShadow: "none",
              }}
            >
              Wyszukaj
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </LocalizationProvider>
  );
}
