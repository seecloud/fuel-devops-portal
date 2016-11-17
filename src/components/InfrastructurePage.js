import React, {Component} from 'react';

import {InfrastructureService} from '../stores/InfrastructureServices';

export default class InfrastructurePage extends Component {
  static async fetchData({infrastructureServices}) {
    return new Promise((resolve) => {
      setTimeout(() => {
        infrastructureServices.items = [
          new InfrastructureService({id: 'jenkins', name: 'Jenkins', url: '/jenkins'}),
          new InfrastructureService({id: 'kibana', name: 'Kibana', url: '/kibana'}),
          new InfrastructureService({id: 'stacklight', name: 'StackLight', url: '/stacklight'})
        ];
        resolve();
      }, 2000);
    });
  }

  render() {
    return (
      <div>
        <h1>{'Infrastructure Page'}</h1>
        {'This is an infrastructure page.'}
      </div>
    );
  }
}
