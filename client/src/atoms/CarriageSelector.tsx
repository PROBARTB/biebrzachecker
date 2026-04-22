import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import type { TrainCompositionCarriage } from "../hooks/composition.model";

type Props = {
  carriages: TrainCompositionCarriage[];
  selected?: number;
  onSelect: (num: number) => void;
};

export function CarriageSelector({ carriages, selected, onSelect }: Props) {
  return (
    <Box mt={2}>
      <Typography variant="subtitle1" gutterBottom>
        Select carriage
      </Typography>

      <FormControl fullWidth>
        <InputLabel id="carriage-select-label">Carriage</InputLabel>
        <Select
          labelId="carriage-select-label"
          value={selected ?? ""}
          label="Carriage"
          onChange={(e) => onSelect(Number(e.target.value))}
        >
          {carriages.map((c) => (
            <MenuItem key={c.number} value={c.number}>
              {c.number} — {c.type} ({c.class})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
