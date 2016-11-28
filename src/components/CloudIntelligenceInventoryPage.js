import React, {Component} from 'react';

import CloudIntelligenceSidebar from './CloudIntelligenceSidebar';

export default class CloudIntelligenceInventoryPage extends Component {
  render() {
    return (
      <div>
        <CloudIntelligenceSidebar />
        <div className='container-fluid'>
          <h1>{'Cloud Physical & Virtual Resources Inventory'}</h1>
          {'This is a cloud resource inventory page.'}
        </div>
      </div>
    );
  }
}
