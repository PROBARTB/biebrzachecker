import DirectionsRailwayRoundedIcon from "@mui/icons-material/DirectionsRailwayRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import TrainRoundedIcon from "@mui/icons-material/TrainRounded";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type {
  TrainComposition,
  TrainCompositionCarriage,
} from "../hooks/composition.model";

type Props = {
  composition: TrainComposition;
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

function getClassLabel(value: TrainCompositionCarriage["class"]) {
  switch (value) {
    case 1:
      return "1 klasa";
    case 2:
      return "2 klasa";
    default:
      return "Bez klasy";
  }
}

function getClassColor(
  value: TrainCompositionCarriage["class"]
): "default" | "primary" | "warning" {
  switch (value) {
    case 1:
      return "warning";
    case 2:
      return "primary";
    default:
      return "default";
  }
}

export function TrainCompositionView({
  composition,
  onRefresh,
  isRefreshing = false,
}: Props) {
  const unavailableCarriages = new Set(composition.unavailableCarriages);

  const defaultClassChips = Object.entries(composition.defaultCarriageForClass).map(
    ([classKey, carriageNumber]) => ({
      key: classKey,
      label: `Klasa ${classKey}: wagon ${carriageNumber}`,
    })
  );

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
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <TrainRoundedIcon color="primary" />
                  <Typography variant="h5">Sklad</Typography>
                </Stack>

                {onRefresh ? (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshRoundedIcon />}
                    onClick={onRefresh}
                    disabled={isRefreshing}
                  >
                    Odswiez sklad
                  </Button>
                ) : null}
              </Stack>

              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography variant="h6">
                    {composition.trainName || "Brak nazwy"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {composition.rollingStockClass || "Brak typu taboru"}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                  <Chip label={`${composition.carriages.length} wagonow`} />
                  {composition.unavailableCarriages.length > 0 ? (
                    <Chip
                      color="warning"
                      variant="outlined"
                      label={`${composition.unavailableCarriages.length} niedostepnych`}
                    />
                  ) : null}
                  <Chip
                    icon={<DirectionsRailwayRoundedIcon />}
                    variant="outlined"
                    label={`Kierunek ${composition.drivingDirection}`}
                  />
                  {composition.changesDrivingDirection ? (
                    <Chip
                      icon={<SwapHorizRoundedIcon />}
                      variant="outlined"
                      label="Zmiana kierunku"
                    />
                  ) : null}
                </Stack>
              </Stack>

              {defaultClassChips.length > 0 ? (
                <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                  {defaultClassChips.map((item) => (
                    <Chip key={item.key} size="small" variant="outlined" label={item.label} />
                  ))}
                </Stack>
              ) : null}
            </Stack>
          </Paper>

          <Grid container spacing={1.5}>
            {composition.carriages.map((carriage) => {
              const isUnavailable = unavailableCarriages.has(carriage.number);

              return (
                <Grid item xs={12} sm={6} lg={4} key={carriage.number}>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.75,
                      height: "100%",
                      backgroundColor: isUnavailable
                        ? alpha("#FFF3E0", 0.72)
                        : alpha("#FFFFFF", 0.72),
                    }}
                  >
                    <Stack spacing={1.25}>
                      <Stack direction="row" justifyContent="space-between" spacing={1}>
                        <Box>
                          <Typography variant="subtitle1">Wagon {carriage.number}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {carriage.type || "Brak typu"}
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                          <Chip
                            size="small"
                            color={getClassColor(carriage.class)}
                            label={getClassLabel(carriage.class)}
                          />
                          {isUnavailable ? (
                            <Chip size="small" color="warning" label="Niedostepny" />
                          ) : null}
                        </Stack>
                      </Stack>

                      <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                        <Chip size="small" variant="outlined" label={`Nr ${carriage.number}`} />
                        {carriage.amenities.length > 0 ? (
                          <Chip
                            size="small"
                            variant="outlined"
                            label={`${carriage.amenities.length} udogodnien`}
                          />
                        ) : null}
                      </Stack>

                      {carriage.amenities.length > 0 ? (
                        <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap">
                          {carriage.amenities.map((amenity) => (
                            <Chip
                              key={`${carriage.number}-${amenity}`}
                              size="small"
                              variant="outlined"
                              label={`Kod ${amenity}`}
                            />
                          ))}
                        </Stack>
                      ) : null}
                    </Stack>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  );
}
