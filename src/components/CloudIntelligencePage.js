import React, {Component} from 'react';

import CloudIntelligenceSidebar from './CloudIntelligenceSidebar';

export default class CloudIntelligencePage extends Component {
  render() {
    return (
      <div>
        <CloudIntelligenceSidebar />
        <div className='container-fluid'>
          <h1>{'Intelligence Page'}</h1>
          {'This is a cloud intelligence page.'}
        </div>
      </div>
    );
  }
}
