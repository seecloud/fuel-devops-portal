import React, {Component} from 'react';
import {inject} from 'mobx-react';

import CloudStatusSidebar from './CloudStatusSidebar';

@inject('uiState', 'regions')
export default class CloudStatusAvailabilitySingleRegionPage extends Component {
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
          <hr />
          {'This is a cloud status availability page.'}
        </div>
      </div>
    );
  }
}
