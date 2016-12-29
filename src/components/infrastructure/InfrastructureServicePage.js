import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {toJS} from 'mobx';
import {flattenDeep} from 'lodash';

@inject('infrastructureServices')
@observer
export default class InfrastructureServicePage extends Component {
  render() {
    const {params: {regionName, infrastructureServiceId}} = this.props;
    const infrastructureService = this.props.infrastructureServices.get(
      regionName, infrastructureServiceId
    );

    return (
      <div className='container-fluid'>
        <h1>{'Infrastructure: ' + regionName}</h1>
        {flattenDeep(toJS(infrastructureService.urls)).map((url) => {
          return (
            <div key={url}>
              {`<IFRAME src="${url}" />`}
            </div>
          );
        })}
      </div>
    );
  }
}
