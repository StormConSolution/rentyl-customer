import {
	StringUtils as BaseStringUtils,
	ObjectUtils as BaseObjectUtils,
	RegionUtils as BaseRegionUtils,
	WebUtils as BaseWebUtils,
	DateUtils as BaseDateUtils,
	NumberUtils as BaseNumberUtils
} from '@bit/redsky.framework.rs.utils';
import moment from 'moment';

import router from './router';
import globalState, { getRecoilExternalValue } from '../state/globalState';

class StringUtils extends BaseStringUtils {
	static formatCountryCodePhoneNumber(phone: string) {
		let cleaned = ('' + phone).replace(/\D/g, '');
		let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
		if (match) {
			let intlCode = match[1] ? '+1 ' : '';
			return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
		}
	}

	static setAddPackagesParams(data: {
		destinationId: number;
		newRoom: Misc.StayParams;
		stays?: Misc.StayParams[];
	}): string {
		return JSON.stringify(data);
	}

	static setCheckoutParams(data: { destinationId: number; stays: Misc.StayParams[] }): string {
		return `destinationId=${data.destinationId}&stays=${JSON.stringify(data.stays)}`;
	}

	static getCheckoutParms() {
		const params = router.getPageUrlParams<{ destinationId: number; stays: Misc.StayParams[] }>([
			{ key: 'destinationId', default: 0, type: 'integer', alias: 'destinationId' },
			{ key: 'stays', default: '', type: 'string', alias: 'stays' }
		]);
		params.stays = ObjectUtils.smartParse(params.stays);
	}

	static buildAddressString(address: {
		address1?: string;
		address2?: string;
		city?: string;
		state?: string;
		zip?: string;
	}): string {
		let addressToBuild = '';
		if (address.address1) {
			addressToBuild += `${address.address1}`;
			if (!address.address2 && (address.city || address.state || address.zip)) {
				addressToBuild += `, `;
			}
		}

		if (address.address2) {
			if (address.address1) addressToBuild += ` `;
			addressToBuild += `${address.address2}`;
			if (address.city || address.state || address.zip) {
				addressToBuild += `, `;
			}
		}

		if (address.city) {
			addressToBuild += `${address.city}`;
			if (address.state || address.zip) {
				addressToBuild += `, `;
			}
		}

		if (address.state) {
			addressToBuild += `${address.state} `;
		}

		if (address.zip) {
			addressToBuild += ` ${address.zip}`;
		}

		return addressToBuild;
	}
}

class ObjectUtils extends BaseObjectUtils {
	static areArraysEqual(array1: number[], array2: number[]): boolean {
		if (array1 === array2) return true;
		if (array1 == null || array2 == null) return false;
		if (array1.length !== array2.length) return false;

		for (let i = 0; i < array1.length; ++i) {
			if (array1[i] !== array2[i]) return false;
		}
		return true;
	}
}

class RegionUtils extends BaseRegionUtils {}

class WebUtils extends BaseWebUtils {
	/**
	 * Checks to see if browser is pointed to localhost
	 * @returns true if in localhost otherwise false
	 */
	static isLocalHost(): boolean {
		return window.location.host.includes('localhost');
	}

