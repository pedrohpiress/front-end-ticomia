
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { Chart, useChart, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

  title?;
  subheader?;
  chart: {
    colors?;
    categories;
    series: {
      name;
      data;
    }[];
    options?;
  };
};

export function AnalyticsCurrentSubject({ title, subheader, chart, sx, ...other }) {
  const theme = useTheme();

  const chartColors = chart.colors ?? [
    theme.palette.primary.main,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  const chartOptions = useChart({
    colors
    stroke: { width: 2 },
    fill: { opacity: 0.48 },
    xaxis: {
      categories
      labels: { style: { colors: Array.from({ length: 6 }, () => theme.palette.text.secondary) } },
    },
    ...chart.options,
  });

  return (
    <Card sx={sx} {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Chart
        type="radar"
        series={chart.series}
        options={chartOptions}
        slotProps={{ loading: { py: 2.5 } }}
        sx={{
          my: 1,
          mx: 'auto',
          width: 300,
          height: 300,
        }}
      />

      <Divider sx={{ borderStyle: 'dashed' }} />

      <ChartLegends
        labels={chart.series.map((item) => item.name)}
        colors={chartOptions?.colors}
        sx={{ p: 3, justifyContent: 'center' }}
      />
    </Card>
  );
}
