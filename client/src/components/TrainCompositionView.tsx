import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Divider,
  Box,
  Grid,
  Tooltip,
} from "@mui/material";
import type { TrainComposition } from "../hooks/composition.model";

interface Props {
  composition: TrainComposition;
}

export const TrainCompositionView: React.FC<Props> = ({ composition }) => {
  const {
    trainName,
    rollingStockClass,
    drivingDirection,
    changesDrivingDirection,
    defaultCarriageForClass,
    carriages,
    unavailableCarriages,
  } = composition;

  const classLabel = (cls: 0 | 1 | 2) => {
    switch (cls) {
      case 1:
        return "1 klasa";
      case 2:
        return "2 klasa";
      default:
        return "Brak klasy";
    }
  };

  const isUnavailable = (num: number) =>
    unavailableCarriages.includes(num);

  return (
    <Card variant="outlined" sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {trainName}
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Tabor: {rollingStockClass}
        </Typography>

        <Stack direction="row" spacing={1} mt={1} mb={2}>
          <Chip
            label={`Kierunek jazdy: ${drivingDirection}`}
            color="primary"
            variant="outlined"
          />
          {changesDrivingDirection && (
            <Chip
              label="Zmiana kierunku jazdy"
              color="secondary"
              variant="outlined"
            />
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Domyślne wagony dla klas
        </Typography>

        <Stack direction="row" spacing={1} mb={2}>
          {Object.entries(defaultCarriageForClass).map(([cls, num]) => (
            <Chip
              key={cls}
              label={`${cls} klasa → wagon ${num}`}
              color="primary"
              variant="outlined"
            />
          ))}
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Skład pociągu
        </Typography>

        <Grid container spacing={2}>
          {carriages.map((car) => (
            <Grid item xs={12} sm={6} md={4} key={car.number}>
              <Tooltip
                title={
                  isUnavailable(car.number)
                    ? "Wagon wyłączony z eksploatacji"
                    : ""
                }
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: isUnavailable(car.number)
                      ? "error.main"
                      : "divider",
                    backgroundColor: isUnavailable(car.number)
                      ? "error.light"
                      : "background.paper",
                    opacity: isUnavailable(car.number) ? 0.6 : 1,
                  }}
                >
                  <Typography variant="subtitle2">
                    Wagon {car.number}
                  </Typography>

                  <Typography variant="body1" color="text.secondary">
                    {classLabel(car.class)} • {car.type}
                  </Typography>

                  <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                    {car.amenities.map((a) => (
                      <Chip
                        key={a}
                        label={`Udogodnienie ${a}`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Stack>
                </Box>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};
