
# ember-simple-auth-loopback-3

[![Build Status](https://travis-ci.org/shokmaster/ember-simple-auth-loopback-3.svg?branch=master)](https://travis-ci.org/shokmaster/ember-simple-auth-loopback-3)
[![GitHub version](https://badge.fury.io/gh/shokmaster%2Fember-simple-auth-loopback-3.svg)](https://badge.fury.io/gh/shokmaster%2Fember-simple-auth-loopback-3)
[![NPM version](https://badge.fury.io/js/ember-simple-auth-loopback-3.svg)](https://badge.fury.io/js/ember-simple-auth-loopback-3)
[![Dependency Status](https://david-dm.org/shokmaster/ember-simple-auth-loopback-3.svg)](https://david-dm.org/shokmaster/ember-simple-auth-loopback-3)
[![codecov](https://codecov.io/gh/shokmaster/ember-simple-auth-loopback-3/branch/master/graph/badge.svg)](https://codecov.io/gh/shokmaster/ember-simple-auth-loopback-3)
[![Ember Observer Score](https://emberobserver.com/badges/ember-simple-auth-loopback-3.svg)](https://emberobserver.com/addons/ember-simple-auth-loopback-3)

## Information

[![NPM](https://nodei.co/npm/ember-simple-auth-loopback-3.png?downloads=true&downloadRank=true)](https://nodei.co/npm/ember-simple-auth-loopback-3/) [![Greenkeeper badge](https://badges.greenkeeper.io/shokmaster/ember-simple-auth-loopback-3.svg)](https://greenkeeper.io/)

This package allows integration with the default authorization tokens used with Strongloop's Loopback servers.

---

This project is an updated fork of the original rtablada's [ember-simple-auth-loopback](https://github.com/rtablada/ember-simple-auth-loopback) package.

## Installation

```
ember install ember-simple-auth ember-simple-auth-loopback-3
```

## Use

This addon provides an authenticator to login users and store their session.

First create an `authenticators/application.js` file with the following:

```js
import Loopback from 'ember-simple-auth-loopback-3/authenticators/loopback';

export default Loopback.extend({
  loginEndpoint: 'http://0.0.0.0:3000/api/Users/login',
});
```

Then use this from a controller (or route):

```js
session: Ember.inject.service(),

login(email, password) {
  this.get('session').authenticate('authenticator:application', email, password)
    .catch((reason) => {
      console.log(reason);
    });
}
```

And, in the template:

```htmlbars
<form {{action login email password}}>
  <p>
    <label>Email</label>
    {{input value=email}}
  </p>

  <p>
    <label>Password</label>
    {{input value=password type="password"}}
  </p>

  <button>Submit</button>
</form>
```

## Authorizing API Requests

Once logged in, API requests will need to be authorized using the token sent back from the login request.
To do this, first setup an `app/authorizers/application.js`:

```js
import Loopback from 'ember-simple-auth-loopback-3/authorizers/loopback';

export default Loopback.extend();
```

Then, in the `app/adapters/application.js`, use the `DataAdapterMixin` from `ember-simple-auth`:

```js
import JSONAPIAdapter from 'ember-data/adapters/json-api';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default JSONAPIAdapter.extend(DataAdapterMixin, {
  authorizer: 'authorizer:application',

  host: 'http://localhost:3000',
  namespace: 'api',
});
```

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
