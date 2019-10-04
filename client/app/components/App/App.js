import React, { Component } from 'react';
import {
  getFromStorage,
  setInStorage,
  removeStorage
} from '../../utils/storage';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Editor from '../Editor/Editor';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      token: '',
      verify: true,
      accounts: [],
      address_buf: '',
      privKey_buf: '',
    }
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const obj = getFromStorage('the_main_app');
    const mail = getFromStorage('email');
    const username = getFromStorage('username')
    console.log(username)
    if(obj && obj.token) {
      const {token} = obj;
      const {email} = mail;
      const {name} = username;
      console.log(token);
      console.log(email);
      fetch('/api/account/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          email: email,
        }),
      }).then(res => res.json())
      .then(json => {
        if(json.success) {
          this.setState({
            token: token,
            email: email,
            username: name,
            verify: true
          });
        }
        else {
          removeStorage('the_main_app');
          removeStorage('email');
          this.setState({
            verify: false,
          })
        }
      });
    } else {
      this.setState({
        verify: false
      });
    }
  }


  logout() {
    this.setState ({
      isLoading: true,
    });
    const obj = getFromStorage('the_main_app');
    const mail = getFromStorage("email");
    if(obj && obj.token) {
      removeStorage('the_main_app');
      removeStorage('email');
      this.setState({
        token: '',
        email: '',
        verify: false
      });
    }
  }

  render() {
    const {
      verify,
      email,
      username,
    } = this.state;
    if(verify == true) {
      return(
        <div>
          <Header logout={this.logout} username={username} user_email={email}/>
          <Editor email={email}/>
        </div>
      );
    }
    else{
      window.location.assign("/");
    }
  }
}

export default App;
