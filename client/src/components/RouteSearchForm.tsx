import { forwardRef, useImperativeHandle, useState } from "react";
import { useStationsCompletions } from "../hooks/station.hooks";
import type { RouteQueryParams } from "../hooks/route.hooks";
import type { Station } from "../hooks/station.model";
import {
  Autocomplete,
  Box,
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
import { useRecentRouteParams, type RouteParams } from "../hooks/recentRouteParams.hooks";

interface Props {
  onSubmit: (params: RouteQueryParams) => void;
}
export interface RouteSearchFormHandle {
  setFormValues: (params: RouteParams) => void;
}

function stationLabel(station: Station) {
  return `${station.name} (EVA ${station.EVAId}, EPA ${station.EPAId})`;
}

function helperText(station: Station | null) {
  return station ? `EVA ${station.EVAId} | EPA ${station.EPAId}` : " ";
}

export const RouteSearchForm = forwardRef<RouteSearchFormHandle, Props>(
    ({ onSubmit }, ref) => {
    const [trainCategory, setTrainCategory] = useState("IC");
    const [trainNumber, setTrainNumber] = useState("");
    const [fromQuery, setFromQuery] = useState("");
    const [toQuery, setToQuery] = useState("");
    const [fromStation, setFromStation] = useState<Station | null>(null);
    const [toStation, setToStation] = useState<Station | null>(null);
    const [departureDate, setDepartureDate] = useState<Dayjs | null>(dayjs());

    useImperativeHandle(ref, () => ({
      setFormValues: (params: RouteParams) => {
        setTrainCategory(params.trainCategory);
        setTrainNumber(String(params.trainNumber));
        setDepartureDate(dayjs(params.departureDate));
        setFromQuery(String(params.fromStation.name));
        setFromStation(params.fromStation);
        setToQuery(String(params.toStation.name));
        setToStation(params.toStation);
      },
    }));

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

  const { addSearch } = useRecentRouteParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const parsedTrainNumber = Number(trainNumber);
    if (!fromStation || !toStation || !trainNumber || !departureDate) return;
    if (!trainCategory.trim()) return;
    if (!Number.isFinite(parsedTrainNumber) || parsedTrainNumber <= 0) return;

    const queryParams: RouteQueryParams = {
      trainCategory: trainCategory.trim(),
      trainNumber: parsedTrainNumber,
      fromEVAStationId: Number(fromStation.EVAId),
      toEVAStationId: Number(toStation.EVAId),
      departureDate: departureDate.toDate(),
    }

    onSubmit(queryParams);

    const params: RouteParams = {
      trainCategory: trainCategory.trim(),
      trainNumber: parsedTrainNumber,
      fromStation: fromStation,
      toStation: toStation,
      departureDate: departureDate.toDate(),
    }
    addSearch(params);
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
          <Typography variant="h5">Pociąg</Typography>
          {/* <Typography variant="body2" color="text.secondary"></Typography> */}
        </Stack>

        <Grid container spacing={1.5} alignItems="flex-start">
          <Grid item xs md={5}>
            <Autocomplete
              options={fromSuggestions}
              loading={fromSuggestionsQuery.isFetching}
              getOptionLabel={stationLabel}
              renderOption={(props, option) => (
              <li {...props}>
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {option.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {helperText(option)}
                  </Typography>
                </Box>
              </li>
            )}

              isOptionEqualToValue={(option, value) => option.EVAId === value.EVAId}
              value={fromStation}
              onChange={(_, newValue) => setFromStation(newValue)}
              inputValue={fromQuery}
              onInputChange={(_, newInputValue) => setFromQuery(newInputValue)}
              noOptionsText={fromQuery.length > 2 ? "Nic nie znaleziono" : "Wpisz min. 3 znaki"}
              filterOptions={(x) => x}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ze stacji"
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

          <Grid item md={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 76 }}>
            <IconButton
              onClick={swapStations}
              aria-label="Swap stations"
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
              isOptionEqualToValue={(option, value) => option.EVAId === value.EVAId}
              value={toStation}
              onChange={(_, newValue) => setToStation(newValue)}
              inputValue={toQuery}
              onInputChange={(_, newInputValue) => setToQuery(newInputValue)}
              noOptionsText={toQuery.length > 2 ? "Nic nie znaleziono" : "Wpisz min. 3 znaki"}
              filterOptions={(x) => x}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Do stacji"
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
              label="Data wyjazdu"
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

          <Grid item xs={4} sm={4} md={2}>
            <TextField
              fullWidth
              label="Kategoria"
              value={trainCategory}
              onChange={(e) => setTrainCategory(e.target.value.toUpperCase())}
              required
              helperText=" "
            />
          </Grid>

          <Grid item xs={8} sm={8} md={3}>
            <TextField
              fullWidth
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
              Sprawdź
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </LocalizationProvider>
  );
});
