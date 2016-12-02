import React, {Component} from 'react';

export default class Score extends Component {
  static defaultProps = {
    successThreshold: 0.95,
    warningThreshold: 0.85
  }

  render() {
    const {score} = this.props;
    let className;
    if (score === null) {
      className = '';
    } else if (score >= this.props.successThreshold) {
      className = 'text-success';
    } else if (score >= this.props.warningThreshold) {
      className = 'text-warning';
    } else {
      className = 'text-danger';
    }
    const percentage = score !== null ? (score * 100).toFixed(1) + '%' : 'N/A';

    return (
      <span className={className}>{percentage}</span>
    );
  }
}
