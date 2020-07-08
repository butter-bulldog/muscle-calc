import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    type: 'light' // 'light'(default) or 'dark'
  }
});

ReactDOM.render(
  <React.StrictMode>
    <MuiThemeProvider theme={theme}>
    <App />
    </MuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
