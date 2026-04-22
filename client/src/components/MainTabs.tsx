import { useState } from "react";
import { Tabs, Tab, Box, Paper } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { type RouteQueryParams } from "../hooks/route.hooks";
import { RouteTab } from "./RouteTab";
import { CompositionTab } from "./CompositionTab";
import { CarriagesTab } from "./CarriagesTab";

type Props = {
  routeParams: RouteQueryParams;
};

export function MainTabs({ routeParams }: Props) {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        variant="outlined"
        sx={{
          mb: 2,
          p: 0.5,
          backgroundColor: alpha("#FFFFFF", 0.72),
        }}
      >
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Trasa" />
          <Tab label="Sklad" />
          <Tab label="Wagon" />
        </Tabs>
      </Paper>

      {tab === 0 && <RouteTab routeParams={routeParams} />}
      {tab === 1 && <CompositionTab routeParams={routeParams} />}
      {tab === 2 && <CarriagesTab routeParams={routeParams} />}
    </Box>
  );
}
