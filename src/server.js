/**
 * Flatlogic Dashboards (https://flatlogic.com/admin-dashboards)
 *
 * Copyright © 2015-present Flatlogic, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt';
import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import nodeFetch from 'node-fetch';
import React from 'react';
import { StaticRouter } from 'react-router';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import { Provider } from 'react-redux';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './pages/error/ErrorPage';
import errorPageStyle from './pages/error/ErrorPage.scss';
import createFetch from './createFetch';
import models from './data/models';
import schema from './data/schema';
import configureStore from './store/configureStore';
import { setRuntimeVariable } from './actions/runtime';
import { receiveLogin, receiveLogout } from './actions/user';
import config from './config';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import theme from './styles/theme.scss';

const connection     = require('./db_conn');
const crypto   = require('crypto');

const app = express();
const fs = require('fs')

const Caver = require('caver-js');
const caver = new Caver('http://127.0.0.1:8551');


//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(
  expressJwt({
    secret: config.auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.cookies.id_token,
  }),
);
// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof Jwt401Error) {
    console.error('[express-jwt-error]', req.cookies.id_token);
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie('id_token');
  }
  next(err);
});


if (__DEV__) {
  app.enable('trust proxy');
}
app.post('/login', (req, res) => {
  // replace with real database check in production
  // const user = graphql.find(req.login, req.password);
  const login = req.body.login; // eslint-disable-line
  const password = req.body.password; // eslint-disable-line

  connection.query("select * from users where username = ?", [login], (err, rows) => {
    if (err){
      res.status(401).json({ message: err });
    }
    else if(!rows.length){ res.status(401).json({ message: 'Invalid username or password.' });}
      else{
        let salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
        salt = `${salt}${password}`;
        const encPassword = crypto.createHash('sha1').update(salt).digest('hex');
        const dbPassword  = rows[0].password;
        if(!(dbPassword === encPassword)){
          res.status(401).json({ message: 'Invalid username or password.' });
         }
         else {
          const expiresIn = 60 * 60 * 24; // 1 days
          let user = false;
          user = { user, login };
          const token = jwt.sign(user, config.auth.jwt.secret, {expiresIn});
          const type = rows[0].org_type;
          const name = rows[0].username;
          const affiliation = rows[0].affiliation;
          res.cookie('id_token', token, {
            maxAge: 1000 * expiresIn,
            httpOnly: false,
          });
          res.cookie('org_type', type, {
            maxAge: 1000 * expiresIn,
            httpOnly: false,
          });
          res.cookie('name', name, {
            maxAge: 1000 * expiresIn,
            httpOnly: false,
          });
          res.cookie('affiliation', affiliation, {
            maxAge: 1000 * expiresIn,
            httpOnly: false,
          });
          res.json({id_token: token, org_type: type, name, affiliation});
          // HK: should be changed to organization type, not full_name
        }
      }
  });
});

app.post('/register', (req, res) => {
  const login = req.body.login; // eslint-disable-line
  const password = req.body.password; // eslint-disable-line
  const password_rep = req.body.password_rep;
  const affiliation = req.body.affiliation;
  const org_type = req.body.org_type;

  if (password !== password_rep){
    res.status(401).json({ message:'비밀번호가 다릅니다.' });
  }
  else {
    connection.query("select * from users where username = ?", [login], (err, rows) => {
      if (err) {
        res.status(401).json({message: err});
      }
      else if (rows.length) {
        res.status(401).json({message: '이미 등록된 유저입니다'});
      }
      else {
        let salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
        salt = `${salt}${password}`;
        const encPassword = crypto.createHash('sha1').update(salt).digest('hex');
        connection.query("INSERT INTO users (username, password, affiliation, org_type) VALUES (?, ?, ?, ?);", [login, encPassword, affiliation, org_type], (err_, rows_) => {
          if (err) {
          res.status(401).json({message: err_});
          }
          else{
            res.json({});
          }
        });
      }
    });
  }
});

app.get('/user/member_list', (req, res) => {
  connection.query("select username, affiliation, e_mail, contacts from users where org_type = ?", ['member'], (err, rows) => {
    if (err) {
      res.status(401).json({message: err});
    }
    else {
      res.send(JSON.stringify(rows));
    }
  });
});

app.get('/user/volunteer_list', (req, res) => {
  connection.query("select username, affiliation, e_mail, contacts from users where org_type = ?", ['volunteer'], (err, rows) => {
    if (err) {
      res.status(401).json({message: err});
    }
    else {
      res.send(JSON.stringify(rows));
    }
  });
});

app.post('/privateKey', (req, res) => {
  var userAccount = caver.klay.accounts.create();
  const jsonContent = caver.klay.accounts.encrypt(userAccount.privateKey, 'prisming')

  fs.writeFile('./keystore/'+userAccount.address, JSON.stringify(jsonContent), function(err) {
    if(err) {
      res.send({message: err});
    }
    else {
      connection.query("update users set encryped_key = ? where username = ?", [userAccount.address, req.body.login], (err, rows) => {
      if (err) {
        res.status(401).json({message: err});
      }
      else {
        res.send(req.body.key);
      }
    });
    }
  });
});

app.post('/getInformation', (req, res) => {
  connection.query("select affiliation, address, representative_name, e_mail, contacts from users where username = ?", [req.body.name], (err, rows) => {
    if (err) {
      res.status(401).json({message: err});
    }
    else {
      res.send(JSON.stringify(rows[0]));
    }
  });
});

app.post('/changeInformation', (req, res) => {
  const name = req.body.name; // eslint-disable-line
  const password = req.body.password;
  const password_rep = req.body.password_rep;
  const affiliation = req.body.affiliation;
  const address = req.body.address;
  const representative_name = req.body.representative_name;
  const e_mail = req.body.e_mail;
  const contacts = req.body.contacts;


  if (password !== password_rep){
    res.status(401).json({ message:'비밀번호가 다릅니다.' });
  }
  else {
    let salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
     salt = `${salt}${password}`;
    const encPassword = crypto.createHash('sha1').update(salt).digest('hex');
    connection.query("update users set password = ?, affiliation = ?, address = ?, representative_name = ?, e_mail = ?, contacts = ? where username = ?", [encPassword, affiliation, address, representative_name, e_mail, contacts, name], (err, rows) => {
      if (err) {
        res.status(401).json({message: err});
      }
      else {
        res.json({})
      }
    });
  }
});

app.post('/configuration/registerRecipientCategory', (req, res) => {
  const stringifyData = req.body.stringifyData;
  const type = req.body.type;
  let selected_type;
  if (type === 'type1') selected_type = 'recipientCategory_type_1'
  else selected_type = 'recipientCategory_type_2'
  connection.query("update configuration set stringify_data = ? where type = ?", [stringifyData, selected_type], (err, rows) => {
    if (err) {
      res.status(401).json({message: err});
      console.log(err)
    }
    else{
      res.json({})
    }
  });
});

app.get('/configuration/getRecipientCategory', (req, res) => {
  connection.query("select * from configuration where type = ?", ['recipientCategory_type_1'], (err, rows) => {
    if (err) {
      res.status(401).json({message: err});
      console.log(err)
    }
    else{
      connection.query("select * from configuration where type = ?", ['recipientCategory_type_2'], (err_, rows_) => {
      if (err_) {
        res.status(401).json({message: err_});
        console.log(err_)
      }
      else{
        const result = {'type_1': JSON.parse(rows[0].stringify_data), 'type_2': JSON.parse(rows_[0].stringify_data)}
        res.send(JSON.stringify(result));
      }
      });
    }
  });
});

app.get('/configuration/switch', (req, res) => {
  connection.query("select type, stringify_data from configuration where type IN (?,?,?)", ['switch_1','switch_2','switch_3'], (err, rows) => {
    if (err) {
      res.status(401).json({message: err});
      console.log(err)
    }
    const result_dict = {}
    for (const i in rows){
      result_dict[rows[i].type] = JSON.parse(rows[i].stringify_data)
    }
    res.send(JSON.stringify(result_dict));
  })
});

app.post('/configuration/switchChange', (req, res) => {
  connection.query("UPDATE configuration set stringify_data = ? where type = ?", [req.body.status, req.body.type], (err, rows) => {
    if (err) {
      res.status(401).json({message: err});
      console.log(err)
    }
    res.json({})
  })
});

app.get('/configuration/getSeason', (req, res) => {
  connection.query("select stringify_data from configuration where type = ?", ['season'], (err, rows) => {
    if (err) {
      res.status(401).json({message: err});
      console.log(err)
    }
    console.log(rows)
    res.send(JSON.stringify(rows[0]));
  })
});

app.post('/configuration/setSeason', (req, res) => {
  connection.query("update configuration set stringify_data = ? where type = ?", [req.body.season, 'season'], (err, rows) => {
    if (err) {
      res.status(401).json({message: err});
      console.log(err)
    }
    connection.query("UPDATE donations set is_new = ? where is_new = ?", [false, true], (err, rows) => {
      if (err) {
        res.status(401).json({message: err});
        console.log(err)
      }
        connection.query("TRUNCATE TABLE temp_distribution", [], (err, rows) => {
        if (err) {
          res.status(401).json({message: err});
          console.log(err)
        }
        res.json({})
      })
    });
  })
});

app.get('/donations', (req, res) => {
    connection.query('select * from donations where is_new = ?;', [true],(err, result) => {
        if(err) throw err;
        res.send(JSON.stringify(result));
    });
});
app.post('/donations/member', (req, res) => {
    connection.query('select * from donations where company_id = ? and is_new = ?;', [req.body.name, true],(err, result) => {
        if(err) throw err
        console.log(result)
        res.send(JSON.stringify(result));
    });
});

app.get('/donations/forhappiness', (req, res) => {
    connection.query("select A.donation_id, B.column_type, B.detail from donations A, donation_column B where A.donation_id=B.donation_id and B.column_type in ('물품명', '수량', '유통기한') and A.is_new=?", [true],(err, result) => {
        if(err) throw err;
        result = convertFormDonation(groupBy(result,(item) => [item.donation_id]));
        res.send(JSON.stringify(result));
    });
});

app.get('/collections', (req, res) => {
    connection.query("select * from donations A, donation_column B where A.donation_id=B.donation_id and B.column_type in ('물품명', '수량', '유통기한') and A.is_new=?",[true] ,(err, result) => {
        if(err) throw err;
        result = convertFormDonation(groupBy(result,(item) => [item.donation_id]));
          connection.query("select A.id, A.total_quantity as collection_quantity, A.name, A.expiration_date as expiration_date, B.donation_id, B.quantity, C.detail from collection A, collection_component B, donation_column C where A.id=B.collection_id and B.donation_id=C.donation_id and C.column_type='물품명' and A.season = (select stringify_data from configuration where type = 'season') order by A.id", (err_, result_) => {
          if(err_) throw err_;
          result_ = convertFormCollection(groupBy(result_,(item) => [item.id]));
          const total_result = {donations: result, collectionsForMaking: result_};
          res.send(JSON.stringify(total_result));
        });
    });
});


app.post('/donations/details', (req, res) => {
    connection.query('select * from donation_column A, donations B where A.donation_id = ? and A.donation_id = B.donation_id', [req.body.id], (err, result) => {
        if(err) throw err;
        console.log(result)
        res.send(JSON.stringify(result));
    });
});

app.post('/donations/new', (req, res) => {
  const parsed_data = JSON.parse(req.body.shareholders);
  let nameispublic;
  if (req.body.nameispublic == 'true') nameispublic = true
  else nameispublic = false;
  let quantityispublic;
  if (req.body.quantityispublic == 'true') quantityispublic = true
  else quantityispublic = false;
  let priceispublic;
  if (req.body.priceispublic == 'true') priceispublic = true
  else priceispublic = false;
  let dateispublic;
  if (req.body.dateispublic == 'true') dateispublic = true
  else dateispublic = false;


  parsed_data.push({ column: "물품명", value: req.body.stuff_name, ispublic: nameispublic});
  parsed_data.push({ column: "수량", value: req.body.quantity, ispublic: quantityispublic});
  parsed_data.push({ column: "가격", value: req.body.price, ispublic: priceispublic});
  parsed_data.push({ column: "유통기한", value: req.body.date, ispublic: dateispublic});

  const stringfy_data = JSON.stringify(parsed_data)
  const donation_id = crypto.createHash('sha1').update(stringfy_data).digest('hex');
    connection.query('INSERT INTO donations (company_id, donation_id, prev_donation_id, affiliation, editor, season, is_new, created_at) VALUES (?, ?, ?, ?, ?, (select stringify_data from configuration where type = "season"),?, NOW());', [req.body.company_id, donation_id, '', req.body.affiliation, req.body.affiliation, true], (err, result) => {
      if (err) {
        console.log(err)
        res.status(401).json({message: err});
      }

      else {
        let i = 0;
        while(i < parsed_data.length){
          connection.query("INSERT INTO donation_column (donation_id, column_type, detail, is_public) VALUES (?, ?, ?, ?);", [donation_id, parsed_data[i].column, parsed_data[i].value, parsed_data[i].ispublic], (err_, rows_) => {
          if (err) {
            console.log(err_)
          }
        });
          i += 1
        }
        // res.json({});
        res.send({"donation_id": donation_id});
      }
    });
});

app.post('/donations/edit', (req, res) => {
  const parsed_data = JSON.parse(req.body.shareholders);
  let nameispublic;
  if (req.body.nameispublic == 'true') nameispublic = true
  else nameispublic = false;
  let quantityispublic;
  if (req.body.quantityispublic == 'true') quantityispublic = true
  else quantityispublic = false;
  let priceispublic;
  if (req.body.priceispublic == 'true') priceispublic = true
  else priceispublic = false;
  let dateispublic;
  if (req.body.dateispublic == 'true') dateispublic = true
  else dateispublic = false;


  parsed_data.push({ column: "물품명", value: req.body.stuff_name, ispublic: nameispublic});
  parsed_data.push({ column: "수량", value: req.body.quantity, ispublic: quantityispublic});
  parsed_data.push({ column: "가격", value: req.body.price, ispublic: priceispublic});
  parsed_data.push({ column: "유통기한", value: req.body.date, ispublic: dateispublic});

  const stringfy_data = JSON.stringify(parsed_data)
  const donation_id = crypto.createHash('sha1').update(stringfy_data).digest('hex');
    connection.query('INSERT INTO donations (company_id, donation_id, prev_donation_id, affiliation, editor, is_new, created_at) VALUES (?, ?, ?, ?, ?, ?,NOW());', [req.body.company_id, donation_id, req.body.old_id , req.body.affiliation,req.body.editor, true], (err, result) => {
      if (err) {
        console.log(err)
        res.status(401).json({message: err});
      }
      else {
        let i = 0;
        while(i < parsed_data.length){
          connection.query("INSERT INTO donation_column (donation_id, column_type, detail, is_public) VALUES (?, ?, ?, ?);", [donation_id, parsed_data[i].column, parsed_data[i].value, parsed_data[i].ispublic], (err_, rows_) => {
          if (err_) {
            console.log(err_)
          }
        });
          i += 1
        }
        connection.query('UPDATE donations SET is_new = ? WHERE donation_id = ?;', [false, req.body.old_id], (err__, result__) => {
        if (err__) {
          console.log(err__);
          res.status(401).json({message: err__});
        }
        else{
          connection.query('UPDATE collection_component SET donation_id = ? WHERE donation_id = ?;', [donation_id, req.body.old_id], (err___, result__) => {
          if (err___) {
            console.log(err___);
            res.status(401).json({message: err___});
          }
          else{
            connection.query('UPDATE configuration SET stringify_data = ? WHERE type = ?;', ['false', 'switch_1'], (err____, result___) => {
              if (err____) {
                console.log(err____);
                res.status(401).json({message: err____});
              }
              else{
                res.json({new_id: donation_id});
              }
            })
          }
          })
        }
        });
      }
    });
});



app.post('/collections/new', (req, res) => {
  const parsed_data = JSON.parse(req.body.stringfy_data);
    if (parsed_data.length == 0){
      res.json({})
    }
    else {
      connection.query('select * from collection  where name = ?;', [req.body.name], (check_err, check_result) => {
        if (check_err) {
          console.log(check_err)
          res.status(401).json({message: check_err});
        }
        else if (check_result.length) {
          res.status(401).json({message: '이미 등록된 이름입니다.'});
        }
        else {
          connection.query('INSERT INTO collection (name, total_quantity, season, expiration_date) VALUES (?, ?, (select stringify_data from configuration where type = "season"),?);', [req.body.name, 0, req.body.expirationDate], (err, result) => {
            if (err) {
              res.status(401).json({message: err});
            }
            else {
              const collection_id = result.insertId;
              let i = 0;
              while (i < parsed_data.length) {
                const quantity = parseInt(parsed_data[i].inboxQuantity, 10);
                if (quantity > 0) {
                  connection.query("INSERT INTO collection_component (donation_id, collection_id, quantity) VALUES (?, ?, ?);", [parsed_data[i].donation_id, collection_id, quantity], (err_, rows_) => {
                    if (err_) {
                      console.log(err_)
                    }
                  });
                }
                i += 1
              }
              res.json({});
            }
          });
        }
      });
    }
});

app.post('/collections/setQuantity', (req, res) => {
  const parsed_data = JSON.parse(req.body.stringfy_data);
  let i = 0;
  while (i < parsed_data.length){
    connection.query('UPDATE collection SET total_quantity = ? WHERE id = ?;', [parsed_data[i].collection_quantity,parsed_data[i].id], (err, result) => {
      if (err) {
        console.log(err);
        res.status(401).json({message: err});
      }
    });
    i += 1;
  }
  res.json({});
});

app.post('/collections/remove', (req, res) => {
  connection.query('DELETE from collection WHERE id = ?;', [req.body.id], (err, result) => {
      if (err) {
        console.log(err);
        res.status(401).json({message: err});
      }
      res.json({})
  });
});



app.post('/collections/updateDistribution', (req, res) => {
  const collection_ids = JSON.parse(req.body.collection_ids);
  const volunteer_names = JSON.parse(req.body.volunteer_names);
  const quantities = JSON.parse(req.body.quantities);
  for (const i in quantities) {
    for (const j in quantities[i]) {
      if (quantities[i][j] >= 0) {
        connection.query('INSERT INTO temp_distribution (volunteer_id, collection_id, quantity) VALUES (?, ?, ?) on duplicate key update quantity = ?;', [volunteer_names[i], collection_ids[j], quantities[i][j], quantities[i][j] ], (err, result) => {
          if (err) {
            console.log(err);
            res.status(401).json({message: err});
          }
        });
      }
    }
  }
  res.json({});
});

app.get('/collections/fetchDistribution', (req, res) => {
  connection.query("select id, name, total_quantity as quantity, expiration_date from collection where season = (select stringify_data from configuration where type = 'season')", (err, result) => {
    if (err) {
      console.log(err);
      res.status(401).json({message: err});
    }
    else {
      connection.query("select username, affiliation from users where org_type='volunteer';", (err_, result_) => {
        if (err_) {
          console.log(err_);
          res.status(401).json({message: err_});
        }
        else {
          connection.query("select * from temp_distribution;", (err__, result__) => {
            if (err__) {
              console.log(err__);
              res.status(401).json({message: err_});
            }
            else {
              const quantityarray = Array(result_.length);
              for (let i = 0; i < result_.length; i++)
                quantityarray[i] = Array(result.length).fill(0)

              for (const i in result__){
                const found_index_i = result_.findIndex(x => x.username === result__[i].volunteer_id);
                const found_index_j = result.findIndex(x => x.id === result__[i].collection_id);
                quantityarray[found_index_i][found_index_j] = result__[i].quantity;
              }

              const total_result = {collections: result, volunteers: result_, quantities: quantityarray};
              res.send(JSON.stringify(total_result));
            }
          })
        }
      })
    }
  })
})

app.get('/receipt/donationInfo', (req, res) => {
    connection.query("select A.donation_id, C.affiliation, C.username, B.column_type, B.detail from donations A, donation_column B, users C where A.donation_id=B.donation_id and B.column_type in ('물품명', '가격', '수량') and A.is_new=? and A.company_id = C.username", [true],(err, result) => {
        if(err) throw err;
        result = convertFormReceipt(groupBy(result,(item) => [item.donation_id]));

        res.send(JSON.stringify(result));
    });
});




//
// Register API middleware
// -----------------------------------------------------------------------------
// require jwt authentication
app.use(
  '/graphql',
  expressJwt({
    secret: config.auth.jwt.secret,
    getToken: req => req.cookies.id_token,
  }),
  expressGraphQL(req => ({
    schema,
    graphiql: __DEV__,
    rootValue: { request: req },
    pretty: __DEV__,
  })),
);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const css = new Set();

    const fetch = createFetch(nodeFetch, {
      baseUrl: config.api.serverUrl,
      cookie: req.headers.cookie,
    });

    const initialState = {
      user: req.user || null,
    };

    const store = configureStore(initialState, {
      fetch,
    });

    if (req.user && req.user.login) {
      store.dispatch(
        receiveLogin({
          id_token: req.cookies.id_token,
          org_type: req.cookies.org_type,
          name: req.cookies.name,
          affiliation: req.cookies.affiliation
        }),
      );
    } else {
      store.dispatch(receiveLogout());
    }

    store.dispatch(
      setRuntimeVariable({
        name: 'initialNow',
        value: Date.now(),
      }),
    );

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      fetch,
      // You can access redux through react-redux connect
      store,
      storeSubscription: null,
    };

    // eslint-disable-next-line no-underscore-dangle
    css.add(theme._getCss());

    const data = {
      title: 'React Dashboard',
      description:
        'React Admin Starter project based on react-router 4, redux, graphql, bootstrap 4',
      keywords: 'react dashboard, react admin template, react dashboard open source, react starter, react admin, react themes, react dashboard template',
      author: 'Flatlogic LLC'
    };
    data.styles = [{ id: 'css', cssText: [...css].join('') }];
    data.scripts = [assets.vendor.js, assets.client.js];
    data.app = {
      apiUrl: config.api.clientUrl,
      state: context.store.getState(),
    };

    const html = ReactDOM.renderToString(
      <StaticRouter location={req.url} context={context}>
        <Provider store={store}>
          <App store={store} />
        </Provider>
      </StaticRouter>,
    );

    data.styles = [{ id: 'css', cssText: [...css].join('') }];

    data.children = html;

    const markup = ReactDOM.renderToString(<Html {...data} />);

    res.status(200);
    res.send(`<!doctype html>${markup}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res) => {
  // eslint-disable-line no-unused-vars
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
const promise = models.sync().catch(err => console.error(err.stack));
if (!module.hot) {
  promise.then(() => {
    app.listen(config.port, () => {
      console.info(`The server is running at http://localhost:${config.port}/`);
    });
  });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./components/App');
}

export default app;


function groupBy( array , f )
{
  const groups = {};
  array.forEach( ( o ) => {
    const group = JSON.stringify( f(o) );
    groups[group] = groups[group] || [];
    groups[group].push( o );
  });
  return Object.keys(groups).map( ( group ) => groups[group])
}

function convertFormDonation(array)
{
  const new_array = [];
  for (const i in array) {
    const dummy_dict = {}
    dummy_dict.donation_id = array[i][0].donation_id;
    for (const j in array[i]) {
      dummy_dict[array[i][j].column_type] = array[i][j].detail;
    }
    dummy_dict.inboxQuantity = 0
    new_array.push(dummy_dict)
  }
  return new_array;
}

function convertFormReceipt(array)
{
  let new_dict = {};
  for (const i in array) {
    const dummy_dict = {}
    for (const j in array[i]) {
      switch (array[i][j].column_type){
        case "물품명":
          dummy_dict['name'] = array[i][j].detail
          break
        case "가격":
          dummy_dict['price'] = array[i][j].detail
          break
        case "수량":
          dummy_dict['quantity'] = array[i][j].detail
          break
      }
    }
    dummy_dict['affiliation'] = array[i][0].affiliation
    dummy_dict['company_id'] = array[i][0].username
    new_dict[array[i][0].donation_id] = dummy_dict
  }
  return new_dict;
}



function convertFormCollection(array)
{
  const new_array = [];
  for (const i in array) {
    const dummy_dict = {};
    const dummy_array = [];
    dummy_dict.id = array[i][0].id;
    dummy_dict.collection_quantity = array[i][0].collection_quantity;
    dummy_dict.name = array[i][0].name;
    dummy_dict.expiration_date = array[i][0].expiration_date;
    for (const j in array[i]) {
      const dummy_donation_dict = {};
      dummy_donation_dict.donation_id =  array[i][j].donation_id;
      dummy_donation_dict.name = array[i][j].detail;
      dummy_donation_dict.quantity = array[i][j].quantity;
      dummy_dict.expiration_date = array[i][j].expiration_date;
      dummy_array.push(dummy_donation_dict);
    }
    dummy_dict.donations = dummy_array
    new_array.push(dummy_dict)
  }
  return new_array;
}
