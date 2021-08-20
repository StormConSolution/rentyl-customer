import {
	StringUtils as BaseStringUtils,
	ObjectUtils as BaseObjectUtils,
	RegionUtils as BaseRegionUtils,
	WebUtils as BaseWebUtils,
	DateUtils as BaseDateUtils
} from '@bit/redsky.framework.rs.utils';
import moment from 'moment';

class StringUtils extends BaseStringUtils {}

class ObjectUtils extends BaseObjectUtils {}

class RegionUtils extends BaseRegionUtils {}

class WebUtils extends BaseWebUtils {
	static convertDataForUrlParams(data: any): any {
		let convertedData: any = {};
		for (let i in data) {
			if (typeof data[i] === 'object') {
				convertedData[i] = JSON.stringify(data[i]);
			} else {
				convertedData[i] = data[i];
			}
		}
		return convertedData;
	}

	/**
	 * Checks to see if browser is pointed to localhost
	 * @returns true if in localhost otherwise false
	 */
	static isLocalHost(): boolean {
		return window.location.host.includes('localhost');
	}
}

class DateUtils extends BaseDateUtils {
	static displayUserDate(date: string | Date): string {
		let dateToReturn = new Date(date);
		let timeZoneOffset = dateToReturn.getTimezoneOffset() * 60000;
		dateToReturn.setTime(dateToReturn.getTime() + timeZoneOffset);
		return dateToReturn.toDateString();
	}

	static daysBetween(date1: string | Date, date2: string | Date) {
		return Math.abs(new Date(date1).getTime() - new Date(date2).getTime()) / (3600000 * 24);
	}
}

class MiscUtils {
	static convertCentsToPoints(cents: number, ratio: number): number {
		return Math.floor((cents / 100) * ratio);
	}

	static roundPointsToThousand(num: number): number {
		return Math.ceil(num / 1000) * 1000;
	}

	static displayPointsOrCash(cents: number, type: 'points' | 'cash'): string {
		switch (type) {
			case 'points':
				return addCommasToNumber(MiscUtils.convertCentsToPoints(cents, 10)) + ' points';
				break;
			case 'cash':
				return '$' + StringUtils.formatMoney(cents);
				break;
			default:
				return '';
		}
	}
}

export { StringUtils, ObjectUtils, RegionUtils, WebUtils, DateUtils, MiscUtils };

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

export function formatDateForUser(date: string | Date) {
	if (date === 'N/A') return date;
	let newDate = new Date(`${date}`);
	return `${(newDate.getMonth() + 1).toString()}-${newDate.getDay()}-${newDate.getFullYear()}`;
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

export function addCommasToNumber(intNum: any) {
	if (isNaN(intNum)) return intNum;
	return (intNum + '').replace(/(\d)(?=(\d{3})+$)/g, '$1,');
}

export function formatPhoneNumber(phone: string | number) {
	let cleaned = ('' + phone).replace(/\D/g, '');
	let match: any;
	if (cleaned.length <= 10) {
		match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
		if (match) {
			return `(${match[1]}) ${match[2]}-${match[3]}`;
		}
	} else {
		match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
		if (match) {
			return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
		}
	}
	return cleaned;
}

export function removeAllExceptNumbers(string: string): string {
	if (!string) return '';
	return string.replace(/\D+/g, '');
}

export function validateEmail(mail: string) {
	return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail);
}

export function removeExtraSpacesReturnsTabs(string: string) {
	let strippedString = string.replace(/\r?\n|\t|\r/g, ' ').match(/[^ ]+/g);
	if (strippedString) return strippedString.join(' ');
	else return '';
}

export function capitalize(s: string) {
	return s.toLowerCase().replace(/\b./g, function (a) {
		return a.toUpperCase();
	});
}

export function convertTwentyFourHourTime(time: string | number): string {
	if (!time) return '';

	let sanitizedTime: number = parseInt(removeAllExceptNumbers(time.toString()));
	if (sanitizedTime > 1259) {
		sanitizedTime = sanitizedTime - 1200;
		if (sanitizedTime.toString().length === 3) {
			let minutes = sanitizedTime.toString().slice(-2);
			let hour = sanitizedTime.toString().slice(0, 1);
			return `${hour}:${minutes} PM`;
		} else if (sanitizedTime.toString().length === 4) {
			let minutes = sanitizedTime.toString().slice(-2);
			let hours = sanitizedTime.toString().slice(0, 2);
			return `${hours}:${minutes} PM`;
		} else {
			return '';
		}
	}
	if (sanitizedTime.toString().length === 3) {
		let minutes = sanitizedTime.toString().slice(-2);
		let hour = sanitizedTime.toString().slice(0, 1);
		return `${hour}:${minutes} AM`;
	} else if (sanitizedTime.toString().length === 4) {
		let minutes = sanitizedTime.toString().slice(-2);
		let hours = sanitizedTime.toString().slice(0, 2);
		return `${hours}:${minutes} ${hours === '12' ? 'PM' : 'AM'}`;
	} else {
		return '';
	}
}
