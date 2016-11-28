import React, {Component} from 'react';

import CloudIntelligenceSidebar from './CloudIntelligenceSidebar';

export default class CloudIntelligenceHistoryPage extends Component {
  render() {
    return (
      <div>
        <CloudIntelligenceSidebar />
        <div className='container-fluid'>
          <h1>{'Resources History Page'}</h1>
          {'This is a cloud resource history page.'}
        </div>
      </div>
    );
  }
}
