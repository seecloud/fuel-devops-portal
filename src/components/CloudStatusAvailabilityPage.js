import React, {Component} from 'react';

import CloudStatusSidebar from './CloudStatusSidebar';

export default class CloudStatusAvailabilityPage extends Component {
  render() {
    return (
      <div>
        <CloudStatusSidebar />
        <div className='container-fluid'>
          <h1>{'Cloud Status Availability Page'}</h1>
          {'This is a cloud status availability page.'}
        </div>
      </div>
    );
  }
}
