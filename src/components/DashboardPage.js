import React, {Component} from 'react';
import {Link} from 'react-router';

export default class DashboardPage extends Component {
  render() {
    return (
      <div className='container-fluid'>
        <h1>{'Welcome to Fuel DevOps Portal'}</h1>
        <div className='dashboard-page-links'>
          <DashboardPageLink
            to='/all-regions/status'
            title='Status'
            text='API Availability, API Health, Key Operations Performance'
          />
          <DashboardPageLink
            to='/all-regions/intelligence'
            title='Intelligence'
            text='Google like search engine accross all resources of all envs physical and
            virtually'
          />
          <DashboardPageLink
            to='/all-regions/capacity'
            title='Capacity'
            text='Capacity Managmenet, Planning and Utilization of resources per region and tenant'
          />
          <DashboardPageLink
            to='/all-regions/runbooks'
            title='Runbooks'
            text='Keep all scripts related to enviorment here and run them on demand or regular
            basis'
          />
          <DashboardPageLink
            to='/all-regions/security'
            title='Security'
            text='Monitory Security violations in cloud resources, e.g. wide open security groups'
          />
          <DashboardPageLink
            to='/all-regions/infrastructure'
            title='Infrastructure'
            text='Access user interfaces of available infrastructure services'
          />
        </div>
      </div>
    );
  }
}

const DashboardPageLink = ({to, title, text}) => {
  return (
    <div className='dashboard-page-link-container'>
      <div className='dashboard-page-link'>
        <h3>{title}</h3>
        <div>
          {text}
        </div>
        <Link to={to} className='btn btn-primary'>{'Launch'}</Link>
      </div>
    </div>
  );
};

