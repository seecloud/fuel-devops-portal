import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import cx from 'classnames';

import {PERIODS} from '../consts';

@inject('uiState')
@observer
export default class StatusDataPeriodPicker extends Component {
  setPeriod(period) {
    this.props.uiState.statusDataPeriod = period;
  }

  render() {
    const {statusDataPeriod} = this.props.uiState;
    return (
      <div className={cx('btn-group', this.props.className)}>
        {PERIODS.map((period) => {
          return (
            <button
              key={period}
              className={cx('btn btn-default', {active: period === statusDataPeriod})}
              onClick={() => this.setPeriod(period)}
            >
              {period}
            </button>
          );
        })}
      </div>
    );
  }
}
