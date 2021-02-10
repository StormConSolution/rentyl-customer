import { useEffect, useState } from 'react';

const MobileAndDown = 599;
const TabletPortrait = 600;
const TabletLandscape = 900;
const desktopAndUp = 1160;

export default function useWindowResizeChange() {
	const [screenSize, setScreenSize] = useState<string>('');
	useEffect(() => {
		window.addEventListener('resize', function (event) {
			const screen = event.target as Window;
			renderSize(screen.innerWidth);
		});
		function renderSize(screen: number) {
			if (screen <= MobileAndDown) setScreenSize('small');
			else if (screen <= TabletPortrait) setScreenSize('medSmall');
			else if (screen <= TabletLandscape) setScreenSize('medium');
			else if (screen >= desktopAndUp) setScreenSize('');
		}
		renderSize(window.innerWidth);
	}, []);

	return screenSize;
}
