import React, {Component} from 'react';
import {Line} from 'chartist';
import cx from 'classnames';

export default class LineChart extends Component {
  static defaultProps = {
    defaultOptions: {
      showPoint: false
    },
    defaultResponsiveOptions: {}
  }

  componentDidMount() {
    this.chartist = new Line(
      this.refs.chart,
      this.props.data,
      {...this.props.defaultOptions, ...this.props.options},
      {...this.props.defaultResponsiveOptions, ...this.props.responsiveOptions}
    );
  }

  componentWillReceiveProps() {
    this.chartist.update(
      this.props.data,
      {...this.props.defaultOptions, ...this.props.options},
      {...this.props.defaultResponsiveOptions, ...this.props.responsiveOptions}
    );
  }

  componentWillUnmount() {
    if (this.chartist) this.chartist.detach();
  }

  render() {
    return (
      <div className={cx('ct-chart', this.props.className)} ref='chart' />
    );
  }
}
