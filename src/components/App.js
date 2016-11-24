import React, {Component} from 'react';

import Navbar from './Navbar';
import DataFetchingProgressBar from './DataFetchingProgressBar';
import {Region} from '../stores/Regions';

export default class App extends Component {
  static async fetchData({regions}) {
    const response = await fetch('/api/v1/regions/');
    const responseBody = await response.json();
    regions.items = responseBody.regions.map((regionName) => new Region({name: regionName}));
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
