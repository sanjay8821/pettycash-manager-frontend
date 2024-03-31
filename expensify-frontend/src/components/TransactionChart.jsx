import Paper from "@mui/material/Paper";
import {
  Chart,
  BarSeries,
  Tooltip,
  ArgumentAxis,
  ValueAxis,
} from "@devexpress/dx-react-chart-material-ui";
import { scaleBand } from "@devexpress/dx-chart-core";

import {
  EventTracker,
  Animation,
  ArgumentScale,
  Stack,
} from "@devexpress/dx-react-chart";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { Typography } from "@mui/material";
import { useTheme } from "@emotion/react";

export default function TransactionChart() {
  const { transactions } = useSelector((state) => state.transaction);
  const theme = useTheme();
  const data = transactions?.map((item) => {
    const month = dayjs(item?.transactions[0].date).format("MMMM YYYY");
    return { ...item, month, raw: item?.transactions[0].date };
  });

  const chartData = data.sort((a, b) => {
    return new Date(a.raw) - new Date(b.raw);
  });

  return (
    <Paper sx={{ mt: 10, paddingLeft: 5, paddingRight: 5 }}>
      <Typography
        sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}` }}
        padding={2}
        variant="h6"
        textAlign={"center"}
      >
        Month Wise Expense
      </Typography>

      <Chart data={chartData}>
        <ArgumentScale factory={scaleBand} />
        <ArgumentAxis />
        <ValueAxis />
        <BarSeries
          color="#8758ff"
          valueField="totalTransaction"
          argumentField="month"
        />
        <EventTracker />
        <Animation />
        <Tooltip />
      </Chart>
    </Paper>
  );
}
