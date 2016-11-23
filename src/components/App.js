import React, {Component} from 'react';

import Navbar from './Navbar';
import DataFetchingProgressBar from './DataFetchingProgressBar';
import {Region} from '../stores/Regions';

export default class App extends Component {
  static async fetchData({regions}) {
    regions.items = [
      new Region({name: 'Region One'}),
      new Region({name: 'Region Two'}),
      new Region({name: 'Region Three'}),
      new Region({name: 'Region Four'}),
      new Region({name: 'Region Five'})
    ];
  }

  render() {
    const {children, location} = this.props;
    return (
      <div>
        <DataFetchingProgressBar />
        <Navbar location={location} />
        {children}
      </div>
    );
  }
}
