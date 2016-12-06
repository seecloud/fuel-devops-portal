import React, {Component} from 'react';
import {Link} from 'react-router';
import {observer} from 'mobx-react';
import {transaction} from 'mobx';
import {forEach} from 'lodash';

import CloudStatusSidebar from './CloudStatusSidebar';
import StatusDataPeriodPicker from './StatusDataPeriodPicker';
import LineChart from './LineChart';
import Score from './Score';
import {getFormatTime} from '../chartUtils';

@observer(['uiState', 'regions', 'regionAvailabilityData'])
export default class CloudStatusAvailabilityMultiRegionPage extends Component {
  static async fetchData(
    {uiState, regionAvailabilityData},
    {dataPeriod = uiState.activeStatusDataPeriod} = {}
  ) {
    const url = `/api/v1/status/availability/${encodeURIComponent(dataPeriod)}`;
    const response = await fetch(url);
    const responseBody = await response.json();
    transaction(() => {
      forEach(responseBody.availability, (plainAvailabilityData, regionName) => {
        regionAvailabilityData.update(regionName, dataPeriod, undefined, plainAvailabilityData);
      });
    });
  }

  async changeDataPeriod(dataPeriod) {
    await this.constructor.fetchData(this.props, {dataPeriod});
    this.props.uiState.activeStatusDataPeriod = dataPeriod;
  }

  render() {
    const {uiState, regionAvailabilityData} = this.props;
    const labelInterpolationFnc = getFormatTime(uiState.activeStatusDataPeriod);

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
              <div key={regionName}>
                <div className='service-status'>
                  <div className='service-status-container'>
                    <div className='service-status-entry'>
                      <div className='service-name'>
                        <Link to={`/region/${encodeURIComponent(regionName)}/status/availability`}>
                          {regionName}
                        </Link>
                      </div>
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
                          result.series[0].push({x: new Date(time), y: score});
                          return result;
                        }, {series: [[]]})}
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
