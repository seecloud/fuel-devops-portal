import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Link, withRouter} from 'react-router';
import {observer} from 'mobx-react';
import {observable} from 'mobx';
import cx from 'classnames';

@observer
class DropdownMenuItem extends Component {
  static defaultProps = {
    collapsible: false
  }

  @observable isOpen = false

  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick);
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick);
    window.removeEventListener('resize', this.onWindowResize);
  }

  onWindowResize = () => {
    if (this.isOpen) this.toggle(false);
  }

  onDocumentClick = (e) => {
    if (this.isOpen && !ReactDOM.findDOMNode(this.refs['dropdown-toggle']).contains(e.target)) {
      this.toggle(false);
    }
  }

  toggle = (isOpen) => {
    this.isOpen = isOpen;
  }

  render() {
    const {label, children, collapsible} = this.props;

    return (
      <li className={cx('dropdown', {'navbar-collapsed': collapsible, open: this.isOpen})}>
        <button
          ref='dropdown-toggle'
          className='dropdown-toggle'
          onClick={() => this.toggle(!this.isOpen)}
        >
          {label}
          <span className='caret' />
        </button>
        <ul
          className={cx({
            'nav navbar-nav navbar-left': collapsible,
            'dropdown-menu': !collapsible || this.isOpen
          })}
        >
          {children}
        </ul>
      </li>
    );
  }
}

@withRouter
@observer(['uiState', 'regions'])
export default class Navbar extends Component {
  static defaultProps = {
    navigationItems: [
      {url: 'status', title: 'Status'},
      {url: 'intelligence', title: 'Intelligence'},
      {url: 'capacity', title: 'Capacity'},
      {url: 'runbooks', title: 'Runbooks'},
      {url: 'security', title: 'Security'},
    ]
  }

  render() {
    const {uiState, regions, router, location, navigationItems} = this.props;
    if (!uiState.authenticated) return null;
    const {activeRegionName} = this.props.uiState;
    const urlPrefix = activeRegionName ?
      `/region/${encodeURIComponent(activeRegionName)}/` :
      '/all-regions/';
    const activeRegion = regions.items.find((region) => region.name === activeRegionName);
    let urlSuffix = navigationItems[0].url;
    const regionPrefixMatch = location.pathname.match(/^(?:\/region\/.*?|\/all-regions)\/(.*)/);
    if (regionPrefixMatch) {
      urlSuffix = regionPrefixMatch[1];
    }
    const activePage = navigationItems.find(({url}) => router.isActive(urlPrefix + url));

    return (
      <nav className='navbar navbar-default'>
        <div className='container'>
          <div className='navbar-header'>
            <Link to='/' className='navbar-brand' />
          </div>
          <ul className='nav navbar-nav navbar-left'>
            <DropdownMenuItem
              key='regions'
              label={activeRegion ? activeRegion.name : 'All regions'}
            >
              <li key='all' className={cx({active: !activeRegion})}>
                <Link to={`/all-regions/${urlSuffix}`}>{'All regions'}</Link>
              </li>
              <li key='divider' className='divider' />
              {regions.items.map(({name}) =>
                <li key={name} className={cx({active: name === (activeRegion || {}).name})}>
                  <Link to={`/region/${encodeURIComponent(name)}/${urlSuffix}`}>{name}</Link>
                </li>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              key='pages'
              label={activePage ? activePage.title : 'Launch'}
              collapsible
            >
              {navigationItems.map(({url, title}) => {
                const fullUrl = urlPrefix + url;
                return (
                  <li key={fullUrl} className={cx({active: url === (activePage || {}).url})}>
                    <Link to={fullUrl}>{title}</Link>
                  </li>
                );
              })}
            </DropdownMenuItem>
          </ul>
          <ul className='nav navbar-nav navbar-right'>
            <li><Link to='/logout'><div className='icon-box logout-icon' /></Link></li>
          </ul>
        </div>
      </nav>
    );
  }
}
