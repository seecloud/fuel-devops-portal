import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {computed} from 'mobx';
import {inject} from 'mobx-react';

@withRouter
@inject('infrastructureServices')
export default class InfrastructureServicePage extends Component {
  static getActiveService(infrastructureServices, params) {
    return infrastructureServices.items.find((infrastructureService) => {
      return infrastructureService.id === params.serviceId;
    });
  }

  static onEnter({infrastructureServices}, {params}, replace) {
    if (!InfrastructureServicePage.getActiveService(infrastructureServices, params)) {
      replace('/infrastructure');
    }
  }

  @computed get activeService() {
    const {params, infrastructureServices} = this.props;
    return InfrastructureServicePage.getActiveService(infrastructureServices, params);
  }

  render() {
    return (
      <div>
        <h1>{this.activeService.name}</h1>
        {'Here will be <iframe> for ' + this.activeService.url}
      </div>
    );
  }
}
