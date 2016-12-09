import React, {Component} from 'react';
import cx from 'classnames';

export default class ErrorWrapper extends Component {
  static defaultProps = {
    responseStatus: 200,
    alerts: {
      404: 'The service is unavailable',
      500: 'Server error occured'
    }
  }

  alertClasses = {
    404: 'resource-not-found',
    500: 'server-error'
  }

  render() {
    if (this.props.responseStatus === 200) return this.props.children;
    return (
      <span className={cx('unavailable-resource', this.alertClasses)}>
        {this.props.alerts[this.props.responseStatus]}
      </span>
    );
  }
}
