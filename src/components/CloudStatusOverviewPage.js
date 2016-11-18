import React, {Component} from 'react';
import {observable} from 'mobx';
import {observer, inject} from 'mobx-react';
import cx from 'classnames';

@inject('regions')
@observer
export default class CloudStatusOverviewPage extends Component {
  @observable regionSize = 'large'
  regionSizes = ['small', 'medium', 'large']

  changeRegionSize = (newSize) => {
    this.regionSize = newSize;
  }

  render() {
    return (
      <div>
        <h1>{'Cloud Status Overview Page'}</h1>
        <hr />
        <div className='btn-toolbar'>
          <div className='pull-left cloud-overview-summary'>
            {'Total: '}
            {this.props.regions.items.length}
            {' '}
            {'Error: X'}
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
          <div className='btn-group pull-right'>
            <button className='btn btn-default active'>{'All'}</button>
            <button className='btn btn-default'>{'Errors'}</button>
          </div>
          <div className='btn-group pull-right'>
            <button className='btn btn-default active'>{'Day'}</button>
            <button className='btn btn-default'>{'Week'}</button>
            <button className='btn btn-default'>{'Month'}</button>
          </div>
        </div>
        <hr />
        <div className='region-list'>
          {this.props.regions.items.map((region) => {
            return <Region
              key={region.id}
              region={region}
              size={this.regionSize}
            />;
          })}
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
            <div className='param text-warning'>{'100%'}</div>
          </div>
          <div className='health'>
            <div className='name'>{'Health (FCI)'}</div>
            <div className='param'>{'N/A'}</div>
          </div>
          <div className='performance'>
            <div className='name'>{'Performance'}</div>
            <div className='param text-danger'>{'100%'}</div>
          </div>
        </div>
      </div>
    );
  }
}
