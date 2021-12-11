import { useEffect } from 'react';

export default function useBodyLock(popupOpened: boolean | undefined) {
	useEffect(() => {
		const body = document.querySelector('body')!;

		if (popupOpened) body.classList.add('bodyLock');

		return () => {
			// Before removing lets see if there are other popups open.
			if (document.querySelectorAll('.rs-popup.show').length === 0) body.classList.remove('bodyLock');
		};
	}, [popupOpened]);
}
