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
      {url: 'intelligence', title: 'Cloud Intelligence'},
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
    const {uiState, regions, router, location, navigationItems} = this.props;
    if (!uiState.authenticated) return null;
    const activeRegionName = this.props.uiState.activeRegionName;
    const urlPrefix = activeRegionName ?
      `/region/${encodeURIComponent(activeRegionName)}/` :
      '/all-regions/';
    const activeRegion = regions.items.find((region) => region.name === activeRegionName);
    let urlSuffix = navigationItems[0].url;
    const regionPrefixMatch = location.pathname.match(/^(?:\/region\/.*?|\/all-regions)\/(.*)/);
    if (regionPrefixMatch) {
      urlSuffix = regionPrefixMatch[1];
    }

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
                    to={`/all-regions/${urlSuffix}`}
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
                        to={`/region/${encodeURIComponent(region.name)}/${urlSuffix}`}
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
              const fullUrl = urlPrefix + url;
              return (
                <li key={fullUrl} className={cx({active: router.isActive(fullUrl)})}>
                  <Link to={fullUrl}>{title}</Link>
                </li>
              );
            })}
          </ul>
          <ul className='nav navbar-nav navbar-right'>
            <li><Link to='/logout'><div className='icon-box logout-icon' /></Link></li>
          </ul>
        </div>
      </nav>
    );
  }
}
