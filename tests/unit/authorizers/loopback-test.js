import Loopback from 'ember-simple-auth-loopback-3/authorizers/loopback';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

let subject;

module('Unit | Authorizer | loopback', (hooks) => {
	setupTest(hooks);

	hooks.beforeEach(() => {
		subject = Loopback.create();
	});

	test('it extracts the access token from `id` and calls the given function', (assert) => {
		const data = { id: 'foo' };

		const fn = (token) => assert.ok(token);

		subject.authorize(data, fn);
	});

	test('it extracts the access token from `code` and calls the given function', (assert) => {
		const data = { code: 'foo' };

		const fn = (token) => assert.ok(token);

		subject.authorize(data, fn);
	});

	test('it extracts the access token from `access_token` and calls the given function', (assert) => {
		const data = { access_token: 'foo' };

		const fn = (token) => assert.ok(token);

		subject.authorize(data, fn);
	});

	test('it does not call the given function if no access token is passed', (assert) => {
		assert.expect(1);

		const data = {};
		const _fn = {
			fn: (token) => assert.ok(token)
		};

		sinon.spy(_fn, 'fn');

		subject.authorize(data, _fn.fn);

		const noCalled = _fn.fn.getCalls().length === 0;

		_fn.fn.restore();

		assert.ok(noCalled);
	});
});
