import React, {Component} from 'react';
import {FixedScaleAxis, Line} from 'chartist';
import {merge} from 'lodash';
import cx from 'classnames';

export default class LineChart extends Component {
  static defaultProps = {
    defaultOptions: {
      showPoint: false,
      axisX: {type: FixedScaleAxis}
    },
    defaultResponsiveOptions: {},
    ticksNumber: 5
  }

  getTicks = () => {
    const ticks = this.props.data.series[0].reduce((result, {x: time}) => {
      if (time.getMinutes() === 0) result.push(time);
      return result;
    }, []);
    const step = Math.round(ticks.length / (this.props.ticksNumber - 1));
    let result = [];
    for (let i = 0; i < ticks.length; i = i + step) result.push(ticks[i]);
    result.push(ticks[ticks.length - 1]);
    return result;
  }

  componentWillMount() {
    this.ticks = this.getTicks();
  }

  componentDidMount() {
    this.chartist = new Line(
      this.refs.chart,
      this.props.data,
      merge(this.props.defaultOptions, {axisX: {ticks: this.ticks}}, this.props.options),
      {...this.props.defaultResponsiveOptions, ...this.props.responsiveOptions}
    );
  }

  componentWillReceiveProps() {
    this.chartist.update(
      this.props.data,
      merge(this.props.defaultOptions, {axisX: {ticks: this.ticks}}, this.props.options),
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
