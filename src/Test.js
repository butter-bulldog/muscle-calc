import React from "react";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import clsx from "clsx";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Slider from "@material-ui/core/Slider";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';

import { VictoryBar, VictoryChart, VictoryAxis,
  VictoryTheme, VictoryScatter, VictoryVoronoiContainer, VictoryLabel } from 'victory';

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
  graph: {
    border: "1px solid #ccc",
    minWidth: 250,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 250,
  },
  sliderBox: {
    marginTop: theme.spacing(5),
    marginRight: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(1),
  },
  Label: {
    fontSize: "small",
    color: "#fff",
  },
  flex: {
    display: "flex",
  },
}));



// 強度基準テーブル
// 単位はポンド
// @link https://startingstrength.com/files/standards.pdf
const strengthTable = {
  'male': {
    'benchpress': [
      [0,0,0,0,0,0],
      [114,84,107,130,179,222],
      [123,91,116,142,194,242],
      [132,98,125,153,208,260],
      [148,109,140,172,234,291],
      [165,119,152,187,255,319],
      [181,128,164,201,275,343],
      [198,135,173,213,289,362],
      [220,142,183,225,306,381],
      [242,149,190,232,316,395],
      [275,153,196,239,325,407],
      [319,156,199,244,333,416],
      [453,159,204,248,340,425],
      [999,999,999,999,999,999],
    ],
    'squat': [
      [0,0,0,0,0,0],
      [114,78,144,174,240,320],
      [123,84,155,190,259,346],
      [132,91,168,205,278,369],
      [148,101,188,230,313,410],
      [165,110,204,250,342,445],
      [181,119,220,269,367,479],
      [198,125,232,285,387,504],
      [220,132,244,301,409,532],
      [242,137,255,311,423,551],
      [275,141,261,319,435,567],
      [319,144,267,326,445,580],
      [453,147,272,332,454,593],
      [999,999,999,999,999,999],
    ],
    'deadlift': [
      [0,0,0,0,0,0],
      [114,97,179,204,299,387],
      [123,105,194,222,320,414],
      [132,113,209,239,342,438],
      [148,126,234,269,380,482],
      [165,137,254,293,411,518],
      [181,148,274,315,438,548],
      [198,156,289,333,457,567],
      [220,164,305,351,479,586],
      [242,172,318,363,490,596],
      [275,176,326,373,499,602],
      [319,180,333,381,506,608],
      [453,183,340,388,512,617],
      [999,999,999,999,999,999],
    ],
  },
  'female': {
    'benchpress': [
      [0,0,0,0,0,0],
      [97,49,63,73,94,116],
      [105,53,68,79,109,124],
      [114,57,73,85,109,133],
      [123,60,77,90,116,142],
      [132,64,82,95,122,150],
      [148,70,90,105,135,165],
      [165,76,97,113,146,183],
      [181,81,104,122,158,192],
      [198,88,112,130,167,205],
      [199,92,118,137,177,217],
      [999,999,999,999,999,999],
    ],
    'squat': [
      [0,0,0,0,0,0],
      [97,46,84,98,129,163],
      [105,49,91,106,140,174],
      [114,53,98,114,150,187],
      [123,56,103,121,160,199],
      [132,59,110,127,168,211],
      [148,65,121,141,185,232],
      [165,70,130,151,200,256],
      [181,75,139,164,215,268],
      [198,81,150,174,229,288],
      [199,85,158,181,242,303],
      [999,999,999,999,999,999],
    ],
    'deadlift': [
      [0,0,0,0,0,0],
      [97,57,105,122,175,232],
      [105,61,114,132,189,242],
      [114,66,122,142,200,253],
      [123,70,129,151,211,263],
      [132,74,137,159,220,273],
      [148,81,151,176,241,295],
      [165,88,162,189,258,319],
      [181,94,174,204,273,329],
      [198,101,187,217,284,349],
      [199,107,197,229,297,364],
      [999,999,999,999,999,999],
    ],
  }
}

/**
 * ポンドからキログラムに変換
 * @param lb
 * @returns {number}
 */
function lb2kg(lb) {
  return Math.round(lb/2.2046);
}

/**
 * 棒グラフのデータを返す
 * @param type
 * @param gender
 * @param wheiht
 */
