import './styles/loading.less';
import './styles/main.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, Redirect, Link, browserHistory} from 'react-router';

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

class Navbar extends Component {
  render() {
    return (
      <nav className='navbar navbar-default'>
        <div className='container'>
          <div className='navbar-header'>
            <Link to='/' className='navbar-brand'>{'Here loes logo'}</Link>
          </div>
          <div className='collapse navbar-collapse'>
            <ul className='nav navbar-nav'>
              <li><Link to='/cloud-status'>{'Cloud Status'}</Link></li>
              <li><Link to='/infrastructure-management'>{'Infrastructure Management'}</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

class HomePage extends Component {
  render() {
    return (
      <div>
        <h1>{'Dashboard'}</h1>
        {'This is a dashboard.'}
      </div>
    );
  }
}

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

class InfrastructureManagementPage extends Component {
  render() {
    return (
      <div>
        <h1>{'Infrastructure Management Page'}</h1>
        {'This is an infrastructure management page.'}
      </div>
    );
  }
}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={HomePage} />
      <Route path='cloud-status' component={CloudStatusPage} />
      <Route path='infrastructure-management' component={InfrastructureManagementPage} />
      <Redirect from='*' to='/' />
    </Route>
  </Router>,
  document.getElementById('root')
);