	static parseURLParamsToFilters(): Misc.ReservationFilters {
		const urlParams = new URLSearchParams(window.location.search);
		let startDate = urlParams.get('startDate')
			? urlParams.get('startDate')!
			: moment(new Date()).add(14, 'days').format('YYYY-MM-DD');
		let endDate = urlParams.get('endDate')
			? urlParams.get('endDate')!
			: moment(startDate).add(2, 'days').format('YYYY-MM-DD');

		let sortOrder = urlParams.get('sortOrder') ? urlParams.get('sortOrder')! : 'ASC';

		let reservationFilter: Misc.ReservationFilters = {
			accommodationId: urlParams.get('ai') ? parseInt(urlParams.get('ai')!) : undefined,
			adultCount: urlParams.get('adultCount') ? parseInt(urlParams.get('adultCount')!) : 1,
			bathroomCount: urlParams.get('bathroomCount') ? parseInt(urlParams.get('bathroomCount')!) : 1,
			bedroomCount: urlParams.get('bedroomCount') ? parseInt(urlParams.get('bedroomCount')!) : 1,
			childCount: 0,
			destinationId: urlParams.get('destinationId') ? parseInt(urlParams.get('destinationId')!) : undefined,
			amenityIds: urlParams.get('amenityIds') ? JSON.parse(urlParams.get('amenityIds')!) : undefined,
			pagination: { page: 1, perPage: 10 },
			priceRangeMax: urlParams.get('priceRangeMax') ? parseInt(urlParams.get('priceRangeMax')!) : 1000,
			priceRangeMin: urlParams.get('priceRangeMin') ? parseInt(urlParams.get('priceRangeMin')!) : 1,
			propertyTypeIds: urlParams.get('propertyTypeIds')
				? JSON.parse(urlParams.get('propertyTypeIds')!)
				: undefined,
			redeemPoints: !!urlParams.get('redeemPoints'),
			regionIds: urlParams.get('regionIds') ? JSON.parse(urlParams.get('regionIds')!) : undefined,
			experienceIds: urlParams.get('experienceIds') ? JSON.parse(urlParams.get('experienceIds')!) : undefined,
			startDate,
			endDate,
			sortOrder: sortOrder === 'ASC' || sortOrder === 'DESC' ? sortOrder : 'ASC'
		};
		return reservationFilter;
	}

	static updateUrlParams(reservationFilters: Misc.ReservationFilters): string {
		let stringBuilder: string[] = [];
		if (reservationFilters.accommodationId) {
			stringBuilder.push(`ai=${reservationFilters.accommodationId}`);
		}
		if (reservationFilters.destinationId) {
			stringBuilder.push(`di=${reservationFilters.destinationId}`);
		}
		if (reservationFilters.startDate) {
			stringBuilder.push(`startDate=${reservationFilters.startDate}`);
		}
		if (reservationFilters.endDate) {
			stringBuilder.push(`endDate=${reservationFilters.endDate}`);
		}
		if (reservationFilters.bathroomCount) stringBuilder.push(`bathroomCount=${reservationFilters.bathroomCount}`);
		if (reservationFilters.bedroomCount) stringBuilder.push(`bedroomCount=${reservationFilters.bedroomCount}`);
		if (reservationFilters.amenityIds)
			stringBuilder.push(`amenityIds=${JSON.stringify(reservationFilters.amenityIds)}`);
		if (reservationFilters.redeemPoints) stringBuilder.push(`redeemPoints=${reservationFilters.redeemPoints}`);
		if (reservationFilters.regionIds)
			stringBuilder.push(`regionIds=${JSON.stringify(reservationFilters.regionIds)}`);
		if (reservationFilters.experienceIds)
			stringBuilder.push(`experienceIds=${JSON.stringify(reservationFilters.experienceIds)}`);
		if (reservationFilters.sortOrder) stringBuilder.push(`sortOrder=${reservationFilters.sortOrder}`);
		if (reservationFilters.adultCount) stringBuilder.push(`adultCount=${reservationFilters.adultCount}`);
		if (reservationFilters.propertyTypeIds)
			stringBuilder.push(`propertyTypeIds=${JSON.stringify(reservationFilters.propertyTypeIds)}`);

		let builtString = stringBuilder.join('&');
		window.history.replaceState(null, '', '?' + builtString);
		return '?' + builtString;
	}
	/**
	 * Takes parameters and creates a pageQuery object
	 * @param page - must be a number
	 * @param perPage - must be a number
	 * @param sortOrder - one of a specific list of strings
	 * @param sortField - any string to sort on
	 * @param matchType - a list of specific strings
	 * @param filter - an array of column and value objects
	 */
	static createPageQueryObject(
		page: number = 1,
		perPage: number = 100,
		sortOrder: RedSky.StandardOrderTypes = 'ASC',
		sortField: string = 'name',
		matchType: RedSky.MatchTypes = 'like',
		filter: RedSky.FilterQueryValue[] = [{ column: 'name', value: '' }]
	): RedSky.PageQuery {
		return {
			pagination: { page, perPage },
			sort: { field: sortField, order: sortOrder },
			filter: { matchType, searchTerm: filter }
		};
	}

