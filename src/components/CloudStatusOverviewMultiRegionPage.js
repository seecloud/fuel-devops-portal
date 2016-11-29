import React, {Component} from 'react';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import cx from 'classnames';

import CloudStatusSidebar from './CloudStatusSidebar';
import StatusDataPeriodPicker from './StatusDataPeriodPicker';

@observer(['regions'])
export default class CloudStatusOverviewMultiRegionPage extends Component {
  static async fetchData({uiState}) {
    const url = `/api/v1/status/${
      encodeURIComponent(uiState.activeStatusDataPeriod)
    }`;
    const response = await fetch(url);
    await response.json();
  }

  @observable regionSize = 'large'
  regionSizes = ['small', 'medium', 'large']

  changeRegionSize = (newSize) => {
    this.regionSize = newSize;
  }

  render() {
    return (
      <div>
        <CloudStatusSidebar />
        <div className='container-fluid'>
          <h1>{'Cloud Status Overview: All Regions'}</h1>
          <div className='btn-toolbar'>
            <div className='pull-left cloud-overview-summary'>
              {'Total: '}
              {this.props.regions.items.length}
              {' '}
              {'Error: X'}
            </div>
            <StatusDataPeriodPicker className='pull-right' />
            <div className='btn-group pull-right'>
              <button className='btn btn-default active'>{'All'}</button>
              <button className='btn btn-default'>{'Errors'}</button>
            </div>
            <div className='btn-group pull-right'>
              {this.regionSizes.map((size) => {
                return (
                  <button
                    key={size}
                    className={cx({
                      'btn btn-default': true,
                      active: this.regionSize === size
                    })}
                    onClick={() => this.changeRegionSize(size)}
                  >
                    {size[0].toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
          <div className='region-list'>
            {this.props.regions.items.map((region) => {
              return <Region
                key={region.name}
                region={region}
                size={this.regionSize}
              />;
            })}
          </div>
        </div>
      </div>
    );
  }
}

export class Region extends Component {
  render() {
    return (
      <div className={cx('region-container', 'region-' + this.props.size)}>
        <div className='region'>
          <h3>{this.props.region.name}</h3>
          <div className='sla'>
            <div className='name'>{'SLA'}</div>
            <div className='param text-success'>{'100%'}</div>
          </div>
          <div className='availability'>
            <div className='name'>{'Availability'}</div>
            <div className='param text-warning'>{'92%'}</div>
          </div>
          <div className='health'>
            <div className='name'>{'Health (FCI)'}</div>
            <div className='param'>{'N/A'}</div>
          </div>
          <div className='performance'>
            <div className='name'>{'Performance'}</div>
            <div className='param text-danger'>{'86%'}</div>
          </div>
        </div>
      </div>
    );
  }
}
