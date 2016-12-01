import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {times} from 'lodash';

import CloudStatusSidebar from './CloudStatusSidebar';
import LineChart from './LineChart';
import StatusDataPeriodPicker from './StatusDataPeriodPicker';
import {
  generateFCIScore, generateAvailability,
  generateResponseTime, generateResponseSize,
  generateAPICalls
} from '../fakeDataUtils';

@observer(['uiState', 'regions'])
export default class CloudStatusOverviewSingleRegionPage extends Component {
  static async fetchData({uiState}, {dataPeriod = uiState.activeStatusDataPeriod} = {}) {
    const url = `/api/v1/region/${
      encodeURIComponent(uiState.activeRegionName)
    }/status/${
      encodeURIComponent(dataPeriod)
    }`;
    const response = await fetch(url);
    await response.json();
  }

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

  componentWillReceiveProps() {
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
          <h1>{'Overview: ' + regionName}</h1>
          <div className='btn-toolbar'>
            <StatusDataPeriodPicker className='pull-right' />
          </div>
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
                        series: [this.healthData[key] || []]
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
