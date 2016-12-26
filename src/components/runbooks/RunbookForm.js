import React, {Component} from 'react';
import {observer} from 'mobx-react';
import cx from 'classnames';
import FileSaver from 'file-saver';

import FileInput from '../FileInput';

@observer
export default class RunbookForm extends Component {
  changeParameter = (index, attr, value) => {
    this.props.runbook.parameters[index][attr] = value;
  }

  addParameter = () => {
    this.props.runbook.parameters.push({name: '', default: '', type: 'string'});
  }

  removeParameter = (index) => {
    this.props.runbook.parameters.splice(index, 1);
    this.props.updateForm();
  }

  changeTag = (index, value) => {
    this.props.runbook.tags[index] = value;
  }

  addTag = () => {
    this.props.runbook.tags.push('');
  }

  removeTag = (index) => {
    this.props.runbook.tags.splice(index, 1);
    this.props.updateForm();
  }

  uploadRunbook = (name, {content}) => {
    this.props.runbook.runbook = content;
  }

  changeAttribute = (e) => {
    this.props.runbook[e.target.name] = e.target.value;
  }

  render() {
    const {runbook} = this.props;
    const errors = runbook.validationErrors || {};
    return (
      <div className='runbook-form'>
        <div className={cx('form-group', {'has-error': !!errors.name})}>
          <label htmlFor='runbook-name' className='control-label'>{'Name'}</label>
          <input
            type='text'
            className='form-control'
            id='runbook-name'
            name='name'
            defaultValue={runbook.name}
            onChange={this.changeAttribute}
          />
          <p className='help-block'>{errors.name}</p>
        </div>
        <div className='runbook-tags'>
          <label className='control-label'>{'Tags'}</label>
          {runbook.tags.map((tag, index) => {
            const error = (errors.tags || [])[index];
            return (
              <div className='row' key={'tag' + index}>
                <div className='col-xs-5'>
                  <div className={cx('form-group', {'has-error': !!error})}>
                    <input
                      type='text'
                      className='form-control'
                      defaultValue={tag}
                      onChange={(e) => this.changeTag(index, e.target.value)}
                    />
                  </div>
                </div>
                <div className='col-xs-2'>
                  <button
                    className='btn btn-link'
                    onClick={() => this.removeTag(index)}
                  >
                    <i className='glyphicon glyphicon-minus-sign' />
                  </button>
                </div>
              </div>
            );
          })}
          <button
            className='btn btn-default'
            onClick={this.addTag}
          >
            {'Add Tag'}
          </button>
        </div>
        <div className={cx('form-group', {'has-error': !!errors.type})}>
          <label htmlFor='runbook-type' className='control-label'>{'Type'}</label>
          <input
            type='text'
            className='form-control'
            id='runbook-type'
            name='type'
            defaultValue={runbook.type}
            onChange={this.changeAttribute}
          />
          <p className='help-block'>{errors.type}</p>
        </div>
        <div className={
          cx('form-group', {'has-error': !!errors.description})
        }>
          <label htmlFor='runbook-description' className='control-label'>
            {'Description'}
          </label>
          <textarea
            className='form-control'
            id='runbook-description'
            name='description'
            defaultValue={runbook.description}
            onChange={this.changeAttribute}
          />
          <p className='help-block'>{errors.description}</p>
        </div>
        {runbook.runbook &&
          <button
            className='btn btn-default'
            onClick={() => {
              FileSaver.saveAs(
                new Blob([runbook.runbook], {type: 'application/octet-stream'}),
                runbook.name
              );
            }}
          >
            {'Download runbook'}
          </button>
        }
        <FileInput
          id='runbook-script'
          name='runbook'
          label='Upload runbook'
          onChange={this.uploadRunbook}
          error={errors.runbook}
        />
        <div className='runbook-parameters'>
          <label className='control-label'>{'Parameters'}</label>
          {!!runbook.parameters.length &&
            <div className='row'>
              <div className='col-xs-5'>
                <span className='input-subtitle'>{'Name'}</span>
              </div>
              <div className='col-xs-6'>
                <span className='input-subtitle'>{'Default Value'}</span>
              </div>
            </div>
          }
          {runbook.parameters.map((parameter, index) => {
            const error = (errors.parameters || [])[index] || {};
            return (
              <div className='row' key={'parameter' + index}>
                <div className='col-xs-5'>
                  <div className={cx('form-group', {'has-error': !!error.name})}>
                    <input
                      type='text'
                      className='form-control'
                      defaultValue={parameter.name}
                      onChange={(e) => this.changeParameter(index, 'name', e.target.value)}
                    />
                  </div>
                </div>
                <div className='col-xs-5'>
                  <div className={cx('form-group', {'has-error': !!error.default})}>
                    <input
                      type='text'
                      className='form-control'
                      defaultValue={parameter.default}
                      onChange={(e) => this.changeParameter(index, 'default', e.target.value)}
                    />
                  </div>
                </div>
                <div className='col-xs-2'>
                  <button
                    className='btn btn-link'
                    onClick={() => this.removeParameter(index)}
                  >
                    <i className='glyphicon glyphicon-minus-sign' />
                  </button>
                </div>
              </div>
            );
          })}
          <button
            className='btn btn-default'
            onClick={this.addParameter}
          >
            {'Add Parameter'}
          </button>
        </div>
      </div>
    );
  }
}