function getGraphData(type, gender, bodyWeight, weight) {

  const lbTable = strengthTable[gender][type];

  // 強度基準テーブルをポンド->キログラムに変換
  const kgTable = lbTable.map((lbRow) => {
    const kgRow = lbRow.map((lb) => {
      return lb2kg(lb);
    })
    return kgRow;
  })

  // 体重から強度レベルの行を求める
  // kgTable
  // 0:  [0, 0, 0, 0, 0, 0]
  // 1:  [52, 38, 49, 59, 81, 101]
  // 2:  [56, 41, 53, 64, 88, 110]
  // 12: [205, 72, 93, 112, 154, 193]
  // 13: [453, 453, 453, 453, 453, 453]
  // 配列の1要素目が体重、2以降がバーベル重量
  // 50kgだったら1を使いたい
  // 53kgだったら2を使いたい
  // 206kgだったら12を使いたい
  let index = kgTable.findIndex((kgRow, index) => {
    return (bodyWeight > kgTable[index][0] && bodyWeight <= kgTable[index + 1][0]);
  })
  index = index + 1;
  if (gender === 'male' && index === 13) {
    index = 12;
  }
  if (gender === 'female' && index === 11) {
    index = 10;
  }

  // 重量から強度基準の列を求める
  // 体重60kgの場合、中級69kg、上級94kgである
  // この場合、挙上が80kgの場合は中級扱いとする
  let columnIndex = 0;
  if (weight >= kgTable[index][5]) {
    columnIndex = 5;
  } else if ((weight >= kgTable[index][4]) && (weight < kgTable[index][5])) {
    columnIndex = 4;
  } else if ((weight >= kgTable[index][3]) && (weight < kgTable[index][4])) {
    columnIndex = 3;
  } else if ((weight >= kgTable[index][2]) && (weight < kgTable[index][3])) {
    columnIndex = 2;
  } else if ((weight >= kgTable[index][1]) && (weight < kgTable[index][2])) {
    columnIndex = 1;
  } else {
    columnIndex = 1;
  }


  // 標準棒グラフのデータ
  const standards = [
    {x: 1, y: kgTable[index][1]},
    {x: 2, y: kgTable[index][2]},
    {x: 3, y: kgTable[index][3]},
    {x: 4, y: kgTable[index][4]},
    {x: 5, y: kgTable[index][5]}
  ];

  // 散布図のデータ
  const myData = {
    x: columnIndex,
    y: weight,
  };

  // エリートのマックス重量もしくは挙上重量に合わせて
  // 棒グラフの最大目盛りを設定
  const eleteMaxWeight = kgTable[index][5];
  let tickFormat = [];
  if (eleteMaxWeight > 250 || weight > 250) {
    tickFormat = [0, 50, 100, 150, 200, 250, 300];
  } else if ((eleteMaxWeight <= 250 && eleteMaxWeight > 200) || (weight <= 250 && weight > 200)) {
    tickFormat = [0, 50, 100, 150, 200, 250];
  } else if ((eleteMaxWeight <= 200 && eleteMaxWeight > 150) || (weight <= 200 && weight > 150)) {
    tickFormat = [0, 50, 100, 150, 200];
  } else if ((eleteMaxWeight <= 150 && eleteMaxWeight > 100) || (weight <= 150 && weight > 100)) {
    tickFormat = [0, 50, 100, 150];
  } else if (eleteMaxWeight <= 100 || weight <= 100) {
    tickFormat = [0, 50, 100];
  }

  const result = {
    'standards': standards,
    'myData': myData,
    'tickFormat': tickFormat,
  }

  return result;
}

/**
 * 散布図ポイント
 */
class Point extends React.Component {
  render() {
    const {x, y, gender} = this.props;
    const point = (gender === 'male') ? "👨" : "👩"; /* 💪🦵👨👩 */
    return (
      <text x={x} y={y} fontSize={16}>
        {point}
      </text>
    );
  }
}

// バリデーション
Point.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  gender: PropTypes.string.isRequired,
};


