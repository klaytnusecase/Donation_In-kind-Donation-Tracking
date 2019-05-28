import React from 'react';
import {connect} from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {withRouter, Link} from 'react-router-dom';
import PropTypes from 'prop-types';


import Icon from '../Icon';
import LinksGroup from './LinksGroup/LinksGroup';

import s from './Sidebar.scss';

class Sidebar extends React.Component {
  static propTypes = {
    sidebarToggle: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sidebarToggle: () => {
    },
    orgType: ''
  }
  renderSwitch(param) {
    switch(param) {
      case 'admin':
        return (<ul className={s.nav}>
          <LinksGroup
            header="Dashboard"
            headerLink="/app"
            glyph="dashboard"
          />
          <LinksGroup
            header="Donation"
            headerLink="/app/donation"
            glyph="typography"
          />
          <LinksGroup
            header="Donation Box"
            headerLink="/app/typography"
            childrenLinks={[
              {
                name: 'Box Plan',
                link: '/app/happiness/planning',
              },
              {
                name: 'Quantity Setting',
                link: '/app/happiness/making',
              },
              {
                name: 'Temporal Distribution',
                link: '/app/happiness/distributing',
              },
              {
                name: 'Final Distribution',
                link: '/app/happiness/distributingFinal',
              },
              {
                name: 'Box Check',
                link: '/app/happiness/checking',
              },
            ]}
            glyph="components"
          />
          <LinksGroup
            header="Management Users"
            headerLink="/app/manage/member"
            childrenLinks={[
              {
                name: 'Register Users',
                link: '/app/manage/member/registerUser',
               },
               {
                name: 'Members List',
                link: '/app/manage/member/memberList',
               },
               {
                name: 'NPOs List',
                link: '/app/manage/member/volunteerList',
               },
            ]}
            glyph="notifications"
          />
          <LinksGroup
            header="Configuration"
            headerLink="/app/manage/configuration"
            childrenLinks={[
              {
                name: 'Recipient Category',
                link: '/app/manage/configuration/manageRecipientCategory',
               },
               {
                name: 'Manage Season',
                link: '/app/manage/configuration/manageSeason',
               },
            ]}
            glyph="settings"
          />
        </ul>);
      case 'member':
        return (<ul className={s.nav}>
          <LinksGroup
            header="Dashboard"
            headerLink="/app"
            glyph="dashboard"
          />
          <LinksGroup
            header="Donation"
            headerLink="/app/donation"
            glyph="typography"
          />
        </ul>);
      case 'volunteer':
        return (
          <ul className={s.nav}>
            <LinksGroup
            header="Dashboard"
            headerLink="/app"
            glyph="dashboard"
          />
          <LinksGroup
            header="Donation Box"
            headerLink="/app/typography"
            childrenLinks={[
              {
                name: 'Check box',
                link: '/app/happiness/checking',
              },
              {
                name: 'Issue Receipt',
                link: '/app/happiness/receipt',
              },
              {
                name: 'Upload Receipt',
                link: '/app/happiness/receipt/upload',
              },
            ]}
            glyph="components"
          />
        </ul>
        );


      default:
        return 'foo';
    }
  }


  render() {
    return (
      <nav className={s.root}>
        <header className={s.logo}>
          <Link to="/app">
            <Icon glyph="logo" />
          </Link>
        </header>
        {this.renderSwitch(this.props.orgType)}
      </nav>
    )};
};


function mapStateToProps(state) {
  return {
    sidebarOpened: state.navigation.sidebarOpened,
    sidebarStatic: state.navigation.sidebarStatic,
    orgType: state.auth.org_type,
  };
}

export default connect(mapStateToProps)(withStyles(s)(Sidebar));
