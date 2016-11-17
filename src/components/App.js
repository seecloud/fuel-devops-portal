import React, {Component} from 'react';

import Navbar from './Navbar';
import DataFetchingProgressBar from './DataFetchingProgressBar';

export default class App extends Component {
  render() {
    return (
      <div>
        <DataFetchingProgressBar />
        <Navbar />
        {this.props.sidebar}
        <div className='container-fluid'>
          {this.props.main}
        </div>
      </div>
    );
  }
}
