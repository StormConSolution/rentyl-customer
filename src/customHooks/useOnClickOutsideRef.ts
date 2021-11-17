import { useEffect, useRef } from 'react';

export default function useOnClickOutsideRef(callback: any, initialValue = null) {
	const elementRef = useRef<HTMLElement>(initialValue);
	useEffect(() => {
		function handler(event: any) {
			if (!elementRef.current?.contains(event.target)) {
				callback();
			}
		}
		window.addEventListener('click', handler);
		return () => window.removeEventListener('click', handler);
	}, [callback]);
	return elementRef;
}
