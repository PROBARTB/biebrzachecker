import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { TrainRoute, TrainStop } from "../hooks/route.model";

type Props = {
  route: TrainRoute;
};

type MaybeDate = Date | string | null | undefined;

const dateTimeFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const timeFormatter = new Intl.DateTimeFormat("pl-PL", {
  hour: "2-digit",
  minute: "2-digit",
});

function toDate(value: MaybeDate): Date | null {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateTime(value: MaybeDate) {
  const date = toDate(value);
  return date ? dateTimeFormatter.format(date) : "brak";
}

function formatTime(value: MaybeDate) {
  const date = toDate(value);
  return date ? timeFormatter.format(date) : "brak";
}

function formatDurationMinutes(value: number | null) {
  if (value === null) return "brak";
  if (value < 60) return `${value} min`;
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}

function getDurationMinutes(start: MaybeDate, end: MaybeDate) {
  const startDate = toDate(start);
  const endDate = toDate(end);
  if (!startDate || !endDate) return null;
  return Math.round((endDate.getTime() - startDate.getTime()) / 60000);
}

function getDelayMinutes(planned: MaybeDate, actual: MaybeDate) {
  const plannedDate = toDate(planned);
  const actualDate = toDate(actual);
  if (!plannedDate || !actualDate) return null;
  return Math.round((actualDate.getTime() - plannedDate.getTime()) / 60000);
}

function delayChipLabel(planned: MaybeDate, actual: MaybeDate) {
  const delay = getDelayMinutes(planned, actual);
  if (delay === null) return null;
  if (delay === 0) return "Punktualnie";
  if (delay > 0) return `+${delay} min`;
  return `-${Math.abs(delay)} min`;
}

function RouteStopRow({
  stop,
  isLast,
  nextStop,
}: {
  stop: TrainStop;
  isLast: boolean;
  nextStop?: TrainStop;
}) {
  const arrivalDelayLabel = delayChipLabel(stop.arrival, stop.realArrival);
  const departureDelayLabel = delayChipLabel(stop.departure, stop.realDeparture);
  const rideToNext = nextStop
    ? getDurationMinutes(stop.departure ?? stop.realDeparture, nextStop.arrival ?? nextStop.realArrival)
    : null;

  const codeChips = [
    `EVA ${stop.stationId}`,
    `EPA ${stop.stationEPAId}`,
    stop.stationCode ? `Kod ${stop.stationCode}` : null,
    stop.stationNumber ? `Nr ${stop.stationNumber}` : null,
    stop.platform ? `Peron ${stop.platform}` : null,
    stop.track ? `Tor ${stop.track}` : null,
  ].filter(Boolean) as string[];

  return (
    <Box sx={{ display: "flex", gap: 1.5, alignItems: "stretch" }}>
      <Box sx={{ width: 18, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <CircleRoundedIcon sx={{ fontSize: 14, color: "primary.main", mt: 1.1 }} />
        {!isLast ? (
          <Box sx={{ width: 2, flex: 1, minHeight: 46, bgcolor: "divider", mt: 0.5 }} />
        ) : null}
      </Box>

      <Paper
        variant="outlined"
        sx={{
          flex: 1,
          p: 1.75,
          backgroundColor: alpha("#FFFFFF", 0.78),
        }}
      >
        <Stack spacing={1.25}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={1.5}
          >
            <Box>
              <Typography variant="subtitle1">{stop.stationName}</Typography>
              <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap" sx={{ mt: 0.75 }}>
                {codeChips.map((item) => (
                  <Chip key={`${stop.stationId}-${item}`} size="small" label={item} variant="outlined" />
                ))}
              </Stack>
            </Box>

            <Stack direction="row" spacing={2.5} sx={{ minWidth: { md: 260 } }}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Przyjazd
                </Typography>
                <Typography variant="subtitle1">{formatTime(stop.arrival)}</Typography>
                {stop.realArrival ? (
                  <Typography variant="body2" color="text.secondary">
                    Rzecz. {formatTime(stop.realArrival)}
                  </Typography>
                ) : null}
                {arrivalDelayLabel ? (
                  <Chip
                    size="small"
                    color={getDelayMinutes(stop.arrival, stop.realArrival)! > 0 ? "warning" : "success"}
                    label={arrivalDelayLabel}
                    sx={{ mt: 0.75 }}
                  />
                ) : null}
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Odjazd
                </Typography>
                <Typography variant="subtitle1">{formatTime(stop.departure)}</Typography>
                {stop.realDeparture ? (
                  <Typography variant="body2" color="text.secondary">
                    Rzecz. {formatTime(stop.realDeparture)}
                  </Typography>
                ) : null}
                {departureDelayLabel ? (
                  <Chip
                    size="small"
                    color={getDelayMinutes(stop.departure, stop.realDeparture)! > 0 ? "warning" : "success"}
                    label={departureDelayLabel}
                    sx={{ mt: 0.75 }}
                  />
                ) : null}
              </Box>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
            <Chip
              size="small"
              label={`Wsiadanie ${stop.boardingAllowed ? "tak" : "nie"}`}
              color={stop.boardingAllowed ? "primary" : "default"}
              variant={stop.boardingAllowed ? "filled" : "outlined"}
            />
            <Chip
              size="small"
              label={`Wysiadanie ${stop.disembarkingAllowed ? "tak" : "nie"}`}
              color={stop.disembarkingAllowed ? "primary" : "default"}
              variant={stop.disembarkingAllowed ? "filled" : "outlined"}
            />
            {rideToNext !== null && nextStop ? (
              <Chip
                size="small"
                variant="outlined"
                label={`Do ${nextStop.stationName}: ${formatDurationMinutes(rideToNext)}`}
              />
            ) : null}
          </Stack>

          {stop.messages.length > 0 ? (
            <Stack spacing={0.75}>
              {stop.messages.map((message, index) => (
                <Alert
                  key={`${stop.stationId}-${index}`}
                  severity="warning"
                  variant="outlined"
                  icon={<WarningAmberRoundedIcon />}
                  sx={{ py: 0 }}
                >
                  {message.text}
                </Alert>
              ))}
            </Stack>
          ) : null}
        </Stack>
      </Paper>
    </Box>
  );
}

export function TrainRouteView({ route }: Props) {
  if (route.stops.length === 0) {
    return <Alert severity="info">Brak punktow trasy do wyswietlenia.</Alert>;
  }

  const firstStop = route.stops[0];
  const lastStop = route.stops[route.stops.length - 1];

  const plannedDuration = getDurationMinutes(
    firstStop.departure ?? firstStop.arrival,
    lastStop.arrival ?? lastStop.departure
  );
  const actualDuration =
    firstStop.realDeparture && lastStop.realArrival
      ? getDurationMinutes(firstStop.realDeparture, lastStop.realArrival)
      : null;

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={2.5}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              backgroundColor: alpha("#FFFFFF", 0.72),
            }}
          >
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <RouteRoundedIcon color="primary" />
                <Typography variant="h5">Trasa</Typography>
              </Stack>

              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography variant="h6">
                    {firstStop.stationName} - {lastStop.stationName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {formatDateTime(firstStop.departure ?? firstStop.arrival)} -{" "}
                    {formatDateTime(lastStop.arrival ?? lastStop.departure)}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Chip label={`${route.stops.length} punktow`} />
                  <Chip label={`Plan ${formatDurationMinutes(plannedDuration)}`} variant="outlined" />
                  {actualDuration !== null ? (
                    <Chip label={`Rzecz. ${formatDurationMinutes(actualDuration)}`} variant="outlined" />
                  ) : null}
                </Stack>
              </Stack>
            </Stack>
          </Paper>

          <Stack spacing={1.5}>
            {route.stops.map((stop, index) => (
              <RouteStopRow
                key={`${stop.stationId}-${index}`}
                stop={stop}
                nextStop={route.stops[index + 1]}
                isLast={index === route.stops.length - 1}
              />
            ))}
          </Stack>

          {route.info.length > 0 ? (
            <>
              <Divider />
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  backgroundColor: alpha("#FFFFFF", 0.68),
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <InfoOutlinedIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle1">Informacje o trasie</Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                    {route.info.map((info, index) => (
                      <Chip
                        key={`${info.code}-${info.stationTo}-${index}`}
                        size="small"
                        variant="outlined"
                        label={`${info.code}: ${info.description} (${info.stationTo})`}
                      />
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            </>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}
