import React, {Component} from 'react';
import {Link} from 'react-router';

export default class DashboardPage extends Component {
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

