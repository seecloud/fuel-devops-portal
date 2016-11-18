import React, {Component} from 'react';

import Navbar from './Navbar';
import DataFetchingProgressBar from './DataFetchingProgressBar';
import {Region} from '../stores/Regions';

export default class App extends Component {
  static async fetchData({regions}) {
    regions.items = [
      new Region({id: 1, name: 'Region One'}),
      new Region({id: 2, name: 'Region Two'}),
      new Region({id: 3, name: 'Region Three'}),
      new Region({id: 4, name: 'Region Four'}),
      new Region({id: 5, name: 'Region Five'})
    ];
  }

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
