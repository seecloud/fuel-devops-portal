import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {computed} from 'mobx';
import {inject} from 'mobx-react';

@withRouter
@inject('infrastructureServices')
export default class InfrastructureServicePage extends Component {
  static onEnter({infrastructureServices}, {params}, replace) {
    if (!infrastructureServices.items.some((infrastructureService) => {
      return infrastructureService.id === params.serviceId;
    })) {
      replace('/infrastructure');
    }
  }

  @computed get activeService() {
    const {params, infrastructureServices} = this.props;
    return infrastructureServices.items.find((infrastructureService) => {
      return infrastructureService.id === params.serviceId;
    });
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
