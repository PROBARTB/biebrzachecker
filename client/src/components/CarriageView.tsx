import ViewCarouselRoundedIcon from "@mui/icons-material/ViewCarouselRounded";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

type Props = {
  svg: string;
};

export function CarriageView({ svg }: Props) {
  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ViewCarouselRoundedIcon color="primary" />
            <Typography variant="h6">Wagon</Typography>
          </Stack>

          <Box
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              backgroundColor: alpha("#FFFFFF", 0.76),
              p: { xs: 1, sm: 1.5 },
              overflowX: "auto",
              "& svg": {
                display: "block",
                width: "100%",
                height: "auto",
                minWidth: 720,
                maxWidth: "none",
              },
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: svg }} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