	/**
	 * Checks an thrown error object from an axios request for the standard RedSky Error Message
	 * @param error - Error object thrown via axios
	 * @param defaultMessage - A message to use incase there wasn't one given
	 * @returns The msg from the RsError object or the defaultMessage passed in
	 */
	static getRsErrorMessage(error: any, defaultMessage: string): string {
		let errorResponse = ObjectUtils.smartParse(WebUtils.getAxiosErrorMessage(error));
		if (typeof errorResponse !== 'object') return errorResponse;
		if ('msg' in errorResponse) return errorResponse.msg;
		else if ('err' in errorResponse) return errorResponse.err;
		return defaultMessage;
	}
}

class DateUtils extends BaseDateUtils {
	static displayUserDate(date: Date | string, formatType?: string): string {
		let dateToReturn = new Date(date);
		let timeZoneOffset = dateToReturn.getTimezoneOffset() * 60000;
		dateToReturn.setTime(dateToReturn.getTime() + timeZoneOffset);
		return this.formatDate(dateToReturn, formatType);
	}

	static formatDate(date: Date, formatType?: string): string {
		if (formatType === 'MM/DD/YYYY') {
			return (
				('0' + (date.getMonth() + 1)).slice(-2) +
				'/' +
				('0' + date.getDate()).slice(-2) +
				'/' +
				date.getFullYear()
			);
		} else {
			return date.toDateString();
		}
	}
}

class NumberUtils extends BaseNumberUtils {}

export { StringUtils, ObjectUtils, RegionUtils, WebUtils, DateUtils, NumberUtils };

export function formatDateTime(dateTime: string | Date) {
	if (dateTime === 'N/A') return dateTime;
	let newDateTime = new Date(`${dateTime}`);
	let DateTimeArray = newDateTime.toString().split(' ');
	return `${DateTimeArray[1]} ${DateTimeArray[2]}, ${DateTimeArray[3]} ${newDateTime.toLocaleTimeString()}`;
}

export function formatReadableDate(date: string) {
	let match = formatDate(date);
	if (match) {
		return `${match[1]}/${match[2]}/${match[3]}`;
	} else {
		return date;
	}
}

export function formatFilterDateForServer(date: moment.Moment | null, startOrEnd: 'start' | 'end'): string {
	if (date) {
		return date.format('YYYY-MM-DD');
	} else {
		if (startOrEnd === 'end') return moment().add(1, 'day').format('YYYY-MM-DD');
		else return moment().format('YYYY-MM-DD');
	}
}

export function formatDateForServer(date: string) {
	let match = formatDate(date);
	if (match) {
		return `${match[3]}-${match[1]}-${match[2]}`;
	} else {
		return date;
	}
}

function formatDate(date: string) {
	if (date === 'N/A') return date;
	let cleaned = ('' + date).replace(/\D/g, '');
	if (cleaned.length === 7) cleaned = '0' + cleaned;
	return cleaned.match(/^(\d{2})(\d{2})(\d{4})$/);
}

export function isRouteUnauthorized(route: string): boolean {
	const company = getRecoilExternalValue<Api.Company.Res.GetCompanyAndClientVariables | undefined>(
		globalState.company
	);
	if (!company) return true;
	let isUnauthorized = company.unauthorizedPages.find((item) => item.route === route);

	return !!isUnauthorized;
}
