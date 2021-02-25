export function formatDateTime(dateTime: string | Date) {
	if (dateTime === 'N/A') return dateTime;
	let newDateTime = new Date(`${dateTime}`);
	let DateTimeArray = newDateTime.toString().split(' ');
	return `${DateTimeArray[1]} ${DateTimeArray[2]}, ${DateTimeArray[3]} ${newDateTime.toLocaleTimeString()}`;
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
