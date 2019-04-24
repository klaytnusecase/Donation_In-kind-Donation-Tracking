/**
 * Flatlogic Dashboards (https://flatlogic.com/admin-dashboards)
 *
 * Copyright © 2015-present Flatlogic, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect, withRouter } from 'react-router';
import { connect, Provider as ReduxProvider } from 'react-redux';

import Bundle from '../core/Bundle';

/* eslint-disable */
import loadNotFound from 'bundle-loader?lazy!../pages/notFound/NotFound';
/* eslint-enable */

import LayoutComponent from '../components/Layout/Layout';
import LoginComponent from '../pages/login/Login';

// import { auth } from '../config';

const NotFoundBundle = Bundle.generateBundle(loadNotFound);

const ContextType = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: PropTypes.func.isRequired,
  // Universal HTTP client
  fetch: PropTypes.func.isRequired,
  // Integrate Redux
  // http://redux.js.org/docs/basics/UsageWithReact.html
  ...ReduxProvider.childContextTypes,
};


const PrivateRoute = ({ component, isAuthenticated, org_type, klaytnAddress, ...rest }) =>
  <Route
    {...rest}
    render={props =>
      //(isAuthenticated && (org_type=="John Does"))
      isAuthenticated
        ? React.createElement(component, props)
        : <Redirect to='/login' />
      }
  />;


/* eslint-enable */

class App extends React.PureComponent {
  static propTypes = {
    context: PropTypes.shape(ContextType),
    isAuthenticated: PropTypes.bool,
    org_type: PropTypes.any,
    klaytnAddress: PropTypes.string,
  };

  static defaultProps = {
    context: null,
    isAuthenticated: false,
    org_type: null,
    klaytnAddress: null,
  };

  static contextTypes = {
    router: PropTypes.any,
    store: PropTypes.any,
  };

  static childContextTypes = ContextType;

  getChildContext() {
    // fixme. find better solution?
    return this.props.context || this.context.router.staticContext;
  }

  render() {
    return (
      <Switch>
        <Route path="/" exact render={() => <Redirect to="/app" />} />
        <PrivateRoute
          isAuthenticated={this.props.isAuthenticated}
          org_type = {this.props.org_type}
          klaytnAddress = {this.props.klaytnAddress}
          path="/app"
          component={LayoutComponent}
        />
        <Route path="/login" exact component={LoginComponent} />
        <Route component={NotFoundBundle} />
      </Switch>
    );
  }
}

function mapStateToProps(store) {
  return {
    isAuthenticated: store.auth.isAuthenticated,
    org_type: store.auth.org_type,
    klaytnAddress: store.auth.klaytnAddress,
  };
}

export default withRouter(connect(mapStateToProps)(App));
