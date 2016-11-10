import React, {Component} from 'react';

import Navbar from './navbar';

export default class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        {this.props.sidebar}
        <div className='container-fluid'>
          {this.props.main}
        </div>
      </div>
    );
  }
}