export default function Level() {
  const classes = useStyles();

  // 種目と性別 hook
  const [values, setValues] = React.useState({
    type: 'benchpress',
    gender: 'male',
  });
  const handleChange = prop => event => {
    values[prop] = event.target.value;
    setValues({
      ...values
    });
  };

  // バーベル重量 hook
  const [weight, setWeight] = React.useState(40);
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
    { value: 200, label: '200',},
    { value: 250, label: '250',},
    { value: 280, label: '280kg〜',},
  ];

  // 体重 hook
  const [bodyWeight, setBodyWeight] = React.useState(60);
  const handleBodyWeightSliderChange = (event, newValue) => {
    setBodyWeight(newValue);
  }
  const bodyWeightMarks = [
    { value: 0, label: '0',},
    { value: 40, label: '40',},
    { value: 50, label: '50',},
    { value: 60, label: '60',},
    { value: 70, label: '70',},
    { value: 80, label: '80',},
    { value: 90, label: '90',},
    { value: 100, label: '100',},
    { value: 120, label: '120',},
    { value: 145, label: '145kg〜',},
  ];


  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            あなたの強さは？
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Divider className={classes.divider} />
        </Grid>

        <Grid item xs={12}>
          <FormControl className={clsx(classes.formControl)}>
            <InputLabel id="type-select-label">種目</InputLabel>
            <Select
              labelId="type-select-helper-label"
              id="type-select-helper"
              value={values.type}
              onChange={handleChange('type')}
            >
              <MenuItem value="benchpress">ベンチプレス</MenuItem>
              <MenuItem value="squat">スクワット</MenuItem>
              <MenuItem value="deadlift">デッドリフト</MenuItem>
            </Select>
          </FormControl>

          <FormControl className={clsx(classes.formControl)}>
            <FormLabel component="legend" className={classes.Label}>性別</FormLabel>
            <RadioGroup
              aria-label="gender"
              name="gender"
              value={values.gender}
              onChange={handleChange('gender')}>
              <div className={classes.flex}>
                <FormControlLabel value="male" control={<Radio />} label="男性" checked={values.gender === 'male'}/>
                <FormControlLabel value="female" control={<Radio />} label="女性" checked={values.gender === 'female'}/>
              </div>
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography className={classes.Label} id="weight-slider" gutterBottom>
            体重
          </Typography>
          <Slider
            value={bodyWeight}
            aria-labelledby="weight-slider"
            min={0}
            max={145}
            step={1}
            marks={bodyWeightMarks}
            valueLabelDisplay="on"
            onChange={handleBodyWeightSliderChange}
          />
          <Typography className={classes.Label} id="weight-slider" gutterBottom>
            挙上重量
          </Typography>
          <Slider
            value={weight}
            aria-labelledby="weight-slider"
            min={0}
            max={280}
            step={1}
            marks={weightMarks}
            valueLabelDisplay="on"
            onChange={handleWeightSliderChange}
          />
        </Grid>

        <Grid item xs={12}>
          <div className={classes.graph}>
            <VictoryChart
              // adding the material theme provided with Victory
              title="強さ標準"
              theme={VictoryTheme.material}
              height={220}
              width={450}
              domainPadding={{
                x: 10,
              }}
              animate={{ duration: 1000, easing: "bounce" }}
              containerComponent={<VictoryVoronoiContainer/>}
            >

              <VictoryAxis
                tickValues={[1, 2, 3, 4, 5]}
                tickFormat={["ほぼ未経験者\n(〜6ヶ月)", "初心者", "中級者", "上級者", "エリート"]}
                style={{
                  axisLabel: {fontSize: 8, padding: 30},
                  ticks: {stroke: "#fff", size: 5},
                  tickLabels: {fontSize: 8, fill: "#fff", padding: 5}
                }}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={getGraphData(values.type, values.gender, bodyWeight, weight)['tickFormat']}
                style={{
                  axisLabel: {fontSize: 8, padding: 30},
                  ticks: {stroke: "#d3d3d3", size: 5},
                  tickLabels: {fontSize: 8, fill: "#fff", padding: 5}
                }}
              />
              <VictoryBar horizontal
                          data={getGraphData(values.type, values.gender, bodyWeight, weight)['standards']}
                          style={{
                            data: {fill: "#BB86FC", width: 20},
                            labels: {fontSize: 8, fill: "#fff"}
                          }}
                          labels={({ datum }) => `${Math.round(datum.y)}kg`}
              />
              <VictoryScatter
                style={{
                  labels: {fontSize: 8, fill: "#B00020", fontWeight:"900"},
                }}
                animate={{
                  onLoad: {
                    duration: 2000,
                    before: () => ({ _y: 0, opacity: 0 }),
                    after: (datum) => ({ _y: datum._y, opacity: 1 })
                  },
                }}
                labelComponent={<VictoryLabel dy={5} dx={35}/>}
                labels={({ datum }) => `You: ${Math.round(datum.y)}kg`}
                size={7}
                dataComponent={<Point gender={values.gender}/>}
                data={[
                  getGraphData(values.type, values.gender, bodyWeight, weight)['myData'],
                ]}
              />
            </VictoryChart>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}