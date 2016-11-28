import React, {Component} from 'react';
import {inject} from 'mobx-react';

import CloudStatusSidebar from './CloudStatusSidebar';
import StatusDataPeriodPicker from './StatusDataPeriodPicker';
import LineChart from './LineChart';
import Score from './Score';

@inject('uiState', 'regions', 'regionAvailabilityData')
export default class CloudStatusAvailabilityMultiRegionPage extends Component {
  static async fetchData({uiState, regionAvailabilityData}) {
    const url = `/api/v1/status/availability/${
      encodeURIComponent(uiState.activeStatusDataPeriod)
    }`;
    const response = await fetch(url);
    const responseBody = await response.json();
    regionAvailabilityData.update(uiState.activeStatusDataPeriod, responseBody.availability);
  }

  render() {
    const {uiState, regionAvailabilityData} = this.props;
    return (
      <div>
        <CloudStatusSidebar />
        <div className='container-fluid'>
          <h1>{'Cloud Status Availability: All Regions'}</h1>
          <div className='btn-toolbar'>
            <StatusDataPeriodPicker className='pull-right' />
          </div>
          {this.props.regions.items.map((region) => {
            const availability = regionAvailabilityData.get(
              region.name, uiState.activeStatusDataPeriod
            );
            if (!availability) return null;
            return (
              <div key={region.name} className='service-status-wrapper'>
                <div className='service-status'>
                  <div className='service-status-container'>
                    <div className='service-status-entry'>
                      <div className='service-name'>{region.name}</div>
                      <div className='service-score'>
                        <Score score={availability.score} />
                      </div>
                    </div>
                    <div className='service-status-entry-large'>
                      <div className='chart-title'>{'Availability'}</div>
                      <LineChart
                        className='ct-double-octave x-axis-vertical-labels'
                        options={{
                          axisX: {offset: 40}
                        }}
                        data={availability.data.reduce((result, [time, score]) => {
                          // FIXME(vkramskikh): properly parse time
                          const label = uiState.activeStatusDataPeriod === 'day' ?
                            time.replace(/^.*?T/, '') :
                            time.replace(/^\d+-(\d+-\d+)T.*/, '$1');
                          result.labels.push(label);
                          result.series[0].push(score);
                          return result;
                        }, {labels: [], series: [[]]})}
                      />
                    </div>
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
