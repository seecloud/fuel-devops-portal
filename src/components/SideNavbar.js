import React, {Component} from 'react';
import {Link, withRouter} from 'react-router';
import cx from 'classnames';

@withRouter
export default class SideNavbar extends Component {
  static defaultProps = {
    navigationItems: []
  }

  render() {
    const {router, navigationItems} = this.props;
    return (
      <div className='side-navbar'>
        <ul>
          {navigationItems.map(({url, title, iconClassName}) => {
            return (
              <li key={url} className={cx({active: router.isActive(url, true)})}>
                <Link to={url}>
                  <div className={cx('icon-box', iconClassName)} />
                  <span>{title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
