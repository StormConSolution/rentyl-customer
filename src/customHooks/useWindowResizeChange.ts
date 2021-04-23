import { useEffect, useState } from 'react';
const MobileAndDown = 1280;
export default function useWindowResizeChange() {
	const [screenSize, setScreenSize] = useState<string>('');
	useEffect(() => {
		window.addEventListener('resize', onResize);
		function onResize(event: UIEvent) {
			const screen = event.target as Window;
			renderSize(screen.innerWidth);
		}
		function renderSize(screen: number) {
			if (screen <= MobileAndDown) setScreenSize('small');
			else setScreenSize('');
		}
		renderSize(window.innerWidth);
		return () => {
			window.removeEventListener('resize', onResize);
		};
	}, []);
	return screenSize;
}
