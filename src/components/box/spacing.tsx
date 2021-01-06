const properties = {
	m: 'margin',
	p: 'padding'
};

const directions = {
	t: 'Top',
	r: 'Right',
	b: 'Bottom',
	l: 'Left',
	x: ['Left', 'Right'],
	y: ['Top', 'Bottom']
};

const aliases = {
	marginX: 'mx',
	marginY: 'my',
	paddingX: 'px',
	paddingY: 'py'
};

export const getSpacingProperties = (prop: string) => {
	// It's not a shorthand notation.
	if (prop.length > 2) {
		// @ts-ignore
		if (aliases[prop]) {
			// @ts-ignore
			prop = aliases[prop];
		} else {
			return [prop];
		}
	}

	const [a, b] = prop.split('');
	// @ts-ignore
	const property = properties[a];
	// @ts-ignore
	const direction = directions[b] || '';
	return Array.isArray(direction) ? direction.map((dir) => property + dir) : [property + direction];
};

export const spacingKeys = [
	'm',
	'mt',
	'mr',
	'mb',
	'ml',
	'mx',
	'my',
	'p',
	'pt',
	'pr',
	'pb',
	'pl',
	'px',
	'py',
	'margin',
	'marginTop',
	'marginRight',
	'marginBottom',
	'marginLeft',
	'marginX',
	'marginY',
	'padding',
	'paddingTop',
	'paddingRight',
	'paddingBottom',
	'paddingLeft',
	'paddingX',
	'paddingY'
];
