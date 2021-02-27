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
		let formattedDate = `${match[3]}-${match[2]}-${match[1]}`;
		return new Date(formattedDate);
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
export function replaceClassName(elementClassName: string, initialValue: string, replacedValue: string) {
	let listOfElements = document.querySelectorAll(elementClassName);
	for (let i = 0; i < listOfElements.length; i++) {
		listOfElements[i].classList.remove(initialValue);
		listOfElements[i].classList.add(replacedValue);
	}
	return true;
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
