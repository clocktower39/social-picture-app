import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import socketIOClient from "socket.io-client";
import { store } from './Redux/store';
import { serverURL } from "./Redux/actions";

const container = document.getElementById('root');
const root = createRoot(container);

const socket = socketIOClient(serverURL,{transports: ['websocket'], upgrade: false});

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App  socket={socket} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
