import React, {Component} from 'react';
import {times} from 'lodash';

import CloudStatusSidebar from './CloudStatusSidebar';
import LineChart from './LineChart';
import {generateFCIScore, generateResponseTime, generateResponseSize} from '../fakeDataUtils';

export default class CloudStatusHealthPage extends Component {
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
    return (
      <div>
        <CloudStatusSidebar />
        <div className='container-fluid'>
          <h1>{'Cloud Status Health Page'}</h1>
          <p>
            {'API Health is based on HTTP requests response metrics: codes, duration and size. '}
            {'FCI score is ratio of successful codes (2xx, 3xx, 4xx) to all http codes.'}
          </p>
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
