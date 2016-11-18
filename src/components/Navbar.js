import React, {Component} from 'react';
import {Link, withRouter} from 'react-router';
import {observer, inject} from 'mobx-react';
import {observable} from 'mobx';
import cx from 'classnames';

@withRouter
@inject('uiState', 'regions')
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

  @observable regionMenuOpen = false

  toggleRegionMenu = () => {
    this.regionMenuOpen = !this.regionMenuOpen;
  }

  render() {
    const {uiState, router, navigationItems} = this.props;
    if (!uiState.authenticated) return null;
    return (
      <nav className='navbar navbar-default'>
        <div className='container'>
          <div className='navbar-header'>
            <Link to='/' className='navbar-brand' />
          </div>
          <ul className='nav navbar-nav navbar-left'>
            <li key='regions' className={cx('dropdown', {open: this.regionMenuOpen})}>
              <button className='dropdown-toggle' onClick={this.toggleRegionMenu}>
                {'All regions'}
                <span className='caret' />
              </button>
              <ul className='dropdown-menu'>
                <li key='all'>
                  <a href='#'>{'All regions'}</a>
                </li>
                <li key='divider' className='divider' />
                {this.props.regions.items.map((region) => {
                  return (
                    <li key={region.id}>
                      <a href='#'>{region.name}</a>
                    </li>
                  );
                })}
              </ul>
            </li>
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
