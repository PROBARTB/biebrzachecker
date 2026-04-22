import { useEffect, useState } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useTrainRoute } from "../hooks/route.hooks";
import { useTrainComposition } from "../hooks/composition.hooks";
import { type RouteQueryParams } from "../hooks/route.hooks";
import { type PkpicEPAStationId } from "../hooks/model";
import { ErrorView } from "../atoms/ErrorView";
import { StationRangeSelector } from "../atoms/StationRangeSelector";
import { TrainCompositionView } from "./TrainCompositionView";
import type { TrainStop } from "../hooks/route.model";

type Props = {
  routeParams: RouteQueryParams;
};

export function CompositionTab({ routeParams }: Props) {
  const [from, setFrom] = useState<PkpicEPAStationId | undefined>();
  const [to, setTo] = useState<PkpicEPAStationId | undefined>();
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const routeQuery = useTrainRoute(routeParams);

    const ready =
    from !== undefined &&
    to !== undefined &&
    dateFrom !== undefined &&
    dateTo !== undefined;

  const compositionQuery = useTrainComposition(
    {
      trainCategory: routeParams.trainCategory,
      trainNumber: routeParams.trainNumber,
      departureDate: dateFrom ?? new Date("1969-04-22"), // these 4 should never end up in the request ;)
      departureStationEPAId: from ?? 0 as PkpicEPAStationId,
      arrivalDate: dateTo ?? new Date("1969-04-22"),
      arrivalStationEPAId: to ?? 0 as PkpicEPAStationId,
    },
    {
      enabled: ready,
    }
  );


  useEffect(() => {
    if (!routeQuery.data) return;

    const stops: TrainStop[] = routeQuery.data.stops;

    if (!from) setFrom(stops[0].stationEPAId);
    if (!to) setTo(stops[stops.length - 1].stationEPAId);

    if (!dateFrom) setDateFrom(new Date(stops[0].departure!));
    if (!dateTo) setDateTo(new Date(stops[stops.length-1].arrival!));

  }, [routeQuery.data]);


  if (routeQuery.isLoading)
    return (
      <Box p={2}>
        <Typography>Loading route…</Typography>
        <CircularProgress />
      </Box>
    );

  if (routeQuery.isError)
    return (
      <ErrorView
        message="Failed to load route"
        details={String(routeQuery.error)}
      />
    );

  const stations = routeQuery.data!.stops;

  return (
    <Box p={2}>
      <StationRangeSelector
        stations={stations}
        from={from}
        to={to}
        onChangeFrom={setFrom}
        onChangeTo={setTo}
        onChangeDateFrom={setDateFrom}
        onChangeDateTo={setDateTo}
      />

      {compositionQuery.isLoading && (
        <Box mt={2}>
          <Typography>Loading composition…</Typography>
          <CircularProgress />
        </Box>
      )}

      {compositionQuery.isError && (
        <ErrorView
          message="Failed to load composition"
          details={String(compositionQuery)}
        />
      )}

      {compositionQuery.data && (
        <TrainCompositionView composition={compositionQuery.data} />
      )}
    </Box>
  );
}
