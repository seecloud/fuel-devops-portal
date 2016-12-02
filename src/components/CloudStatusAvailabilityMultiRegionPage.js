import React, {Component} from 'react';
import {observer} from 'mobx-react';

import CloudStatusSidebar from './CloudStatusSidebar';
import StatusDataPeriodPicker from './StatusDataPeriodPicker';
import LineChart from './LineChart';
import Score from './Score';
import {formatTimeAsHoursAndMinutes, formatTimeAsDayAndMonth} from '../chartUtils';

@observer(['uiState', 'regions', 'regionAvailabilityData'])
export default class CloudStatusAvailabilityMultiRegionPage extends Component {
  static async fetchData(
    {uiState, regionAvailabilityData},
    {dataPeriod = uiState.activeStatusDataPeriod} = {}
  ) {
    const url = `/api/v1/status/availability/${encodeURIComponent(dataPeriod)}`;
    const response = await fetch(url);
    const responseBody = await response.json();
    regionAvailabilityData.update(dataPeriod, undefined, responseBody.availability);
  }

  async changeDataPeriod(dataPeriod) {
    await this.constructor.fetchData(this.props, {dataPeriod});
    this.props.uiState.activeStatusDataPeriod = dataPeriod;
  }

  render() {
    const {uiState, regionAvailabilityData} = this.props;
    const labelInterpolationFnc = uiState.activeStatusDataPeriod === 'day' ?
      formatTimeAsHoursAndMinutes :
      formatTimeAsDayAndMonth;
    return (
      <div>
        <CloudStatusSidebar />
        <div className='container-fluid'>
          <h1>{'Availability: All Regions'}</h1>
          <div className='btn-toolbar'>
            <StatusDataPeriodPicker
              className='pull-right'
              onDataPeriodChange={(dataPeriod) => this.changeDataPeriod(dataPeriod)}
            />
          </div>
          {this.props.regions.items.map(({name: regionName}) => {
            const availability = regionAvailabilityData.get(
              regionName, uiState.activeStatusDataPeriod
            );
            if (!availability) return null;
            return (
              <div key={regionName} className='service-status-wrapper'>
                <div className='service-status'>
                  <div className='service-status-container'>
                    <div className='service-status-entry'>
                      <div className='service-name'>{regionName}</div>
                      <div className='service-score'>
                        <Score score={availability.score} />
                      </div>
                    </div>
                    <div className='service-status-entry-large'>
                      <div className='chart-title'>{'Availability'}</div>
                      <LineChart
                        key={uiState.activeStatusDataPeriod}
                        className='ct-double-octave x-axis-vertical-labels'
                        options={{
                          axisX: {offset: 40, labelInterpolationFnc}
                        }}
                        data={availability.data.reduce((result, [time, score]) => {
                          result.labels.push(time);
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
