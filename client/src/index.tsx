import React from 'react';
import ReactDOM from 'react-dom';
import { GlobalContextProvider } from './context';
import { App } from './App';

ReactDOM.render(
  <GlobalContextProvider>
    <App />
  </GlobalContextProvider>,
  document.getElementById('root')
);
