import {
  Box,
  Grid,
  IconButton,
  TextField,
  Autocomplete,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import type { TrainStop } from "../hooks/route.model";
import type { PkpicEPAStationId } from "../hooks/model";

type Props = {
  stations: TrainStop[];
  from?: PkpicEPAStationId;
  to?: PkpicEPAStationId;
  onChangeFrom: (id: PkpicEPAStationId) => void;
  onChangeTo: (id: PkpicEPAStationId) => void;
  onChangeDateFrom: (d: Date) => void;
  onChangeDateTo: (d: Date) => void;
};

export function StationRangeSelector({
  stations,
  from,
  to,
  onChangeFrom,
  onChangeTo,
  onChangeDateFrom,
  onChangeDateTo,
}: Props) {
  const stationOptions = stations.map((s) => ({
    id: s.stationEPAId,
    label: s.stationName,
  }));

  const fromIndex = stations.findIndex((s) => s.stationEPAId === from);
  const toIndex = stations.findIndex((s) => s.stationEPAId === to);

  const moveFrom = (delta: number) => {
    const newIndex = Math.min(
      Math.max(0, fromIndex + delta),
      stations.length - 1
    );
    const newStation = stations[newIndex];
    onChangeFrom(newStation.stationEPAId);

    if (toIndex < newIndex) {
      onChangeTo(newStation.stationEPAId);
    }

    onChangeDateFrom(new Date(newStation.departure!));
  };

  const moveTo = (delta: number) => {
    const newIndex = Math.min(
      Math.max(0, toIndex + delta),
      stations.length - 1
    );
    const newStation = stations[newIndex];
    onChangeTo(newStation.stationEPAId);

    if (fromIndex > newIndex) {
      onChangeFrom(newStation.stationEPAId);
    }

    onChangeDateTo(new Date(newStation.arrival!));
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Select station range
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={5}>
          <Autocomplete
            options={stationOptions}
            value={
              stationOptions.find((o) => o.id === from) ?? null
            }
            onChange={(_, val) => {
              if (!val) return;
              onChangeFrom(val.id);

              const idx = stations.findIndex((s) => s.stationEPAId === val.id);
              onChangeDateFrom(new Date(stations[idx].departure!));

              if (toIndex < idx) {
                onChangeTo(val.id);
                onChangeDateTo(new Date(stations[idx].arrival!));
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="From station" />
            )}
          />
        </Grid>

        <Grid item xs={12} md={1}>
          <Box display="flex" justifyContent="center">
            <IconButton onClick={() => moveFrom(-1)} disabled={fromIndex <= 0}>
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              onClick={() => moveFrom(1)}
              disabled={fromIndex >= stations.length - 1}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </Grid>

        <Grid item xs={12} md={5}>
          <Autocomplete
            options={stationOptions}
            value={
              stationOptions.find((o) => o.id === to) ?? null
            }
            onChange={(_, val) => {
              if (!val) return;
              onChangeTo(val.id);

              const idx = stations.findIndex((s) => s.stationEPAId === val.id);
              onChangeDateTo(new Date(stations[idx].arrival!));

              if (fromIndex > idx) {
                onChangeFrom(val.id);
                onChangeDateFrom(new Date(stations[idx].departure!));
              }
            }}
            renderInput={(params) => (
              <TextField {...params} label="To station" />
            )}
          />
        </Grid>

        <Grid item xs={12} md={1}>
          <Box display="flex" justifyContent="center">
            <IconButton onClick={() => moveTo(-1)} disabled={toIndex <= 0}>
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              onClick={() => moveTo(1)}
              disabled={toIndex >= stations.length - 1}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
