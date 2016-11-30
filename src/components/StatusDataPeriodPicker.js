import React, {Component} from 'react';
import {observer} from 'mobx-react';
import cx from 'classnames';

import {PERIODS} from '../consts';

@observer(['uiState'])
export default class StatusDataPeriodPicker extends Component {
  changePeriod(period) {
    if (this.props.onPeriodChange) {
      this.props.onPeriodChange(period);
    } else {
      this.props.uiState.activeStatusDataPeriod = period;
    }
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
              onClick={() => this.changePeriod(period)}
            >
              {period}
            </button>
          );
        })}
      </div>
    );
  }
}
