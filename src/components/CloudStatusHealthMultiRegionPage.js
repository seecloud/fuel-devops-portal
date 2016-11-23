import React, {Component} from 'react';
import {inject} from 'mobx-react';
import {times} from 'lodash';

import CloudStatusSidebar from './CloudStatusSidebar';
import LineChart from './LineChart';
import {generateFCIScore, generateResponseTime, generateResponseSize} from '../fakeDataUtils';

@inject('uiState', 'regions')
export default class CloudStatusHealthMultiRegionPage extends Component {
  charts = [
    {title: 'FCI score', key: 'fciScore'},
    {title: 'Response Time (ms)', key: 'responseTime'},
    {title: 'Response Size (bytes)', key: 'responseSize'}
  ]

  healthData = {}

  constructor({regions}) {
    super();
    this.generateFakeData(regions);
  }

  generateFakeData(regions) {
    this.healthData = regions.items.reduce((result, region) => {
      result[region.name] = {
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
          <h1>{'Cloud Status Health: All Regions'}</h1>
          <div className='btn-toolbar'>
            <div className='btn-group pull-right'>
              <button className='btn btn-default active'>{'Day'}</button>
              <button className='btn btn-default'>{'Week'}</button>
              <button className='btn btn-default'>{'Month'}</button>
            </div>
          </div>
          {this.props.regions.items.map((region) => {
            return (
              <div key={region.name} className='service-status'>
                <div className='service-status-container'>
                  <div className='service-status-entry'>
                    <div className='service-name'>{region.name}</div>
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
                            series: [this.healthData[region.name][key]]
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
