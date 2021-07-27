import HttpClient from '@bit/redsky.framework.rs.http';
import packageJson from '../../package.json';
import { WebUtils } from './utils';

export enum HttpStatusCode {
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	METHOD_NOT_ALLOWED = 405,
	ALREADY_EXISTS = 409,
	CONFLICT = 409,
	VERSION_OUT_OF_DATE = 418, // Technically this is the I'm a teapot code that was a joke.
	SERVER_ERROR = 500,
	SERVICE_UNAVAILABLE = 503,
	NETWORK_CONNECT_TIMEOUT = 599
}

function getCompanyId() {
	let companyId: number;
	let urlParams = new URLSearchParams(window.location.search);
	let queryCompanyId = urlParams.get('company_id');
	if (queryCompanyId) {
		companyId = parseInt(queryCompanyId);
		sessionStorage['company_id'] = companyId;
	} else if (sessionStorage['company_id']) {
		companyId = parseInt(sessionStorage['company_id']);
	} else {
		console.error('Missing company ID when in localhost');
		throw new Error('Missing company ID when in localhost');
	}
	return companyId;
}

let headers: any = {
	'Content-Type': 'application/json',
	'Access-Control-Allow-Origin': '*',
	Accept: 'application/json, text/plain, */*',
	'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT'
};

if (WebUtils.isLocalHost()) headers['company-id'] = getCompanyId();

const http = new HttpClient({
	baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api/v1' : packageJson.uri,
	headers
});

export default http;
