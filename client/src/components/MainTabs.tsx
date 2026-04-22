import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
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
      <Tabs value={tab} onChange={(_, v) => setTab(v)}>
        <Tab label="Route" />
        <Tab label="Composition" />
        <Tab label="Carriages" />
      </Tabs>

      {tab === 0 && <RouteTab routeParams={routeParams} />}
      {tab === 1 && <CompositionTab routeParams={routeParams} />}
      {tab === 2 && <CarriagesTab routeParams={routeParams} />}
    </Box>
  );
}
