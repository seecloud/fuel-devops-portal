import React, {Component} from 'react';
import {Link} from 'react-router';

export default class DashboardPage extends Component {
  render() {
    return (
      <div className='container-fluid'>
        <h1>{'Welcome to Fuel DevOps Portal'}</h1>
        <div className='dashboard-page-links'>
          <DashboardPageLink
            to='/all-regions/cloud-status'
            title='Cloud Status'
          />
          <DashboardPageLink
            to='/all-regions/cloud-intelligence'
            title='Cloud Intelligence'
          />
          <DashboardPageLink
            to='/all-regions/capacity-management'
            title='Capacity Management'
          />
          <DashboardPageLink
            to='/all-regions/resource-optimization'
            title='Resource Optimization'
          />
          <DashboardPageLink
            to='/all-regions/security-monitoring'
            title='Security Monitoring'
          />
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

