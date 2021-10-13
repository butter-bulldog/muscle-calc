import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';

// @see https://material-ui.com/components/material-icons/
import BorderAllIcon from '@material-ui/icons/BorderAll';
import Forward10Icon from '@material-ui/icons/Forward10';
import Filter5Icon from '@material-ui/icons/Filter5';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import SettingsIcon from '@material-ui/icons/Settings';
import AssessmentIcon from '@material-ui/icons/Assessment';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';

import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';

import About from './About';
import RmConv from './Rmconv';
import Maxweight from './Maxweight';
import Fivefive from './Fivefive';
import Test from '../Test';
import Level from './Level';

import {BrowserRouter, Link, Route, Switch} from "react-router-dom";
import Button from '@material-ui/core/Button';
import Box from "@material-ui/core/Box";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import MuiAlert from "@material-ui/lab/Alert";

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  text: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    }
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  detailSettingsBar: {
    position: 'relative',
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 16,
  },
  title: {
    flexGrow: 1
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },

}));


function createMenu(label, route, icontype) {
  return { label, route, icontype };
}

const menus = [
  // ラベル, リンク文字列&表示コンポーネント名, 表示アイコン
/*  createMenu('はじめに', 'About', 'ContactSupportIcon'), */
  createMenu('レベル測定', 'Level', 'AssessmentIcon'),
  createMenu('RM換算表', 'RmConv', 'BorderAllIcon'),
  createMenu('MAX重量計算機', 'Maxweight', 'FitnessCenterIcon'),
  createMenu('5x5法 メニュー生成', 'Fivefive', 'Filter5Icon'),
/*  createMenu('GVT法 メニュー生成', 'GVT', 'Forward10Icon'), */
/*  createMenu('テスト', 'Test', 'EmojiEmotionsIcon'), */
];

// アイコンの決定
function icon(icontype) {
  switch (icontype) {
    case 'ContactSupportIcon':
      return <ContactSupportIcon/>
    case 'AssessmentIcon':
      return <AssessmentIcon/>
    case 'FitnessCenterIcon':
      return <FitnessCenterIcon/>
    case 'Filter5Icon':
      return <Filter5Icon/>
    case 'Forward10Icon':
      return <Forward10Icon/>
    case 'EmojiEmotionsIcon':
      return <EmojiEmotionsIcon/>
    default:
      return <BorderAllIcon/>
  }
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// 子コンポーネントで詳細設定値を使いたいため、コンテキストを作成しエクスポート
export const DetailOptions = React.createContext();

export default function PersistentDrawerLeft() {
  const classes = useStyles();
  const theme = useTheme();

  // ドロワー Hooks
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // 詳細設定 Hooks
  const [detailOptions, setDetailOptions] = React.useState({
    benchpressCoefficient: 40,
    squatCoefficient: 33.3,
  });

  // 詳細設定 開閉 Hooks
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const handleClickOpen = () => {
    setSettingsOpen(true);
  };
  const handleClose = () => {
    setSettingsOpen(false);
  };

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  /**
   * 詳細設定時のハンドラー
   * @param {Object} prop プロパティ
   * @returns {void}
   */
  const handleDetailOptionsSave = prop => event => {
    detailOptions[prop] = Number(event.target.value);
    const benchpressCoefficient  = detailOptions.benchpressCoefficient === 0 ? '' : detailOptions.benchpressCoefficient;
    const squatCoefficient  = detailOptions.squatCoefficient === 0 ? '' : detailOptions.squatCoefficient;

    setDetailOptions({
      benchpressCoefficient: benchpressCoefficient,
      squatCoefficient: squatCoefficient
    });
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <BrowserRouter>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <Tooltip title="メニューを開く">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" className={classes.title} noWrap>

          </Typography>
          <Tooltip title="詳細設定">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleClickOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <SettingsIcon/>
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />

        <List>
          {menus.map((row) => (
            <ListItem button key={row.label} component={Link} to={"/" + row.route} onClick={handleDrawerClose}>
              <ListItemIcon>
                <Tooltip title={row.label}>
                  {icon(row.icontype)}
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary={row.label} />
            </ListItem>
          ))}
        </List>

        <Divider />
      </Drawer>

        <main className={classes.content}>
          <div className={classes.toolbar} />

          {/* パスに応じてコンポーネントを変える */}
          <Switch>
            <Route exact path="/About">
              <About />
            </Route>
            <Route exact path="/RmConv">
              {/* 詳細設定を子コンポーネントで使うため、コンテキスト.プロバイダーコンポーネントを設定 */}
              <DetailOptions.Provider value={[detailOptions, setDetailOptions]}>
                <RmConv />
              </DetailOptions.Provider>
            </Route>
            <Route exact path="/Maxweight">
              <DetailOptions.Provider value={[detailOptions, setDetailOptions]}>
                <Maxweight />
              </DetailOptions.Provider>
            </Route>
            <Route exact path="/Fivefive">
              <Fivefive />
            </Route>
            <Route exact path="/Test">
              <Test />
            </Route>
            <Route exact path="/Level">
              <Level />
            </Route>
            <Route path="/">
              <Level />
            </Route>
          </Switch>
        </main>

        <div>
          <Dialog fullScreen open={settingsOpen} onClose={handleClose} TransitionComponent={Transition}>
            <AppBar className={classes.detailSettingsBar}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                  詳細設定
                </Typography>
                <Button autoFocus color="inherit" onClick={handleClose}>
                  保存
                </Button>
              </Toolbar>
            </AppBar>
            <Box className={classes.text} display="block" displayPrint="block" m={1}>
              <Grid container spacing={2}>
                <Grid item md={12} sm={12} xs={12}>
                  <Alert severity="info">
                    MAX重量やRM換算はO&apos;Conner式の計算式を使用しています。<br/>
                    係数を自身の記録と照らし合わせて調整を行うことができます。<br/>
                    予測MAX重量より挙がる人は値を下げ、挙がらない人は値を上げてください。<br/>
                    <blockquote>[参考：<a href={"https://en.wikipedia.org/wiki/One-repetition_maximum#O'Conner_et_al."} color="textSecondary" target={"_blank"} rel={"noopener noreferrer"}>One-repetition maximum</a>]</blockquote>
                  </Alert>
                </Grid>

                <Grid item md={6} sm={6} xs={12}>
                  <TextField
                     id="benchpressCoefficient"
                     label="ベンチプレス係数"
                     type="number"
                     onChange={handleDetailOptionsSave('benchpressCoefficient')}
                     value={detailOptions.benchpressCoefficient}
                     InputProps={{
                       inputProps: { min: 0, max: 100, step: 0.1},
                     }}
                     InputLabelProps={{
                       shrink: true,
                     }}
                     margin="normal"
                  />
                </Grid>
                <Grid item md={6} sm={6} xs={12}>
                  <TextField
                    id="squatCoefficient"
                    label="スクワット/デッドリフト係数"
                    type="number"
                    onChange={handleDetailOptionsSave('squatCoefficient')}
                    value={detailOptions.squatCoefficient}
                    InputProps={{
                      inputProps: { min: 0, max: 100, step:0.1},
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Box>
          </Dialog>
        </div>
      </BrowserRouter>
    </div>
  );
}
