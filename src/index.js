import React, { Component } from 'react'
import ReactDOM from 'react-dom';

import App from './components/App.jsx';

// Require Sass file so webpack can build it
import bootstrap from 'bootstrap/dist/css/bootstrap.css';
import style from './styles/style.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

ReactDOM.render(<App />, document.getElementById('root'));
// ReactDOM.render(
//   <div id='main'>
//     <div id='container'>
//       <Tools/>
//       <WhiteBoard/>
//     </div>
//     <History/>
//   </div>, document.getElementById('root')
// );
