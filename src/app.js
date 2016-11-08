import './styles/loading.less';
import './styles/main.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, Redirect, Link, withRouter, browserHistory} from 'react-router';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {Line} from 'chartist';
import {get, times} from 'lodash';
import cx from 'classnames';

class UIState {
  @observable
  authenticated = true;
}

const uiState = new UIState();

class App extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <div className='sub-nav'>
          <ul className=''>
            <li className='active'><a href='/cloud-status'><div className='icon-box overview-icon' /><span>{'Overview'}</span></a></li>
            <li className=''><a href='/cloud-status/availability'><div className='icon-box availability-icon' /><span>{'Availability'}</span></a></li>
            <li className=''><a href='/cloud-status/health'><div className='icon-box health-icon' /><span>{'Health'}</span></a></li></ul>
        </div>
        <div className='container-fluid'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

@withRouter
@observer
class Navbar extends Component {
  navs = [
    ['/cloud-status', 'Cloud Status'],
    ['/cloud-intelligence', 'Cloud Intelligence'],
    ['/capacity-management', 'Capacity Management'],
    ['/resource-optimization', 'Resource Optimization'],
    ['/security-monitoring', 'Security Monitoring'],
    ['/infrastructure', 'Infrastructure'],
  ]

  render() {
    const {router} = this.props;
    if (!uiState.authenticated) return null;
    return (
      <nav className='navbar navbar-default'>
        <div className='container'>
          <div className='navbar-header'>
            <Link to='/' className='navbar-brand' />
          </div>
          <ul className='nav navbar-nav navbar-left'>
            {this.navs.map(([url, title]) => {
              return (
                <li key={url} className={cx({active: router.isActive(url)})}>
                  <Link to={url}>{title}</Link>
                </li>
              );
            })}
          </ul>
          <ul className='nav navbar-nav navbar-right'>
            <li><div className='icon-box user-icon' /></li>
            <li><div className='icon-box notification-icon' /></li>
            <li><Link to='/logout'><div className='icon-box logout-icon' /></Link></li>
          </ul>
        </div>
      </nav>
    );
  }
}

class DashboardPage extends Component {
  render() {
    return (
      <div>
        <h1>{'Welcome to Fuel DevOps Portal'}</h1>
        <div className='dashboard-page-links'>
          <DashboardPageLink to='/cloud-status' title='Cloud Status' />
          <DashboardPageLink to='/cloud-intelligence' title='Cloud Intelligence' />
          <DashboardPageLink to='/capacity-management' title='Capacity Management' />
          <DashboardPageLink to='/resource-optimization' title='Resource Optimization' />
          <DashboardPageLink to='/security-monitoring' title='Security Monitoring' />
          <DashboardPageLink to='/infrastructure' title='Infrastructure' />
        </div>
      </div>
    );
  }
}

