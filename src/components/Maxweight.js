import React from "react";
import clsx from 'clsx';
import { makeStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Slider from '@material-ui/core/Slider';
import Divider from "@material-ui/core/Divider";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

// Appコンポーネントの詳細設定のコンテキスト
import { DetailOptions }  from './App';

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
  sliderLabel: {
    fontSize: "small",
    color: "#fff",
  },
  margin: {
    margin: theme.spacing(1),
  },
  marginLeftRight: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  unit: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(4),
  },
  sliderBox: {
    marginTop: theme.spacing(5),
    marginRight: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 220,
  },
}));


export default function Maxweight() {
  const classes = useStyles();

  // Appコンポーネントの詳細設定
  const [detailOptions]= React.useContext(DetailOptions)

  // 種目 Hooks
  const [values, setValues] = React.useState({
    type: 'benchpress',
  });
  const handleChange = prop => event => {
    values[prop] = event.target.value;
    setValues({
      type: values.type,
    });
  };

  // 重量 Hooks
  const [weight, setWeight] = React.useState(80);
  const handleWeightSliderChange = (event, newValue) => {
    setWeight(newValue);
  }
  const weightMarks = [
    { value: 0, label: '0',},
    { value: 25, label: '25',},
    { value: 50, label: '50',},
    { value: 75, label: '75',},
    { value: 100, label: '100',},
    { value: 125, label: '125',},
    { value: 150, label: '150',},
    { value: 175, label: '175',},
    { value: 200, label: '200Kg',},
  ];

  // 回数 hook
  const [count, setCount] = React.useState(10);
  const handleCountSliderChange = (event, newValue) => {
    setCount(newValue);
  }
  const countMarks = [
    { value: 0, label: '0',},
    { value: 5, label: '5',},
    { value: 10, label: '10',},
    { value: 15, label: '15',},
    { value: 20, label: '20回',},
  ];

  /**
   * 重量と回数から予測MAX重量を求める
   * @param {string} type 種目
   * @param {number} weight 挙上重量
   * @param {number} count 回数
   * @returns {number} 予測MAX重量
   */
  function getMaxWeight(type, weight, count) {

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

    // MAX計算
    // 回数が1であればその重量がMAXなのだから、入力された重量をMAX重量に設定
    // 2以上で計算式をあてる
    let maxWeight = 0;
    if (count === 1) {
      maxWeight = weight;
    } else if (count > 1) {
      // O’Conner式 MAX計算
      maxWeight = ((weight / coefficient) * count) + weight;
    }
    maxWeight = Math.round(maxWeight);
    return maxWeight;
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            MAX重量計算機
          </Typography>
          <Typography variant="body2" gutterBottom>
            重量と回数を入力することで、1回だけ持ち上げられる重量を知る事ができます。
          </Typography>

        </Grid>
        <Grid item xs={12}>
          <Divider className={classes.divider} />
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          {/* Select使うとStrictModeの違反ワーニングが出るがMaterial-UIは治すつもりはないらしい
              @link https://github.com/mui-org/material-ui/issues/13221 */}
          <FormControl className={clsx(classes.formControl)}>
            <InputLabel id="type-select-label">種目</InputLabel>
            <Select
              labelId="type-select-helper-label"
              id="type-select-helper"
              value={values.type}
              onChange={handleChange('type')}
            >
              <MenuItem value={"benchpress"}>ベンチプレス</MenuItem>
              <MenuItem value={"squat"}>スクワット / デッドリフト</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="h3" display="inline" className={clsx(classes.marginLeftRight)}>
            =
          </Typography>

          <Box display="inline">
            <Typography variant="h3" display="inline" color="secondary">
              {getMaxWeight(values.type, weight, count)}
            </Typography>
          </Box>

          <Typography variant="body1" display="inline" className={classes.unit}>
            kg
          </Typography>
        </Grid>

        <Grid item md={12} sm={12} xs={12}>
          <div className={classes.sliderBox}>
            <div className={classes.margin}>
              <Typography className={classes.sliderLabel} id="weight-slider" gutterBottom>
                重量
              </Typography>

              <Slider
                value={weight}
                aria-labelledby="weight-slider"
                min={0}
                max={200}
                step={1}
                marks={weightMarks}
                valueLabelDisplay="on"
                onChange={handleWeightSliderChange}
              />
            </div>
            <div className={classes.margin}>
              <Typography className={classes.sliderLabel} id="count-slider" gutterBottom>
                回数
              </Typography>
              <Slider
                value={count}
                aria-labelledby="count-slider"
                min={0}
                max={20}
                step={1}
                marks={countMarks}
                valueLabelDisplay="on"
                onChange={handleCountSliderChange}
              />
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}