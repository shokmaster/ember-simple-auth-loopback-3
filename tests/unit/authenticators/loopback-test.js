import $ from 'jquery';
import Loopback from 'ember-simple-auth-loopback-3/authenticators/loopback';
import sinon from 'sinon';
import { module, test } from 'qunit';
import { run } from '@ember/runloop';
import { setupTest } from 'ember-qunit';

let subject;
const email = 'foo@bar.com';
const password = 'foobar';
const url = '/User/login';

const fakeMakeRequestResolve = {
	makeRequest(loginEndpoint, identificationDataReceived) {
		return Promise.resolve(identificationDataReceived);
	}
};
const fakeMakeRequestReject = {
	makeRequest() {
		return Promise.reject({ responseJSON: '{}' });
	}
};
const fakeMakeRequestReject2 = {
	makeRequest() {
		return Promise.reject({ responseText: '{}' });
	}
};

module('Unit | Authenticator | loopback', (hooks) => {
	setupTest(hooks);

	hooks.beforeEach(() => {
		subject = Loopback.create();

		sinon.spy($, 'ajax');
	});

	hooks.afterEach(() => {
		$.ajax.restore();
	});

	test('#restore resolves with the correct data', (assert) => {
		const data = { id: 'foo' };

		subject.restore(data).then((content) => {
			assert.deepEqual(content, data);
		});
	});

	test('#restore rejects with empty data', (assert) => {
		const data = {};

		subject.restore(data).catch(() => {
			assert.ok(true, 'promise rejected');
		});
	});

	test('#invalidate returns a resolving promise when a logoutEndpoint is not setted', (assert) => {
		subject.invalidate().then(() => {
			assert.ok(true);
		});
	});

	test('#invalidate returns a resolving promise when a logoutEndpoint is setted', (assert) => {
		subject.set('logoutEndpoint', '/logout');

		subject.invalidate().then(() => {
			assert.ok(true);
		});
	});

	test('#invalidate returns a resolving promise when logoutEndpoint and token are setted', (assert) => {
		subject.set('logoutEndpoint', '/logout');

		subject.invalidate({ id: 'fooBarToken' }).then(() => {
			assert.ok(true);
		});
	});

	test('#authenticate calls `makeRequest` with email/password', async(assert) => {
		const authenticator = Loopback.extend(fakeMakeRequestResolve).create();

		const result = await authenticator.authenticate(email, password);

		assert.deepEqual(result, { email, password }, 'makes the request with email and password');
	});

	test('#authenticate rejects the error of `responseJSON` if authentication fails', (assert) => {
		assert.expect(1);

		const done = assert.async();
		const authenticator = Loopback.extend(fakeMakeRequestReject).create();

		authenticator.authenticate(email, password).catch((error) => {
			assert.equal(error, '{}', 'rejects the content of `responseJSON` field');
			done();
		});
	});

	test('#authenticate rejects the error of `responseText` if authentication fails', (assert) => {
		assert.expect(1);

		const done = assert.async();
		const authenticator = Loopback.extend(fakeMakeRequestReject2).create();

		authenticator.authenticate(email, password).catch((error) => {
			assert.equal(error, '{}', 'rejects the content of `responseText` field');
			done();
		});
	});

	test('#authenticate sends an AJAX request to the login endpoint', (assert) => {
		subject.authenticate(email, password);

		run(() => {
			const args = $.ajax.getCall(0).args[0];

			delete args.beforeSend;

			assert.deepEqual(args, {
				contentType: 'application/json',
				data: `{"email":"${email}","password":"${password}"}`,
				dataType: 'json',
				type: 'POST',
				url
			});
		});
	});
});
