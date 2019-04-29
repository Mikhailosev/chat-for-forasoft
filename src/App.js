import React, { Component } from 'react';
import Layout from './components/Layout.js'
import 'bulma/css/bulma.css'

class App extends Component {
  render() {
    return (
      <div className="container">
        <Layout title="Chat app Baby"/>
      </div>
    );
  }
}

export default App;
