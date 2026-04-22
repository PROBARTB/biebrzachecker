import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

import { TrainCompositionView } from "./TrainCompositionView";
import { useTrainRoute } from "../hooks/route.hooks";
import { useTrainComposition } from "../hooks/composition.hooks";

import type { RouteQueryParams } from "../hooks/route.hooks";

interface Props {
  routeParams: RouteQueryParams | null;
}

export const TrainCompositionRouteWrapper: React.FC<Props> = ({ routeParams }) => {
  const { data: route, isLoading, error } = useTrainRoute(routeParams);

  const [selectedSegment, setSelectedSegment] = useState<number | "">("");

  // Tworzymy segmenty: stop[i] → stop[i+1]
  const segments = useMemo(() => {
    if (!route) return [];
    const arr = [];
    for (let i = 0; i < route.stops.length - 1; i++) {
      arr.push({
        from: route.stops[i],
        to: route.stops[i + 1],
      });
    }
    return arr;
  }, [route]);

  // Pobieramy skład tylko jeśli wybrano segment
  const compositionQuery =
    selectedSegment !== "" && segments[selectedSegment]
      ? useTrainComposition({
          departureStationEPAId: segments[selectedSegment].from.stationId,
          arrivalStationEPAId: segments[selectedSegment].to.stationId,
        })
      : { data: null, loading: false, error: null };

  const { data: composition, loading: compLoading, error: compError } = compositionQuery;

  if (!routeParams) {
    return (
      <Typography sx={{ mt: 2 }}>
        Wyszukaj połączenie, aby zobaczyć skład pociągu
      </Typography>
    );
  }

  if (isLoading) return <Typography>Ładowanie trasy…</Typography>;
  if (error) return <Typography>Błąd pobierania trasy</Typography>;
  if (!route) return null;

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Skład pociągu na wybranym odcinku
        </Typography>

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="segment-select-label">Odcinek trasy</InputLabel>
          <Select
            labelId="segment-select-label"
            label="Odcinek trasy"
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value as number)}
          >
            {segments.map((seg, idx) => (
              <MenuItem key={idx} value={idx}>
                {seg.from.stationName} → {seg.to.stationName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {compLoading && (
          <Typography sx={{ mt: 2 }}>Ładowanie składu…</Typography>
        )}

        {compError && (
          <Typography sx={{ mt: 2 }} color="error">
            Błąd pobierania składu
          </Typography>
        )}

        {composition && (
          <Box sx={{ mt: 3 }}>
            <TrainCompositionView composition={composition} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
