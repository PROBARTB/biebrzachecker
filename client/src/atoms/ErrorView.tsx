import { Box, Typography, Alert } from "@mui/material";

type Props = {
  message: string;
  details?: string;
};

export function ErrorView({ message, details }: Props) {
  return (
    <Box p={2}>
      <Alert severity="error">
        <Typography variant="h6">{message}</Typography>
        {details && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {details}
          </Typography>
        )}
      </Alert>
    </Box>
  );
}
