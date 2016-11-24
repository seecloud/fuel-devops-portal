import React, {Component} from 'react';
import {map} from 'lodash';

import Navbar from './Navbar';
import DataFetchingProgressBar from './DataFetchingProgressBar';
import {Region} from '../stores/Regions';

export default class App extends Component {
  static async fetchData({regions}) {
    const response = await fetch('/api/v1/regions/detailed');
    const responseBody = await response.json();
    regions.items = map(responseBody.regions, ({services}, name) => new Region({name, services}));
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
