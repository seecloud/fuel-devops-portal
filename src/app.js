import './styles/loading.less';
import './styles/main.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, Redirect, Link, withRouter, browserHistory} from 'react-router';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {get} from 'lodash';

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
        <div className='container'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

@observer
class Navbar extends Component {
  render() {
    if (!uiState.authenticated) return null;
    return (
      <nav className='navbar navbar-default'>
        <div className='container'>
          <div className='navbar-header'>
            <Link to='/' className='navbar-brand'>{'Logo'}</Link>
          </div>
          <ul className='nav navbar-nav navbar-left'>
            <li><Link to='/cloud-status'>{'Cloud Status'}</Link></li>
            <li><Link to='/cloud-intelligence'>{'Cloud Intelligence'}</Link></li>
            <li><Link to='/capacity-management'>{'Capacity Management'}</Link></li>
            <li><Link to='/resource-optimization'>{'Resource Optimization'}</Link></li>
            <li><Link to='/security-monitoring'>{'Security Monitoring'}</Link></li>
            <li><Link to='/infrastructure'>{'Infrastructure'}</Link></li>
          </ul>
          <ul className='nav navbar-nav navbar-right'>
            <li><Link to='/logout'>{'Log out'}</Link></li>
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
        <div className='row'>
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
    <div className='col-xs-4'>
      <div className='dashboard-page-link'>
        <h3>{title}</h3>
        <div>
          {'Lorem ipsum dolor sit amet, consectetur adipiscing elit, '}
          {'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}
        </div>
        <Link to={to} className='btn btn-default'>{'Launch'}</Link>
      </div>
    </div>
  );
};

class CloudStatusPage extends Component {
  render() {
    return (
      <div>
        <h1>{'Cloud Status Page'}</h1>
        {'This is a cloud status page.'}
      </div>
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
      />
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
