import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(() => ({
  table: {
    minWidth: 650,
  },
}));

export default function About() {

  const classes = useStyles();
  return (
    <div className={classes}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            マッスル計算機とは？
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Divider className={classes.divider} />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="caption" display="block" gutterBottom>
            MAX重量計算など様々な計算が行えます。
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            左側のメニューを選択してください！
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}