import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {times} from 'lodash';

import CloudStatusSidebar from './CloudStatusSidebar';
import StatusDataPeriodPicker from './StatusDataPeriodPicker';
import LineChart from './LineChart';
import {generateFCIScore, generateResponseTime, generateResponseSize} from '../fakeDataUtils';

@observer(['uiState', 'regions'])
export default class CloudStatusHealthSingleRegionPage extends Component {
  static async fetchData({uiState}, {dataPeriod = uiState.activeStatusDataPeriod} = {}) {
    const url = `/api/v1/region/${
      encodeURIComponent(uiState.activeRegionName)
    }/status/health/${
      encodeURIComponent(dataPeriod)
    }`;
    const response = await fetch(url);
    await response.json();
  }

  charts = [
    {title: 'FCI score', key: 'fciScore'},
    {title: 'Response Time (ms)', key: 'responseTime'},
    {title: 'Response Size (bytes)', key: 'responseSize'}
  ]

  services = ['Keystone', 'Nova', 'Glance', 'Cinder', 'Newtron']

  healthData = {}

  constructor() {
    super();
    this.generateFakeData();
  }

  componentWillReceiveProps() {
    this.generateFakeData();
  }

  generateFakeData() {
    this.healthData = this.services.reduce((result, serviceName) => {
      result[serviceName] = {
        fciScore: generateFCIScore(),
        responseTime: generateResponseTime(),
        responseSize: generateResponseSize()
      };
      return result;
    }, {});
  }

  render() {
    const regionName = this.props.uiState.activeRegionName;

    return (
      <div>
        <CloudStatusSidebar />
        <div className='container-fluid'>
          <h1>{'Health: ' + regionName}</h1>
          <div className='btn-toolbar'>
            <StatusDataPeriodPicker className='pull-right' />
          </div>
          {this.services.map((serviceName) => {
            return (
              <div key={serviceName} className='service-status'>
                <div className='service-status-container'>
                  <div className='service-status-entry'>
                    <div className='service-name'>{serviceName}{' '}{'FCI'}</div>
                    <div className='service-score text-success'>{'100%'}</div>
                  </div>
                  {this.charts.map(({title, key}) => {
                    return (
                      <div key={title} className='service-status-entry'>
                        <div className='chart-title'>{title}</div>
                        <LineChart
                          className='ct-major-twelfth'
                          data={{
                            labels: times(10).map((n) => `${n + 1}:00`),
                            series: [this.healthData[serviceName][key]]
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
