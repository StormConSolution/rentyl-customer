import HttpClient from '@bit/redsky.framework.rs.http';
import packageJson from '../../package.json';

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

const http = new HttpClient({
	baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost/api/v1' : packageJson.uri,
	//baseURL: process.env.NODE_ENV === 'development' ? 'http://192.168.1.115:3001/api/v1' : packageJson.uri,
	headers: {
		'company-id': `1`,
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': '*',
		Accept: 'application/json, text/plain, */*',
		'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT'
	}
});

export default http;
