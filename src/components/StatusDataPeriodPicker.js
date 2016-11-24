import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';
import cx from 'classnames';

import {PERIODS} from '../consts';

@inject('uiState')
@observer
export default class StatusDataPeriodPicker extends Component {
  setPeriod(period) {
    this.props.uiState.activeStatusDataPeriod = period;
  }

  render() {
    const {activeStatusDataPeriod} = this.props.uiState;
    return (
      <div className={cx('btn-group', this.props.className)}>
        {PERIODS.map((period) => {
          return (
            <button
              key={period}
              className={cx('btn btn-default', {active: period === activeStatusDataPeriod})}
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
