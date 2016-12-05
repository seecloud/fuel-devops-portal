import React, {Component} from 'react';
import {AutoScaleAxis, Line} from 'chartist';
import {merge} from 'lodash';
import cx from 'classnames';

export default class LineChart extends Component {
  static defaultProps = {
    defaultOptions: {
      showPoint: false,
      axisX: {
        type: AutoScaleAxis,
        scaleMinSpace: 60,
        onlyInteger: true
      }
    },
    defaultResponsiveOptions: {}
  }

  componentDidMount() {
    this.chartist = new Line(
      this.refs.chart,
      this.props.data,
      merge(this.props.defaultOptions, this.props.options),
      {...this.props.defaultResponsiveOptions, ...this.props.responsiveOptions}
    );
  }

  componentWillReceiveProps() {
    this.chartist.update(
      this.props.data,
      merge(this.props.defaultOptions, this.props.options),
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
