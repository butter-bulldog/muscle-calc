import React from "react";
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
import Link from '@material-ui/core/Link';
import indigo from '@material-ui/core/colors/indigo';

import { VictoryBar, VictoryChart, VictoryAxis,
  VictoryTheme, VictoryScatter, VictoryVoronoiContainer, VictoryLabel, VictoryStack,
  VictoryPortal} from 'victory';
import PropTypes from "prop-types";

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
    color: "#0000008a",
  },
  flex: {
    display: "flex",
  },
  graph: {
    border: "1px solid #ccc",
    minWidth: 250,
  },
}));


/**
 * 強度基準テーブル (単位はポンド)
 * @type {{female: {squat: number[][], deadlift: number[][], benchpress: number[][]}, male: {squat: number[][], deadlift: number[][], benchpress: number[][]}}}
 * @link https://startingstrength.com/files/standards.pdf
 */
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
 * @param {number} lb ポンド
 * @returns {number} キログラム
 */
function lb2kg(lb) {
  return Math.round(lb/2.2046);
}

/**
 * 棒グラフのデータを返す
 * @param {string} type 種目
 * @param {string} gender 性別
 * @param {number} bodyWeight 体重
 * @param {number} weight 挙上重量
 * @returns {{standards: ({x: number, y: number, label: string})[], tickFormat: [], myData: {x: number, y: *}}} 棒グラフのデータ
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
  let index = kgTable.findIndex((kgRow, idx) => {
    return (bodyWeight > kgTable[idx][0] && bodyWeight <= kgTable[idx + 1][0]);
  })
  index = index + 1;
  if (gender === 'male' && index === 13) {
    index = 12;
  }
  if (gender === 'female' && index === 11) {
    index = 10;
  }


  // エリートのマックス重量もしくは挙上重量に合わせて棒グラフの最大目盛りを設定
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

  // 積み上げ棒グラフのデータ
  // 積み上げなので単純に挙上重量を設定するだけではだめ
  // 例) 2個目の値は、1個目との差分を設定する
  const weightL1 = Math.round(kgTable[index][1]);
  const weightL2 = Math.round(kgTable[index][2]);
  const weightL3 = Math.round(kgTable[index][3]);
  const weightL4 = Math.round(kgTable[index][4]);
  const weightL5 = Math.round(kgTable[index][5]);
  
  const standards = [
    {x: 1, y: weightL1, label:`未経験\n(${weightL1}kg〜)`},
    {x: 1, y: weightL2-weightL1, label:`初心者\n(${weightL2}kg〜)`},
    {x: 1, y: weightL3-weightL2, label:`中級者\n(${weightL3}kg〜)`},
    {x: 1, y: weightL4-weightL3, label:`上級者\n(${weightL4}kg〜)`},
    {x: 1, y: weightL5-weightL4, label:`エリート\n(${weightL5}kg〜)`},
    {x: 1, y: tickFormat[tickFormat.length-1]-weightL5} /* 最後は最大目盛りからエリートの重量の差分 */
  ];

  // 自身の記録(散布図)のデータ
  const myData = {
    x: 1,
    y: weight,
  };

  const result = {
    'standards': standards,
    'myData': myData,
    'tickFormat': tickFormat,
  }

  return result;
}

/**
 * 自身の挙上重量ポイント
 * (散布図のプロット)
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
  x: PropTypes.number,
  y: PropTypes.number,
  gender: PropTypes.string.isRequired,
};

export default function Level() {
  const classes = useStyles();

  // 種目と性別 Hooks
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

  // バーベル重量 Hooks
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

  // 体重 Hooks
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

  const graphData = getGraphData(values.type, values.gender, bodyWeight, weight);

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            レベルを知る
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            種目別に自分がどの程度のレベルなのかを確認することができます。
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Divider className={classes.divider} />
        </Grid>

        <Grid item xs={12}>
          <FormControl className={clsx(classes.formControl)}>
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
              theme={VictoryTheme.material}
              animate={{ duration: 900, onLoad: {duration: 1500}, easing: "bounce" }}
              containerComponent={<VictoryVoronoiContainer/>}
              height={180}
              width={600}
            >
              <VictoryAxis
                tickFormat={["基準値"]}
                style={{
                  ticks: {stroke: "#0000008a", size: 5},
                  tickLabels: {fontSize: 10, fill: "#0000008a", padding: 5},
                }}
              />
              <VictoryAxis
                dependentAxis
                tickFormat={graphData.tickFormat}
                style={{
                  ticks: {stroke: "#0000008a", size: 5},
                  tickLabels: {fontSize: 10, fill: "#0000008a", padding: 5}
                }}
              />
              <VictoryStack
                horizontal
                colorScale={[indigo[100], indigo[200], indigo[300], indigo[400], indigo[500], indigo[600]]}
                style={{
                  data: { width: 40 },
                  labels: { padding: -20, size: 4},
                }}
                labelComponent={
                  <VictoryPortal>
                    <VictoryLabel dy={-35} style={{fontSize: 10, fill: "#0000008a"}}/>
                  </VictoryPortal>
                }
              >
                <VictoryBar
                  data={[
                    graphData.standards[0],
                  ]}
                />
                {/* VictoryBarの中に以下のようにラベルを設定できるが、yは積み上げ差分の値なのでkgには使えない。別途dataに設定する */}
                {/* labels={({ datum }) => `未経験者\n(${datum.y}kg〜)`} */}
                <VictoryBar
                  data={[
                    graphData.standards[1],
                  ]}
                />
                <VictoryBar
                  data={[
                    graphData.standards[2],
                  ]}
                />
                <VictoryBar
                  data={[
                    graphData.standards[3],
                  ]}
                />
                <VictoryBar
                  data={[
                    graphData.standards[4],
                  ]}
                />
                <VictoryBar
                  data={[
                    graphData.standards[5],
                  ]}
                />
              </VictoryStack>
              <VictoryScatter
                dataComponent={<Point gender={values.gender}/>}
                labelComponent={<VictoryLabel dy={7} dx={-10}/>}
                labels={({ datum }) => `You (${Math.round(datum.y)}kg)`}
                style={{
                  labels: {fontSize: 10, fill: "#c51162", fontWeight:"900"},
                }}
                animate={{
                  duration: 900,
                  onLoad: {
                    duration: 1700,
                    before: () => ({ _y: 0, opacity: 0 }),
                    after: (datum) => ({ _y: datum._y, opacity: 1 })
                  },
                }}
                data={[
                  graphData.myData,
                ]}
              />
            </VictoryChart>
            <Grid item xs={12}>
              <blockquote>
                [参考：Starting Strength&nbsp;
                <Link href="https://startingstrength.com/files/standards.pdf" color="textSecondary" target="_blank" rel="noreferrer" >
                  Strength Standards
                </Link>
                ]
              </blockquote>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}