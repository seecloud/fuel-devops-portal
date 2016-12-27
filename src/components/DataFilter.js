import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {observable, computed, action} from 'mobx';
import {observer} from 'mobx-react';
import cx from 'classnames';

@observer
export default class DataFilter extends Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    title: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    value: React.PropTypes.string,
    showOptionsFilter: React.PropTypes.bool
  }

  static defaultProps = {
    placeholder: 'Select...',
    value: '',
    showOptionsFilter: true
  }

  @observable optionsFilter = ''
  @observable isOpen = false

  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick);
  }

  onDocumentClick = (e) => {
    if (this.isOpen && !ReactDOM.findDOMNode(this.refs.filter).contains(e.target)) {
      this.toggle(false);
    }
  }

  @action
  filterOptions = (e) => {
    this.optionsFilter = e.target.value;
  }

  @action
  toggle = (isOpen) => {
    this.isOpen = isOpen;
  }

  closeOnEscapeKey = (e) => {
    if (e.key === 'Escape') this.toggle(false);
  }

  @computed get filteredOptions() {
    return this.optionsFilter ?
      this.props.options.filter(({title}) => title.indexOf(this.optionsFilter) >= 0)
    : this.props.options;
  }

  render() {
    const {
      name, title, placeholder, value, options, disabled, onChange, showOptionsFilter
    } = this.props;

    if (options) {
      const selectedOption = options.find((option) => option.value === value);
      return (
        <div
          ref='filter'
          className={cx('btn-group data-filter pull-left', name, {open: this.isOpen})}
          tabIndex='-1'
          onKeyDown={this.closeOnEscapeKey}
        >
          <label>{title}</label>
          <button
            className='btn btn-default dropdown-toggle'
            disabled={disabled}
            onClick={() => this.toggle(!this.isOpen)}
          >
            <span>{selectedOption ? selectedOption.title : placeholder}</span>
            {selectedOption &&
              <i
                className='glyphicon glyphicon-remove'
                onClick={() => onChange(name, '')}
              />
            }
            <span className='caret' />
          </button>
          {this.isOpen &&
            <div className='popover'>
              <div className='popover-content'>
                {showOptionsFilter &&
                  <input
                    type='text'
                    defaultValue={this.optionsFilter}
                    onChange={this.filterOptions}
                    className='option-filter'
                    autoFocus
                  />
                }
                <div className='option-list'>
                  {!this.filteredOptions.length &&
                    <span className='no-matches-found'>{'No matches found'}</span>
                  }
                  {this.filteredOptions.map(({value, title, className}) =>
                    <div
                      key={value}
                      onClick={() => {
                        onChange(name, value);
                        this.toggle(false);
                      }}
                      className={cx(className)}
                    >{title}</div>
                  )}
                </div>
              </div>
            </div>
          }
        </div>
      );
    }
    return (
      <div className={cx('data-filter pull-left', name)}>
        <div className='input-group'>
          <label>{title}</label>
          <input
            type='text'
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => onChange(name, e.target.value)}
          />
          <button
            className='btn btn-link pull-right'
            disabled={!value}
            onClick={() => onChange(name, '')}
          >
            <i className='glyphicon glyphicon-remove' />
          </button>
        </div>
      </div>
    );
  }
}
