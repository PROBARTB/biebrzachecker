import { List, ListItemButton, ListItemText, Typography, Box } from "@mui/material";
import { useRecentRouteParams, type RouteParams } from "../hooks/recentRouteParams.hooks";

interface Props {
  onSelect: (params: RouteParams) => void;
}

export function RecentRouteParams({ onSelect }: Props) {
  const { items } = useRecentRouteParams();

  if (items.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Brak ostatnich wyszukiwań
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
        Ostatnie wyszukiwania
      </Typography>

      <List dense sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
        {items.map((item, i) => (
          <ListItemButton
            key={i}
            onClick={() => onSelect(item)}
            sx={{ py: 1.2 }}
          >
            <ListItemText
              primary={`${item.trainCategory} ${item.trainNumber}`}
              secondary={`${item.fromStation?.name} → ${item.toStation?.name} • ${item.departureDate.toLocaleString()}`}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