const DashboardPageLink = ({to, title}) => {
  return (
    <div className='dashboard-page-link-container'>
      <div className='dashboard-page-link'>
        <h3>{title}</h3>
        <div>
          {'Lorem ipsum dolor sit amet, consectetur adipiscing elit, '}
          {'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
        </div>
        <Link to={to} className='btn btn-primary'>{'Launch'}</Link>
      </div>
    </div>
  );
};

@withRouter
class CloudStatusOverviewNav extends Component {
  navs = [
    ['/cloud-status', 'Overview'],
    ['/cloud-status/availability', 'Availability'],
    ['/cloud-status/health', 'Health']
  ]

  render() {
    const {router} = this.props;
    return (
      <ul className='nav nav-pills'>
        {this.navs.map(([url, title]) => {
          return (
            <li key={url} className={cx({active: router.isActive(url, true)})}>
              <Link to={url}>{title}</Link>
            </li>
          );
        })}
      </ul>
    );
  }
}

class CloudStatusPage extends Component {
  render() {
    return (
      <div>
        <CloudStatusOverviewNav />
        {this.props.children}
      </div>
    );
  }
}

@observer
class CloudStatusOverviewPage extends Component {
  @observable regionSize = 'large'
  regionSizes = ['small', 'medium', 'large']

  changeRegionSize = (newSize) => {
    this.regionSize = newSize;
  }

  render() {
    return (
      <div>
        <h1>{'Cloud Status Overview Page'}</h1>
        <hr />
        <div className='btn-toolbar'>
          <div className='pull-left cloud-overview-summary'>
            {'Total: X Error: X'}
          </div>
          <div className='btn-group pull-right'>
            {this.regionSizes.map((size) => {
              return (
                <button
                  key={size}
                  className={cx({
                    'btn btn-default': true,
                    active: this.regionSize === size
                  })}
                  onClick={() => this.changeRegionSize(size)}
                >
                  {size[0].toUpperCase()}
                </button>
              );
            })}
          </div>
          <div className='btn-group pull-right'>
            <button className='btn btn-default active'>{'All'}</button>
            <button className='btn btn-default'>{'Errors'}</button>
          </div>
          <div className='btn-group pull-right'>
            <button className='btn btn-default active'>{'Day'}</button>
            <button className='btn btn-default'>{'Week'}</button>
            <button className='btn btn-default'>{'Month'}</button>
          </div>
        </div>
        <hr />
        <div className='region-list'>
          <Region size={this.regionSize} />
          <Region size={this.regionSize} />
          <Region size={this.regionSize} />
          <Region size={this.regionSize} />
          <Region size={this.regionSize} />
        </div>
      </div>
    );
  }
}

class Region extends Component {
  render() {
    return (
      <div className={cx('region-container', 'region-' + this.props.size)}>
        <div className='region'>
          <h3>{'west-1.hooli.net.blablablabla'}</h3>
          <div className='sla'>
            <div className='name'>{'SLA'}</div>
            <div className='graph'>{'graph'}</div>
            <div className='param text-success'>{'100%'}</div>
          </div>
          <div className='availability'>
            <div className='name'>{'Availability'}</div>
            <div className='graph'>{'graph'}</div>
            <div className='param text-warning'>{'100%'}</div>
          </div>
          <div className='health'>
            <div className='name'>{'Health (FCI)'}</div>
            <div className='graph'>{'graph'}</div>
            <div className='param'>{'N/A'}</div>
          </div>
          <div className='performance'>
            <div className='name'>{'Performance'}</div>
            <div className='graph'>{'graph'}</div>
            <div className='param text-danger'>{'100%'}</div>
          </div>
        </div>
      </div>
    );
  }
}

class CloudStatusAvailabilityPage extends Component {
  render() {
    return (
      <div>
        <h1>{'Cloud Status Availability Page'}</h1>
        {'This is a cloud status availability page.'}
      </div>
    );
  }
}

class CloudStatusHealthPage extends Component {
  charts = [
    {title: 'FCI score', key: 'fciScore'},
    {title: 'Response Time (ms)', key: 'responseTime'},
    {title: 'Response Size (bytes)', key: 'responseSize'}
  ]

  services = ['Keystone', 'Nova', 'Glance', 'Cinder', 'Newtron']

  healthData = {}

  constructor() {
    super();
    this.generateHealthData();
    this.interval = setInterval(() => {
      this.generateHealthData();
      this.forceUpdate();
    }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  generateFCIScore() {
    return times(10, Math.random);
  }

  generateResponseTime() {
    return times(10, () => Math.random() * 2000);
  }

  generateResponseSize() {
    return times(10, () => Math.random() * 10000);
  }

  generateHealthData() {
    this.healthData = this.services.reduce((result, serviceName) => {
      result[serviceName] = {
        fciScore: this.generateFCIScore(),
        responseTime: this.generateResponseTime(),
        responseSize: this.generateResponseSize()
      };
      return result;
    }, {});
  }

  render() {
    return (
      <div>
        <h1>{'Cloud Status Health Page'}</h1>
        <p>{'API Health is based on HTTP requests response metrics: codes, duration and size.'}</p>
        <p>{'FCI score is ratio of successful codes (2xx, 3xx, 4xx) to all http codes.'}</p>
        {this.services.map((serviceName) => {
          return (
            <div key={serviceName} className='service-status'>
              <div className='row'>
                <div className='col-md-3 col-xs-12 text-center'>
                  <div className='service-name'>{serviceName}{' '}{'FCI'}</div>
                  <div className='service-fci-score text-success'>{'100%'}</div>
                </div>
                {this.charts.map(({title, key}) => {
                  return (
                    <div key={title} className='col-md-3 col-xs-12 text-center'>
                      <div className='chart-title'>{title}</div>
                      <LineChart
                        className='ct-major-twelfth'
                        data={{
                          labels: times(10).map((n) => `${n + 1}:00`),
                          series: [this.healthData[serviceName][key]]
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

class LineChart extends Component {
  static defaultProps = {
    options: {},
    responsiveOptions: {}
  }

  componentDidMount() {
    this.chartist = new Line(
      this.refs.chart,
      this.props.data,
      this.props.options,
      this.props.responsiveOptions
    );
  }

  componentWillReceiveProps() {
    this.chartist.update(
      this.props.data,
      this.props.options,
      this.props.responsiveOptions
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

class CloudIntelligencePage extends Component {
  render() {
    return (
      <div>
        <h1>{'Cloud Intelligence Page'}</h1>
        {'This is a cloud intelligence page.'}
      </div>
    );
  }
}

class CapacityManagementPage extends Component {
  render() {
    return (
      <div>
        <h1>{'Capacity Management Page'}</h1>
        {'This is a capacity management page.'}
      </div>
    );
  }
}

class ResourceOptimizationPage extends Component {
  render() {
    return (
      <div>
        <h1>{'Resource Optimization Page'}</h1>
        {'This is a resource optimization page.'}
      </div>
    );
  }
}

class SecurityMonitoringPage extends Component {
  render() {
    return (
      <div>
        <h1>{'Security Monitoring Page'}</h1>
        {'This is a security monitoring page.'}
      </div>
    );
  }
}

class InfrastructurePage extends Component {
  render() {
    return (
      <div>
        <h1>{'Infrastructure Page'}</h1>
        {'This is an infrastructure page.'}
      </div>
    );
  }
}

@withRouter
@observer
class LoginPage extends Component {
  @observable actionInProgress = false

  onSubmit = (e) => {
    e.preventDefault();
    this.actionInProgress = true;
    const {router, location} = this.props;
    setTimeout(() => {
      uiState.authenticated = true;
      router.replace(get(location, 'state.nextPathname', '/'));
    }, 500);
  }

  render() {
    return (
      <div>
        <h1>{'Login'}</h1>
        <form className='form-horizontal' onSubmit={this.onSubmit}>
          <div className='form-group'>
            <div className='col-xs-6 col-xs-offset-3'>
              <input
                className='form-control input-sm'
                type='text'
                name='username'
                ref='username'
                placeholder={'Username'}
                onChange={this.onChange}
              />
            </div>
          </div>
          <div className='form-group'>
            <div className='col-xs-6 col-xs-offset-3'>
              <input
                className='form-control input-sm'
                type='password'
                name='password'
                ref='password'
                placeholder={'Password'}
                onChange={this.onChange}
              />
            </div>
          </div>
          <div className='form-group'>
            <div className='col-xs-12 text-center'>
              <button
                type='submit'
                className={'btn btn-success'}
                disabled={this.actionInProgress}
              >
                {'Log In'}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

class Logout extends Component {
  static onEnter(nextState, replace) {
    uiState.authenticated = false;
    replace('/login');
  }

  render = () => null;
}

function requireAuthHook(nextState, replace) {
  if (!uiState.authenticated) {
    replace({
      pathname: '/login',
      state: {nextPathname: nextState.location.pathname}
    });
  }
}

function prohibitAuthHook(nextState, replace) {
  if (uiState.authenticated) replace('/');
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRoute
        component={DashboardPage}
        onEnter={requireAuthHook}
      />

      <Route
        path='login'
        component={LoginPage}
        onEnter={prohibitAuthHook}
      />
      <Route
        path='logout'
        component={Logout}
        onEnter={Logout.onEnter}
      />

      <Route
        path='cloud-status'
        component={CloudStatusPage}
        onEnter={requireAuthHook}
      >
        <IndexRoute
          component={CloudStatusOverviewPage}
        />
        <Route
          path='availability'
          component={CloudStatusAvailabilityPage}
        />
        <Route
          path='health'
          component={CloudStatusHealthPage}
        />
      </Route>
      <Route
        path='cloud-intelligence'
        component={CloudIntelligencePage}
        onEnter={requireAuthHook}
      />
      <Route
        path='capacity-management'
        component={CapacityManagementPage}
        onEnter={requireAuthHook}
      />
      <Route
        path='resource-optimization'
        component={ResourceOptimizationPage}
        onEnter={requireAuthHook}
      />
      <Route
        path='security-monitoring'
        component={SecurityMonitoringPage}
        onEnter={requireAuthHook}
      />
      <Route
        path='infrastructure'
        component={InfrastructurePage}
        onEnter={requireAuthHook}
      />
      <Redirect from='*' to='/' />
    </Route>
  </Router>,
  document.getElementById('root')
);
