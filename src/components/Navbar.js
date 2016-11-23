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
      {url: 'cloud-status', title: 'Cloud Status'},
      {url: 'cloud-intelligence', title: 'Cloud Intelligence'},
      {url: 'capacity-management', title: 'Capacity Management'},
      {url: 'resource-optimization', title: 'Resource Optimization'},
      {url: 'security-monitoring', title: 'Security Monitoring'},
    ]
  }

  @observable regionMenuOpen = false

  toggleRegionMenu = () => {
    this.regionMenuOpen = !this.regionMenuOpen;
  }

  render() {
    const {uiState, activeRegionName, regions, router, navigationItems} = this.props;
    if (!uiState.authenticated) return null;
    const urlPrefix = activeRegionName ?
      `/region/${encodeURIComponent(activeRegionName)}/` :
      '/all-regions/';
    const activeNavigationItemUrl = navigationItems
      .map((navigationItem) => navigationItem.url)
      .find((navigationItemUrl) => router.isActive(urlPrefix + navigationItemUrl));
    const activeRegion = regions.items.find((region) => region.name === activeRegionName);
    const defaultNavigationItemUrl = navigationItems[0].url;

    return (
      <nav className='navbar navbar-default'>
        <div className='container'>
          <div className='navbar-header'>
            <Link to='/' className='navbar-brand' />
          </div>
          <ul className='nav navbar-nav navbar-left'>
            <li key='regions' className={cx('dropdown', {open: this.regionMenuOpen})}>
              <button className='dropdown-toggle' onClick={this.toggleRegionMenu}>
                {activeRegion ? activeRegion.name : 'All regions'}
                <span className='caret' />
              </button>
              <ul className='dropdown-menu'>
                <li key='all'>
                  <Link
                    to={`/all-regions/${
                      activeNavigationItemUrl || defaultNavigationItemUrl
                    }`}
                    onClick={this.toggleRegionMenu}
                  >
                    {'All regions'}
                  </Link>
                </li>
                <li key='divider' className='divider' />
                {regions.items.map((region) => {
                  return (
                    <li key={region.name}>
                      <Link
                        to={`/region/${encodeURIComponent(region.name)}/${
                          activeNavigationItemUrl || defaultNavigationItemUrl
                        }`}
                        onClick={this.toggleRegionMenu}
                      >
                        {region.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            {navigationItems.map(({url, title}) => {
              return (
                <li key={url} className={cx({active: url === activeNavigationItemUrl})}>
                  <Link to={urlPrefix + url}>{title}</Link>
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
