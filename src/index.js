import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './Login';
import Profile from './profile';

ReactDOM.render(<Login /> ,  document.getElementById('root'));


// const convertTime = (anytime) => {
//     let months = ['JAN', 'FEB', 'MAR', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
//     let s = anytime.toDate();
//     s = String(s);
//     let t, tm = '' ;
//     let check = s.substring(4,7);
//     let check2 = s.substring(8, 10);
//     let date = new Date();
//     if(check===months[date.getMonth()]){
//       t = date.getDate()+1 - Number(check2);
//     }
//     t += s.substring(4,15);
//     let k = s.substring(16,21);
//     k = tConvert(k);
//     t += ', '+k;
//     return t;
//   }
