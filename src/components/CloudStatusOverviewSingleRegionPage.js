import React, {Component} from 'react';
import {observable} from 'mobx';
import {observer, inject} from 'mobx-react';
import {times} from 'lodash';
import cx from 'classnames';

import CloudStatusSidebar from './CloudStatusSidebar';
import LineChart from './LineChart';
import {
  generateFCIScore, generateAvailability,
  generateResponseTime, generateResponseSize,
  generateAPICalls
} from '../fakeDataUtils';

@inject('uiState', 'regions')
@observer
export default class CloudStatusOverviewPage extends Component {
  charts = [
    {title: 'FCI score', key: 'fciScore'},
    {title: 'Availability', key: 'availability'},
    {title: 'Response Time (ms)', key: 'responseTime'},
    {title: 'Response Size (bytes)', key: 'responseSize'},
    {title: 'API calls', key: 'apiCalls'},
    {title: 'Performance', key: ''},
  ]

  healthData = {}

  constructor() {
    super();
    this.generateFakeData();
  }

  generateFakeData() {
    this.healthData = {
      fciScore: generateFCIScore(),
      availability: generateAvailability(),
      responseTime: generateResponseTime(),
      responseSize: generateResponseSize(),
      apiCalls: generateAPICalls()
    };
  }

  render() {
    const regionName = this.props.uiState.activeRegionName;
    return (
      <div>
        <CloudStatusSidebar />
        <div className='container-fluid'>
          <h1>{'Cloud Status Overview: ' + regionName}</h1>
          <div className='btn-toolbar'>
            <div className='btn-group pull-right'>
              <button className='btn btn-default active'>{'Day'}</button>
              <button className='btn btn-default'>{'Week'}</button>
              <button className='btn btn-default'>{'Month'}</button>
            </div>
          </div>
          <hr />
          <div className='service-status'>
            <div className='service-status-container'>
              {this.charts.map(({title, key}) => {
                return (
                  <div key={title} className='service-status-entry'>
                    <div className='chart-title'>{title}</div>
                    <LineChart
                      className='ct-major-twelfth'
                      data={{
                        labels: times(10).map((n) => `${n + 1}:00`),
                        series: [this.healthData[key]]
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
