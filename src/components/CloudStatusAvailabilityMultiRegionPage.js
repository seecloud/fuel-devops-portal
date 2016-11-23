import React, {Component} from 'react';
import {inject} from 'mobx-react';
import {times} from 'lodash';

import CloudStatusSidebar from './CloudStatusSidebar';
import LineChart from './LineChart';
import {generateAvailability} from '../fakeDataUtils';

@inject('uiState', 'regions')
export default class CloudStatusAvailabilityMultiRegionPage extends Component {
  charts = [
    {title: 'Availability', key: 'availability'}
  ]

  healthData = {}

  constructor({regions}) {
    super();
    this.generateFakeData(regions);
  }

  generateFakeData(regions) {
    this.healthData = regions.items.reduce((result, region) => {
      result[region.name] = {
        availability: generateAvailability()
      };
      return result;
    }, {});
  }

  render() {
    return (
      <div>
        <CloudStatusSidebar />
        <div className='container-fluid'>
          <h1>{'Cloud Status Availability: All Regions'}</h1>
          <div className='btn-toolbar'>
            <div className='btn-group pull-right'>
              <button className='btn btn-default active'>{'Day'}</button>
              <button className='btn btn-default'>{'Week'}</button>
              <button className='btn btn-default'>{'Month'}</button>
            </div>
          </div>
          {this.props.regions.items.map((region) => {
            return (
              <div key={region.name} className='service-status-wrapper'>
                <div className='service-status'>
                  <div className='service-status-container'>
                    <div className='service-status-entry'>
                      <div className='service-name'>{region.name}</div>
                      <div className='service-score text-success'>{'100%'}</div>
                    </div>
                    {this.charts.map(({title, key}) => {
                      return (
                        <div key={title} className='service-status-entry-large'>
                          <div className='chart-title'>{title}</div>
                          <LineChart
                            className='ct-double-octave'
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
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
