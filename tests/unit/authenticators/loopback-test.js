import $ from 'jquery'
import Loopback from 'ember-simple-auth-loopback/authenticators/loopback';
import sinon from 'sinon';
import { module } from 'qunit';
import { run } from '@ember/runloop';
import { test } from 'ember-qunit';

let subject;
const email = 'foo@bar.com';
const password = 'foobar';
const url = '/User/login';

module('Loopback Authenticator', {
  beforeEach: () => {
    subject = Loopback.create();
    sinon.spy($, 'ajax');
  },
  afterEach: () => {
    $.ajax.restore();
  }
});

test('#restore resolves with the correct data', assert => {
  const data = { id: 'foo'};

  run(() => {
    subject.restore(data).then(content => {
      assert.deepEqual(content, data);
    });
  });
});

test('#authenticate sends an AJAX request to the login endpoint', assert => {
  subject.authenticate(email, password);

  run(() => {
    var args = $.ajax.getCall(0).args[0];

    delete args.beforeSend;

    assert.deepEqual(args, {
      contentType: 'application/json',
      data: '{"email":"foo@bar.com","password":"foobar"}',
      dataType: 'json',
      type: 'POST',
      url
    });
  });
});

test('#invalidate returns a resolving promise', assert => {
  subject.invalidate().then(() => {
    assert.ok(true);
  });
});
