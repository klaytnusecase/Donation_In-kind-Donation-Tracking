import React from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router';
import {connect} from 'react-redux';

import PlanningHappiness from './planning/Planning';
import MakingHappiness from './making/Making';
import DistributingHappiness from './distributing/Distributing';
import DistributingFinalHappiness from './distributingFinal/DistributingFinal';
import CheckingHappiness from './checking/Checking';
import Receipt from './receipt/Receipt';
import ReceiptVolun from './receipt/ReceiptVolun';
import UploadReceipt from './uploadReceipt/UploadReceipt';

class Donation extends React.Component {
  render() {

    switch(this.props.orgType){
      case 'member':
        return <Redirect to="/app"/>;

      case 'volunteer':
        return (
        <Switch>
          <Route path="/app/happiness/checking" exact component={CheckingHappiness} />
          <Route path="/app/happiness/receipt" exact component={ReceiptVolun} />
          <Route path="/app/happiness/receipt/upload" exact component={UploadReceipt} />
        </Switch>
        );

      case 'admin':
        return (
        <Switch>
          <Route path="/app/happiness/planning" exact component={PlanningHappiness} />
          <Route path="/app/happiness/making" exact component={MakingHappiness} />
          <Route path="/app/happiness/distributing" exact component={DistributingHappiness} />
          <Route path="/app/happiness/distributingFinal" exact component={DistributingFinalHappiness} />
          <Route path="/app/happiness/checking" exact component={CheckingHappiness} />
        </Switch>
        );
    }
  }
}

function mapStateToProps(state) {
  return {
    orgType: state.auth.org_type,
  };
}


export default withRouter(connect(mapStateToProps)(Donation));
