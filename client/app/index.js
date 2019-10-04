import React from 'react';
import { render } from 'react-dom';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

import App from './components/App/App';
import NotFound from './components/App/NotFound';

import Dashboard from './components/Dashboard/Content';
import Login from './components/Dashboard/Login';
import Login2 from './components/Dashboard/Login2';
import Signup from './components/Dashboard/Signup';
import Verify from "./components/Dashboard/Verify";
import PassPhrase from './components/Dashboard/PassPhrase';
import Wallet from './components/Wallet/Wallet';
import Setting from './components/Wallet/Setting';
import Home from './components/Home/Home';
import Editor from './components/Editor/Editor';
import Forget from './components/Dashboard/Forget';
import Forget_verify from './components/Dashboard/Forget_verify';
import New_password from './components/Dashboard/New_password';
import './styles/dashboard/icomoon.css'
import './styles/dashboard/simple-line-icons.css'
import './styles/dashboard/header.css'

render((
  <Router>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/login" component={Login}/>
        <Route path="/login2" component={Login2}/>
        <Route path="/register" component={Signup} />
        <Route path="/verify" component={Verify} />
        <Route path="/passphrase" component={PassPhrase} />
        <Route path="/wallet" component={Wallet}/>
        <Route path="/setting" component={Setting} />
        <Route path="/forget" component={Forget} />
        <Route path="/forget_verify" component={Forget_verify} />
        <Route path="/new_password" component={New_password} />
        <Route component={NotFound}/>
      </Switch>
  </Router>
), document.getElementById('app'));
