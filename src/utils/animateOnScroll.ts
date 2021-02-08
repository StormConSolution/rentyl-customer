export function animateOnScroll() {
	window.addEventListener(
		'scroll',
		() => {
			loop();
		},
		false
	);

	function loop() {
		let elementsToShow = document.querySelectorAll('.show-on-scroll');
		elementsToShow.forEach(function (element) {
			if (isInViewport(element)) {
				element.classList.add('is-visible');
			} else {
				element.classList.remove('is-visible');
			}
		});
		console.count('Looped');
	}

	function isInViewport(element: any) {
		const rect = element.getBoundingClientRect();
		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		);
	}
}
