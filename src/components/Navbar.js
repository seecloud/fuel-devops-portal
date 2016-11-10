import React, {Component} from 'react';
import {Link, withRouter} from 'react-router';
import {observer} from 'mobx-react';
import cx from 'classnames';

import uiState from '../stores/uiState';

@withRouter
@observer
export default class Navbar extends Component {
  static defaultProps = {
    navigationItems: [
      {url: '/cloud-status', title: 'Cloud Status'},
      {url: '/cloud-intelligence', title: 'Cloud Intelligence'},
      {url: '/capacity-management', title: 'Capacity Management'},
      {url: '/resource-optimization', title: 'Resource Optimization'},
      {url: '/security-monitoring', title: 'Security Monitoring'},
      {url: '/infrastructure', title: 'Infrastructure'}
    ]
  }

  render() {
    const {router, navigationItems} = this.props;
    if (!uiState.authenticated) return null;
    return (
      <nav className='navbar navbar-default'>
        <div className='container'>
          <div className='navbar-header'>
            <Link to='/' className='navbar-brand' />
          </div>
          <ul className='nav navbar-nav navbar-left'>
            {navigationItems.map(({url, title}) => {
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
