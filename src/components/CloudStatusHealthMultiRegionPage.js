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

@observer(['uiState', 'regions', 'regionHealthData'])
export default class CloudStatusHealthMultiRegionPage extends Component {
  static async fetchData(
    {uiState, regionHealthData},
    {dataPeriod = uiState.activeStatusDataPeriod} = {}
  ) {
    const url = `/api/v1/status/health/${encodeURIComponent(dataPeriod)}`;
    const response = await fetch(url);
    const responseBody = await response.json();
    transaction(() => {
      forEach(responseBody.health, (plainHealthData, regionName) => {
        regionHealthData.update(regionName, dataPeriod, undefined, plainHealthData);
      });
    });
  }

  async changeDataPeriod(dataPeriod) {
    await this.constructor.fetchData(this.props, {dataPeriod});
    this.props.uiState.activeStatusDataPeriod = dataPeriod;
  }

  charts = [
    {title: 'FCI Score', key: 'fciData'},
    {title: 'Response Time (ms)', key: 'responseSizeData'},
    {title: 'Response Size (bytes)', key: 'responseTimeData'}
  ]

  render() {
    const {uiState, regionHealthData} = this.props;
    const labelInterpolationFnc = getFormatTime(uiState.activeStatusDataPeriod);

    return (
      <div>
        <CloudStatusSidebar />
        <div className='container-fluid'>
          <h1>{'Health: All Regions'}</h1>
          <div className='btn-toolbar'>
            <StatusDataPeriodPicker
              className='pull-right'
              onDataPeriodChange={(dataPeriod) => this.changeDataPeriod(dataPeriod)}
            />
          </div>
          {this.props.regions.items.map(({name: regionName}) => {
            const health = regionHealthData.get(
              regionName, uiState.activeStatusDataPeriod
            );
            if (!health) return null;
            return (
              <div key={regionName} className='service-status'>
                <div className='service-status-container'>
                  <div className='service-status-entry'>
                    <div className='service-name'>
                      <Link to={`/region/${encodeURIComponent(regionName)}/status/health`}>
                        {regionName}
                      </Link>
                    </div>
                    <div className='service-score text-success'>
                      <Score score={health.fci} />
                    </div>
                  </div>
                  {this.charts.map(({title, key}) => {
                    return (
                      <div key={title} className='service-status-entry-large'>
                        <div className='chart-title'>{title}</div>
                        <LineChart
                          key={uiState.activeStatusDataPeriod}
                          className='ct-major-twelfth x-axis-vertical-labels'
                          options={{
                            axisX: {labelInterpolationFnc}
                          }}
                          data={health[key].reduce((result, [time, score]) => {
                            result.series[0].push({x: new Date(time), y: score});
                            return result;
                          }, {series: [[]]})}
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
