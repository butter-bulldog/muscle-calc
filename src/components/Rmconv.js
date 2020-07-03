import React from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import Grid from '@material-ui/core/Grid';

// Appコンポーネントの詳細設定のコンテキスト
import { DetailOptions }  from './App';

const useStyles = makeStyles((theme) => ({
  table: {
    width: "100%",
    minWidth: 250
  },
  divider: {
    marginBottom: theme.spacing(3),
  },
  root: {
    flexGrow: 1,
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '15ch',
    },
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 220,
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


function createData(one, two, three, four, five, six, seven, eight, nine, ten) {
  return { one, two, three, four, five, six, seven, eight, nine, ten};
}

export default function RmConv() {
  const classes = useStyles();

  // Appコンポーネントの詳細設定
  const [detailOptions]= React.useContext(DetailOptions)

  /**
   * 1行の重量データを作成
   * @param {string} type 種目
   * @param {number} weight 重量
   * @returns {{nine: *, six: *, four: *, one: *, seven: *, ten: *, two: *, three: *, five: *, eight: *}} 1行分の重量データ
   */
  function row(type, weight) {

    // Appコンポーネントの詳細設定で設定されている係数
    const benchpressCoefficient = detailOptions.benchpressCoefficient;
    const squatCoefficient      = detailOptions.squatCoefficient;

    // 種目によって係数を変更
    let coefficient = 0;
    if (type === 'benchpress') {
      coefficient = benchpressCoefficient;
    } else if (type === 'squat') {
      coefficient = squatCoefficient;
    }

    // 1行の重量 (12Rep分)
    const maxWeightList = [];

    // 1Rep目はそのまま設定
    maxWeightList.push(weight);

    // 2rep目から計算
    for (let i = 2; i <= 10; i++) {
      let maxWeight = ((weight / coefficient) * i) + weight;
      maxWeight = Math.round(maxWeight);
      maxWeightList.push(maxWeight);
    }

    return createData(
      maxWeightList[0],
      maxWeightList[1],
      maxWeightList[2],
      maxWeightList[3],
      maxWeightList[4],
      maxWeightList[5],
      maxWeightList[6],
      maxWeightList[7],
      maxWeightList[8],
      maxWeightList[9],
    );
  }

  // Hooks
  const [values, setValues] = React.useState({
    type: 'benchpress',
    startWeight: 60,
    stepWeight: 2.5,
    numberOfLines: 10,
  });

  /**
   * 値変更時のハンドラー
   * @param {Object} prop プロパティ
   * @returns {void}
   */
  const handleChange = prop => event => {

    values[prop] = event.target.value;

    const startWeight = Number(values.startWeight);
    const stepWeight = Number(values.stepWeight);
    const numberOfLines = Number(values.numberOfLines);

    setValues({
      type: values.type,
      startWeight: startWeight,
      stepWeight: stepWeight,
      numberOfLines: numberOfLines,
    });
  };

  /**
   * 換算表を作成して返す
   * @param {string} type 種目
   * @param {number} startWeight 開始重量
   * @param {number} stepWeight 刻み重量
   * @param {number} numberOfLines 行数
   * @returns {[]} 換算表
   */
  function getRows (type, startWeight, stepWeight, numberOfLines)
  {
    // 行毎の重量保存用
    let rows = [];
    for (let i = 0; i < numberOfLines; i++) {
      let lineStartweight = startWeight + (stepWeight * i);
      rows.push(row(type, lineStartweight));
    }
    return rows;
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            RM換算表
          </Typography>
          <Typography variant="body2" gutterBottom>
            挙上重量と限界回数の表を作成します。
            持ち上げられる重量と回数から、1回だけ持ち上げられる最大重量を知ることができます。
            あるいは1回だけ持ち上げられる最大重量から、持ち上げられる重量と回数を知ることができます。
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider className={classes.divider} />
        </Grid>
        <Grid item md={4} sm={6} xs={12}>
          <FormControl className={classes.formControl}>
            <InputLabel id="type-select-label">種目</InputLabel>
            {/* Select使うとStrictModeの違反ワーニングが出るがMaterial-UIは治すつもりはないらしい
              @link https://github.com/mui-org/material-ui/issues/13221 */}
            <Select
              labelId="type-select-helper-label"
              id="type-select-helper"
              value={values.type}
              onChange={handleChange('type')}
            >
              <MenuItem value="benchpress">ベンチプレス</MenuItem>
              <MenuItem value="squat">スクワット / デッドリフト</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item md={2} sm={6} xs={12}>
          <TextField
            id="startWeight"
            label="開始重量"
            type="number"
            onChange={handleChange('startWeight')}
            value={values.startWeight}
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

        <Grid item md={2} sm={6} xs={12}>
          <TextField
            id="stepWeight"
            label="刻み重量"
            type="number"
            onChange={handleChange('stepWeight')}
            value={values.stepWeight}
            InputProps={{
              inputProps: { min: 2.5, max: 10, step: 2.5 },
              endAdornment: <InputAdornment position="end">Kg</InputAdornment>,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
        </Grid>
        <Grid item md={2} sm={6} xs={12}>
          <TextField
            id="numberOfLines"
            label="行数"
            type="number"
            onChange={handleChange('numberOfLines')}
            value={values.numberOfLines}
            InputProps={{
              inputProps: { min: 1, max: 20, step: 1 },
              endAdornment: <InputAdornment position="end">行</InputAdornment>,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            margin="normal"
          />
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="RM換算表">
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>重量 / Rep</StyledTableCell>
                  <StyledTableCell>2</StyledTableCell>
                  <StyledTableCell>3</StyledTableCell>
                  <StyledTableCell>4</StyledTableCell>
                  <StyledTableCell>5</StyledTableCell>
                  <StyledTableCell>6</StyledTableCell>
                  <StyledTableCell>7</StyledTableCell>
                  <StyledTableCell>8</StyledTableCell>
                  <StyledTableCell>9</StyledTableCell>
                  <StyledTableCell>10</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {getRows(values.type, values.startWeight, values.stepWeight, values.numberOfLines).map((row) => (
                  <StyledTableRow key={row.one}>
                    <StyledTableCell>{row.one}</StyledTableCell>
                    <StyledTableCell>{row.two}</StyledTableCell>
                    <StyledTableCell>{row.three}</StyledTableCell>
                    <StyledTableCell>{row.four}</StyledTableCell>
                    <StyledTableCell>{row.five}</StyledTableCell>
                    <StyledTableCell>{row.six}</StyledTableCell>
                    <StyledTableCell>{row.seven}</StyledTableCell>
                    <StyledTableCell>{row.eight}</StyledTableCell>
                    <StyledTableCell>{row.nine}</StyledTableCell>
                    <StyledTableCell>{row.ten}</StyledTableCell>
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