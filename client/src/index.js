import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise'; 
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers';
import "antd/dist/antd.css";

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware, 
  ReduxThunk)
  (createStore);

ReactDOM.render(
    <Provider
      store={createStoreWithMiddleware(
        Reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      )}
    >
      <React.StrictMode>
      <App />
      </React.StrictMode>
    </Provider>,
    document.getElementById("root")
);
  
  reportWebVitals();