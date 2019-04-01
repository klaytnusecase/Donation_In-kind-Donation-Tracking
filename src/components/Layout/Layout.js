/**
 * Flatlogic Dashboards (https://flatlogic.com/admin-dashboards)
 *
 * Copyright © 2015-present Flatlogic, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Switch, Route, withRouter } from 'react-router';

// an example of react-router code-splitting
/* eslint-disable */

import loadFillInformation from 'bundle-loader?lazy!../../pages/fillInformation';
import loadManage from 'bundle-loader?lazy!../../pages/manage';
import loadHappiness from 'bundle-loader?lazy!../../pages/happiness';
import loadDonation from 'bundle-loader?lazy!../../pages/donation';
import loadNotFound from 'bundle-loader?lazy!../../pages/notFound';

import loadCharts from 'bundle-loader?lazy!../../pages/charts';

/* eslint-enable */

import s from './Layout.scss';
import Header from '../Header';
import Footer from '../Footer';
import Bundle from '../../core/Bundle';
import Sidebar from '../Sidebar';

// Dashboard component is loaded directly as an example of server side rendering
import Dashboard from '../../pages/dashboard/Dashboard';

import Web3 from 'web3';
var HappyAlliance = require('../../../HappyAlliance.json');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
var happyAlliance = new web3.eth.Contract(HappyAlliance.abi, '0x6146a551fa876f63Be823BFEE969D4aB53Ed7B3B');


const FillInformationBundle = Bundle.generateBundle(loadFillInformation);
const HappinessBundle = Bundle.generateBundle(loadHappiness);
const ChartsBundle = Bundle.generateBundle(loadCharts);
const DonationBundle = Bundle.generateBundle(loadDonation);
const NotFoundBundle = Bundle.generateBundle(loadNotFound);
const ManageBundle = Bundle.generateBundle(loadManage);



class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.web3 = web3;
    this.happyAlliance = happyAlliance;

    this.state = {
      sidebarOpen: false,
    };
  }

  render() {
    //this.web3.eth.getAccounts(console.log);
    //this.props.web3.eth.getCode('0x6143fc3e80F57B430F1324E8846E7e78AbA877A7').then(console.log);
    //this.happyAlliance.methods.viewFinalBoxInformation('test').call().then(console.log);

    return (
      <div className={s.root}>
        <Sidebar />
        <div
          className={cx(s.wrap, {[s.sidebarOpen]: this.state.sidebarOpen})}
        >
          <Header
            sidebarToggle={() =>
              this.setState({
                sidebarOpen: !this.state.sidebarOpen,
              })
            }
          />
          <main className={s.content}>
            <Switch>
              <Route path="/app" exact component={Dashboard} />
              <Route path="/app/fillInformation" exact component={FillInformationBundle} />
              <Route path="/app/manage" component={ManageBundle} />
              <Route path="/app/donation" component={DonationBundle} />
              <Route path="/app/happiness" component={HappinessBundle} />
              <Route component={NotFoundBundle} />

              /* For legacy*/
              <Route path="/app/components/charts" exact component={ChartsBundle} />

            </Switch>
          </main>
          <Footer />
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(s)(Layout));
