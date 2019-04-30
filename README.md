## Description

This pilot project is for tracking donation boxes that have various in-kind donations, such as toothpaste, soap, and snack. 



## Quick Start

#### 1. Get the latest version

You can start by cloning the latest version of React Dashboard on your
local machine by running:

```shell
$ git clone -o react-dashboard -b master --single-branch \
      https://github.com/flatlogic/react-dashboard.git MyApp
$ cd MyApp
```

#### 2. Run `yarn install`

This will install both run-time project dependencies and developer tools listed
in [package.json](../package.json) file.

#### 3. Run `yarn start`

This command will build the app from the source files (`/src`) into the output
`/build` folder. As soon as the initial build completes, it will start the
Node.js server (`node build/server.js`) and [Browsersync](https://browsersync.io/)
with [HMR](https://webpack.github.io/docs/hot-module-replacement) on top of it.

> [http://localhost:3000/](http://localhost:3000/) — Node.js server (`build/server.js`)<br>
> [http://localhost:3000/graphql](http://localhost:3000/graphql) — GraphQL server and IDE<br>
> [http://localhost:3001/](http://localhost:3001/) — BrowserSync proxy with HMR, React Hot Transform<br>
> [http://localhost:3002/](http://localhost:3002/) — BrowserSync control panel (UI)

Now you can open your web app in a browser, on mobile devices and start
hacking. Whenever you modify any of the source files inside the `/src` folder,
the module bundler ([Webpack](http://webpack.github.io/)) will recompile the
app on the fly and refresh all the connected browsers.

For more info please refer to [getting started](./docs/getting-started.md) guide to download and run the project (Node.js >= 6.5)

## Support
For any additional information please refer to [Flatlogic homepage](https://flatlogic.com).

## How can I support developers?
- Star our GitHub repo :star:
- [Tweet about it](https://twitter.com/intent/tweet?text=Amazing%20dashboard%20built%20with%20NodeJS,%20React%20and%20Bootstrap!&url=https://github.com/flatlogic/react-dashboard&via=flatlogic).
- Create pull requests, submit bugs, suggest new features or documentation updates :wrench:
- Follow [@flatlogic on Twitter](https://twitter.com/flatlogic).
- Subscribe to Flatlogic newsletter at [flatlogic.com](https://flatlogic.com/)
- Like our page on [Facebook](https://www.facebook.com/flatlogic/) :thumbsup:

## Premium themes
Looking for premium themes and templates? Check out more [admin dashboard templates at flatlogic.com](https://flatlogic.com/admin-dashboards).

## License

[MIT](https://github.com/flatlogic/react-dashboard/blob/master/LICENSE.txt) and another [MIT](https://github.com/flatlogic/react-dashboard/blob/master/LICENSE-react-starter-kit.txt) from RSK.
