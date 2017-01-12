import React, {Component} from 'react';
import {map} from 'lodash';
import {deserialize} from 'serializr';

import request from '../request';
import Navbar from './Navbar';
import DataFetchingProgressBar from './DataFetchingProgressBar';
import {Region} from '../stores/Regions';

export default class App extends Component {
  static async fetchData({regions}) {
    const response = await request('/api/v1/regions/detailed');
    regions.items = map(response.regions, (plainRegionData, name) => {
      return deserialize(Region, {...plainRegionData, name});
    });
  }

  componentDidMount() {
    const loadingAnimation = document.getElementById('loading-animation');
    if (loadingAnimation) {
      loadingAnimation.parentNode.removeChild(loadingAnimation);
    }
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
