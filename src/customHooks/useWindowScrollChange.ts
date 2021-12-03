/**
 * This hook will return either "UP" or "DOWN" depending on which direction you are scrolling.
 */

import { useState } from 'react';
import debounce from 'lodash.debounce';

const SCROLL_FROM_TOP_BUFFER = 80;

export default function useWindowScrollChange() {
	const [screenScrollDirection, setScreenScrollDirection] = useState<'UP' | 'DOWN'>();

	let prevScrollPosition = window.pageYOffset;

	let scrollDebounce = debounce(async () => {
		let currentScrollPos = window.pageYOffset;
		if (currentScrollPos < SCROLL_FROM_TOP_BUFFER) {
			setScreenScrollDirection('UP');
		} else if (prevScrollPosition + 5 < currentScrollPos) {
			setScreenScrollDirection('DOWN');
		}
		prevScrollPosition = currentScrollPos;
	}, 10);

	window.addEventListener('scroll', scrollDebounce);
	return screenScrollDirection;
}
