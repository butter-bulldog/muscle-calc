import React from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Divider from "@material-ui/core/Divider";

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
  divider: {
    marginBottom: theme.spacing(3),
  },
}));

// テーブルのヘッダデザイン
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

// テーブルの隔行に色つける
const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default function Fivefive() {
  const classes = useStyles();

  // Hooks
  const [values, setValues] = React.useState({
    maxWeight: '',
    weightTable: [
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
    ]
  });

  const handleChange = prop => event => {
    values[prop] = Number(event.target.value);
    const maxWeight = values.maxWeight === 0 ? '' : values.maxWeight;

    // 係数 (100kgの時の重量)
    const coefficient = [
      [55,60,65,70,75],
      [60,65,70,75,80],
      [55,60,65,70,75],
      [60,65,70,75,80],
      [65,70,75,80,85],
      [60,65,70,75,80],
      [65,70,75,80,85],
      [70,75,80,85,90],
      [65,70,75,80,85],
      [70,75,80,85,90],
      [75,80,85,90,95],
      [70,75,80,85,90],
      [75,80,85,90,95],
      [80,85,90,95,100],
      [75,80,85,90,95],
      [80,85,90,95,100]
    ];

    // 係数と最大重量を元に重量を変換していく
    const weightTable = coefficient.map((weekWeight) => {
      const convertedWeekWeight = weekWeight.map((x) => {
        let weight = maxWeight / 100 * x;
        weight = weight - (weight % 2.5);
        return weight;
      });
      return convertedWeekWeight;
    });

    setValues({
      maxWeight: maxWeight,
      weightTable: weightTable,
    });
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            5x5法 メニュー生成
          </Typography>
          <Typography variant="caption" gutterBottom>
            MAX重量を入力することで、5x5法でのトレーニングメニューを生成します。
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider className={classes.divider} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="maxWeight"
            label="MAX重量"
            type="number"
            onChange={handleChange('maxWeight')}
            value={values.maxWeight}
            InputProps={{
              inputProps: { min: 0, max: 300, step: 2.5 },
              endAdornment: <InputAdornment position="end">kg</InputAdornment>,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="a dense table">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>日</StyledTableCell>
                  <StyledTableCell>1セット (5Rep)</StyledTableCell>
                  <StyledTableCell>2セット (5Rep)</StyledTableCell>
                  <StyledTableCell>3セット (5Rep)</StyledTableCell>
                  <StyledTableCell>4セット (5Rep)</StyledTableCell>
                  <StyledTableCell>5セット (5Rep)</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {values.weightTable.map((weekWeight, week) => (
                  <StyledTableRow key={week}>
                    <StyledTableCell>{week+1}</StyledTableCell>
                    <StyledTableCell>{weekWeight[0]}</StyledTableCell>
                    <StyledTableCell>{weekWeight[1]}</StyledTableCell>
                    <StyledTableCell>{weekWeight[2]}</StyledTableCell>
                    <StyledTableCell>{weekWeight[3]}</StyledTableCell>
                    <StyledTableCell>{weekWeight[4]}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
}
