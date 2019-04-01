import React from 'react';
import { Switch, Route, withRouter } from 'react-router';
import {connect} from 'react-redux';

import DonationList from './list/DonationList';
import DonationListMember from './listMember/DonationList';
import IndDonationList from './list/IndDonationList';
import DonationNew from './new/DonationNew';
import DonationEdit from  './edit/DonationEdit'

class Donation extends React.Component {
  render() {

    switch(this.props.orgType){
      case 'member':
        return (
          <Switch>
            <Route path="/app/donation" exact component={DonationListMember} name={this.props.name}/>
            <Route path="/app/donation/new" exact component={DonationNew} />
            <Route path="/app/donation/:id" exact component={IndDonationList} />
            <Route path="/app/donation/edit/:id" exact component={DonationEdit} />
          </Switch>
      );

      case 'admin':
        return (
          <Switch>
            <Route path="/app/donation" exact component={DonationList} />
            <Route path="/app/donation/new" exact component={DonationNew} />
            <Route path="/app/donation/:id" exact component={IndDonationList} />
            <Route path="/app/donation/edit/:id" exact component={DonationEdit} />
          </Switch>
        );
      default:
        
    }
  }
}

function mapStateToProps(state) {
  return {
    orgType: state.auth.org_type,
    name: state.auth.name,
  };
}

export default withRouter(connect(mapStateToProps)(Donation));
