import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

@inject('infrastructureServices')
@observer
export default class InfrastructureServicePage extends Component {
  render() {
    const {params: {regionName, infrastructureServiceId}} = this.props;
    const infrastructureService = this.props.infrastructureServices.get(
      regionName, infrastructureServiceId
    );
    const {urls} = infrastructureService;

    return (
      <div className='container-fluid'>
        <h1>{'Infrastructure: ' + regionName + ': ' + infrastructureService.title}</h1>
        {urls.map((urlsRow, rowIndex) => {
          return (
            <div key={infrastructureServiceId + rowIndex} className='row'>
              {urlsRow.map((url, colIndex) => <InfrastructureServiceFrame
                key={infrastructureServiceId + colIndex + url}
                rowSize={urls[rowIndex].length}
                url={url}
              />)}
            </div>
          );
        })}
      </div>
    );
  }
}

export class InfrastructureServiceFrame extends Component {
  static defaultProps = {
    classNamesByRowSize: {
      1: 'col-xs-12',
      2: 'col-xs-12 col-sm-6',
      3: 'col-xs-12 col-sm-12 col-md-4',
      default: 'col-xs-12 col-sm-6 col-md-3'
    }
  }

  render() {
    const {url, rowSize, classNamesByRowSize} = this.props;

    return (
      <div className={classNamesByRowSize[rowSize] || classNamesByRowSize.default}>
        <iframe
          width='100%'
          src={url}
        />
      </div>
    );
  }
}
