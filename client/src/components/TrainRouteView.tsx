// import { useTrainRoute, type RouteQueryParams } from "../hooks/route.hooks";
// import type { TrainStop } from "../hooks/route.model";
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Chip,
//   Divider,
//   CircularProgress,
//   Alert,
// } from "@mui/material";
// import { Train, Info, DirectionsRailway, CheckCircle, Block } from "@mui/icons-material";

// export const TrainRouteView = ({ payload }: { payload: RouteQueryParams }) => {
// //   const params = {
// //     trainCategory: "IC",
// //     trainNumber: 1516,
// //     fromEVAStationId: 5100065,
// //     toEVAStationId: 5100010,
// //     departureDate: new Date("2026-04-22T17:01:00"),
// //   };

//   const { data, isLoading, isError, error } = useTrainRoute(payload);

//   if (isLoading) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
//         <CircularProgress />
//         <Typography variant="body1" sx={{ ml: 2 }}>Fetching route...</Typography>
//       </Box>
//     );
//   }

//   if (isError) {
//     return (
//       <Alert severity="error">
//         Error: {(error as Error).message}
//       </Alert>
//     );
//   }

//   if (!data) return null;

//   const formatTime = (date: Date | null) => {
//     if (!date) return "N/A";
//     return new Intl.DateTimeFormat("pl-PL", {
//       hour: "2-digit",
//       minute: "2-digit",
//     }).format(new Date(date));
//   };

//   const calculateTravelTime = (current: TrainStop, next: TrainStop | undefined) => {
//     if (!next || !current.departure || !next.arrival) return null;
//     const diff = new Date(next.arrival).getTime() - new Date(current.departure).getTime();
//     const minutes = Math.floor(diff / 60000);
//     return `${minutes} min`;
//   };

//   return (
//     <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
//       <Card elevation={5} sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', borderRadius: 3 }}>
//         <CardContent sx={{ p: 3 }}>
//           <Typography variant="h4" component="h1" gutterBottom sx={{ display: "flex", alignItems: "center", color: 'primary.dark', fontWeight: 'bold' }}>
//             <Train sx={{ mr: 1, fontSize: '2rem' }} />
//             Szczegóły trasy pociągu {payload.trainCategory} {payload.trainNumber}
//           </Typography>

//           <Box sx={{ position: "relative" }}>
//             {data.stops.map((stop, index) => {
//               const nextStop = data.stops[index + 1];
//               const travelTime = calculateTravelTime(stop, nextStop);
//               return (
//                 <Box key={stop.stationId} sx={{ display: "flex", alignItems: "center", mb: 3, p: 1, borderRadius: 2, bgcolor: 'background.paper', boxShadow: 1 }}>
//                   <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mr: 2 }}>
//                     {index === 0 ? (
//                       <DirectionsRailway sx={{ fontSize: 24, color: 'success.main' }} />
//                     ) : index === data.stops.length - 1 ? (
//                       <DirectionsRailway sx={{ fontSize: 24, color: 'error.main' }} />
//                     ) : (
//                       <Box
//                         sx={{
//                           width: 12,
//                           height: 12,
//                           borderRadius: "50%",
//                           bgcolor: "primary.main",
//                           border: "2px solid white",
//                           boxShadow: 1,
//                         }}
//                       />
//                     )}
//                     {index < data.stops.length - 1 && (
//                       <Box
//                         sx={{
//                           width: 2,
//                           height: 80,
//                           bgcolor: "grey.400",
//                           mt: 1,
//                           borderRadius: 1,
//                         }}
//                       />
//                     )}
//                   </Box>
//                   <Box sx={{ flex: 1 }}>
//                     <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
//                       {stop.stationName} ({stop.stationId} / {stop.stationNumber})
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                       ID stacji: {stop.stationId} | Typ stacji: {stop.stationType} | Rodzaj kodu: {stop.rodzajKodStacji}
//                     </Typography>
//                     <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
//                       <Typography variant="body2" color="text.secondary">
//                         Przyjazd: {formatTime(stop.arrival)}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Odjazd: {formatTime(stop.departure)}
//                       </Typography>
//                     </Box>
//                     <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
//                       <Typography variant="body2" color="text.secondary">
//                         Peron: {stop.platform}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Tor: {stop.track}
//                       </Typography>
//                     </Box>
//                     {stop.realArrival && (
//                       <Typography variant="body2" color="primary">
//                         Rzeczywisty przyjazd: {formatTime(stop.realArrival)}
//                       </Typography>
//                     )}
//                     {stop.realDeparture && (
//                       <Typography variant="body2" color="primary">
//                         Rzeczywisty odjazd: {formatTime(stop.realDeparture)}
//                       </Typography>
//                     )}
//                     <Box sx={{ mt: 1 }}>
//                       {stop.boardingAllowed && <Chip label="Można wsiadać" size="small" color="success" sx={{ mr: 1 }} />}
//                       {stop.disembarkingAllowed && <Chip label="Można wysiadać" size="small" color="info" />}
//                     </Box>
//                     {stop.messages.length > 0 && (
//                       <Box sx={{ mt: 1 }}>
//                         {stop.messages.map((msg, i) => (
//                           <Alert key={i} severity="warning" sx={{ mt: 0.5, py: 0.5 }}>
//                             {msg.text}
//                           </Alert>
//                         ))}
//                       </Box>
//                     )}
//                     {travelTime && (
//                       <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: "italic" }}>
//                         Czas podróży do następnej stacji: {travelTime}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Box>
//               );
//             })}
//           </Box>

//           <Divider sx={{ my: 2 }} />

//           <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
//             <Info sx={{ mr: 1 }} />
//             Informacje o pociągu
//           </Typography>
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//             {data.info.map((info) => (
//               <Chip
//                 key={info.code}
//                 label={`${info.code}: ${info.description}`}
//                 variant="outlined"
//                 sx={{ mb: 1 }}
//               />
//             ))}
//           </Box>
//         </CardContent>
//       </Card>
//     </Box>
//   );
// };
export function TrainRouteView({ route }: any) {
  return <div>ROUTE VIEW (TODO)</div>;
}