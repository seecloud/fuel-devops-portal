import React, {Component} from 'react';
import {times} from 'lodash';

import LineChart from './LineChart';

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
    this.generateHealthData();
    this.interval = setInterval(() => {
      this.generateHealthData();
      this.forceUpdate();
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  generateFCIScore() {
    return times(10, Math.random);
  }

  generateResponseTime() {
    return times(10, () => Math.random() * 2000);
  }

  generateResponseSize() {
    return times(10, () => Math.random() * 10000);
  }

  generateHealthData() {
    this.healthData = this.services.reduce((result, serviceName) => {
      result[serviceName] = {
        fciScore: this.generateFCIScore(),
        responseTime: this.generateResponseTime(),
        responseSize: this.generateResponseSize()
      };
      return result;
    }, {});
  }

  render() {
    return (
      <div>
        <h1>{'Cloud Status Health Page'}</h1>
        <p>{'API Health is based on HTTP requests response metrics: codes, duration and size.'}</p>
        <p>{'FCI score is ratio of successful codes (2xx, 3xx, 4xx) to all http codes.'}</p>
        {this.services.map((serviceName) => {
          return (
            <div key={serviceName} className='service-status'>
              <div className='row'>
                <div className='col-md-3 col-xs-12 text-center'>
                  <div className='service-name'>{serviceName}{' '}{'FCI'}</div>
                  <div className='service-fci-score text-success'>{'100%'}</div>
                </div>
                {this.charts.map(({title, key}) => {
                  return (
                    <div key={title} className='col-md-3 col-xs-12 text-center'>
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
    );
  }
}
