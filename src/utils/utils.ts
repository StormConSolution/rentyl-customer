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
	let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

	if (match) {
		return `(${match[1]}) ${match[2]}-${match[3]}`;
	} else {
		return cleaned;
	}
}

export function validateEmail(mail: string) {
	return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail);
}

export function capitalize(s: string) {
	return s.toLowerCase().replace(/\b./g, function (a) {
		return a.toUpperCase();
	});
}
