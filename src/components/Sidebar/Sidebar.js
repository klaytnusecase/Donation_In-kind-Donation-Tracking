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
            header="대시보드"
            headerLink="/app"
            glyph="dashboard"
          />
          <LinksGroup
            header="기부 조회 & 등록하기"
            headerLink="/app/donation"
            glyph="typography"
          />
          <LinksGroup
            header="회원 관리"
            headerLink="/app/manage/member"
            childrenLinks={[
              {
                name: '회원 등록',
                link: '/app/manage/member/registerUser',
               },
               {
                name: '멤버사 목록',
                link: '/app/manage/member/memberList',
               },
               {
                name: '전달기관 목록',
                link: '/app/manage/member/volunteerList',
               },
            ]}
            glyph="notifications"
          />
          <LinksGroup
            header="Happiness Box"
            headerLink="/app/typography"
            childrenLinks={[
              {
                name: '박스 기획하기',
                link: '/app/happiness/planning',
              },
              {
                name: '박스 수량 정하기',
                link: '/app/happiness/making',
              },
              {
                name: '박스 나눠주기 (임시저장)',
                link: '/app/happiness/distributing',
              },
              {
                name: '박스 나눠주기 (최종)',
                link: '/app/happiness/distributingFinal',
              },
              {
                name: '박스 확인하기',
                link: '/app/happiness/checking',
              },
            ]}
            glyph="components"
          />
          <LinksGroup
            header="환경설정"
            headerLink="/app/manage/configuration"
            childrenLinks={[
              {
                name: '수혜자 카테고리 관리',
                link: '/app/manage/configuration/manageRecipientCategory',
               },
               {
                name: '시즌 관리',
                link: '/app/manage/configuration/manageSeason',
               },
            ]}
            glyph="settings"
          />
        </ul>);
      case 'member':
        return (<ul className={s.nav}>
          <LinksGroup
            header="대시보드"
            headerLink="/app"
            glyph="dashboard"
          />
          <LinksGroup
            header="기부 조회 & 등록하기"
            headerLink="/app/donation"
            glyph="typography"
          />
        </ul>);
      case 'volunteer':
        return (
          <ul className={s.nav}>
            <LinksGroup
            header="대시보드"
            headerLink="/app"
            glyph="dashboard"
          />
          <LinksGroup
            header="Happiness Box"
            headerLink="/app/typography"
            childrenLinks={[
              {
                name: '박스 확인하기',
                link: '/app/happiness/checking',
              },
              {
                name: '수령증 발급하기',
                link: '/app/happiness/receipt',
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
