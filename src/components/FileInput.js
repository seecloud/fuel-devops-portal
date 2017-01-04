import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';
import {pick} from 'lodash';
import cx from 'classnames';
import prettyBytes from 'pretty-bytes';

@observer
export default class FileInput extends Component {
  static propTypes = {
    name: React.PropTypes.string,
    label: React.PropTypes.string,
    description: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    className: React.PropTypes.string,
    onChange: React.PropTypes.func,
    error: React.PropTypes.string
  }

  @observable fileName = null
  @observable content = null

  constructor(props) {
    super(props);
    if (props.defaultValue) {
      this.fileName = props.defaultValue.name;
      this.content = props.defaultValue.content;
    }
  }

  pickFile = () => {
    if (!this.props.disabled) ReactDOM.findDOMNode(this.refs.input).click();
  }

  @action
  saveFile = (fileName, content) => {
    this.fileName = fileName;
    this.content = content;
    return this.props.onChange(this.props.name, {name: fileName, content});
  }

  removeFile = () => {
    if (!this.props.disabled) {
      ReactDOM.findDOMNode(this.refs.form).reset();
      this.saveFile(null, null);
    }
  }

  readFile = () => {
    let reader = new FileReader();
    const input = ReactDOM.findDOMNode(this.refs.input);
    if (input.files.length) {
      reader.onload = () => this.saveFile(input.value.replace(/^.*[\\\/]/g, ''), reader.result);
      reader.readAsDataURL(input.files[0]);
    }
  }

  render() {
    const {id, label, error, description, disabled, className} = this.props;
    return (
      <div className={cx(
        'form-group',
        className,
        {'has-error': !!error}
      )}>
        {label && <label htmlFor={id} className='control-label'>{label}</label>}
        <div>
          <form ref='form'>
            <input
              type='file'
              ref='input'
              className='form-control'
              onChange={this.readFile}
              disabled={disabled}
            />
            <div className='input-with-action'>
              <input
                className='form-control file-name'
                type='text'
                value={
                  this.fileName ? `[${prettyBytes(this.content.length)}] ${this.fileName}` : ''
                }
                onClick={this.pickFile}
                {...pick(this.props, 'id', 'disabled', 'placeholder')}
                readOnly
              />
              <div
                className='btn btn-link'
                onClick={this.fileName ? this.removeFile : this.pickFile}
              >
                <i
                  className={cx(
                    'glyphicon',
                    this.fileName && !disabled ? 'glyphicon-remove' : 'glyphicon-file'
                  )}
                />
              </div>
            </div>
          </form>
        </div>
        <p className='help-block'>{error || description}</p>
      </div>
    );
  }
}
