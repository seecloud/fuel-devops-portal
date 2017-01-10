import React, {Component} from 'react';
import {Link, withRouter} from 'react-router';
import cx from 'classnames';

@withRouter
export default class SideNavbar extends Component {
  static defaultProps = {
    navigationItems: []
  }

  render() {
    const {router, navigationItems, params: {regionName}} = this.props;
    const urlPrefix = regionName ?
      `/region/${encodeURIComponent(regionName)}/` :
      '/all-regions/';
    return (
      <div className='side-navbar'>
        <ul>
          {navigationItems.map(({url, title, iconClassName}) => {
            const fullUrl = urlPrefix + url;
            return (
              <li key={fullUrl} className={cx({active: router.isActive(fullUrl, true)})}>
                <Link to={fullUrl}>
                  <div className={cx('icon-box', iconClassName)}>
                    {!iconClassName && title[0].toUpperCase()}
                  </div>
                  <div className='tooltip'>{title}</div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
