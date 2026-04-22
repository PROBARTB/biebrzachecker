import { CircularProgress, Box, Typography } from "@mui/material";
import { useTrainRoute } from "../hooks/route.hooks";
import { type RouteQueryParams } from "../hooks/route.hooks";
import { ErrorView } from "../atoms/ErrorView";
import { TrainRouteView } from "./TrainRouteView";

type Props = {
  routeParams: RouteQueryParams;
};

export function RouteTab({ routeParams }: Props) {
  const { data, isLoading, isError, error } = useTrainRoute(routeParams);

  if (isLoading)
    return (
      <Box p={2}>
        <Typography variant="body1">Loading route…</Typography>
        <CircularProgress />
      </Box>
    );

  if (isError)
    return <ErrorView message="Failed to load route" details={String(error)} />;

  return <TrainRouteView route={data!} />;
}
