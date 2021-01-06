import React, { PropsWithChildren } from 'react';
import { getSpacingProperties, spacingKeys } from './spacing';

export interface BoxProps {
	className?: string;
	onClick?: () => void;

	// Spacing props
	m?: string | number;
	mt?: string | number;
	mr?: string | number;
	mb?: string | number;
	ml?: string | number;
	mx?: string | number;
	my?: string | number;
	p?: string | number;
	pt?: string | number;
	pr?: string | number;
	pb?: string | number;
	pl?: string | number;
	px?: string | number;
	py?: string | number;
	margin?: string | number;
	marginTop?: string | number;
	marginRight?: string | number;
	marginBottom?: string | number;
	marginLeft?: string | number;
	marginX?: string | number;
	marginY?: string | number;
	padding?: string | number;
	paddingTop?: string | number;
	paddingRight?: string | number;
	paddingBottom?: string | number;
	paddingLeft?: string | number;
	paddingX?: string | number;
	paddingY?: string | number;

	// Display properties
	display?: string;
	//displayPrint?: string;
	//displayRaw?: string;
	overflow?: string;
	textOverflow?: 'clip' | 'ellipsis' | string | 'initial' | 'inherit';
	visibility?: 'visible' | 'hidden' | 'collapse' | 'initial' | 'inherit';
	whiteSpace?: string;

	// Border properties
	border?: string | number;
	borderTop?: string | number;
	borderLeft?: string | number;
	borderRight?: string | number;
	borderBottom?: string | number;
	borderColor?: string;
	borderRadius?: string | number;

	// Flex properties
	flexDirection?: string;
	flexWrap?: string;
	justifyContent?: string;
	alignItems?: string;
	alignContent?: string;
	order?: string;
	flex?: string;
	flexGrow?: string | number;
	flexShrink?: string | number;
	alignSelf?: string | number;

	// Palette properties
	color?: string;
	bgcolor?: string;
}

// Eventually move these transformation functions into a flexible system like material-ui
// See https://github.com/mui-org/material-ui/tree/next/packages/material-ui-system/src
function getBorder(value: string | number) {
	if (typeof value !== 'number') {
		return value;
	}

	return `${value}px solid`;
}

function transformProps(props: PropsWithChildren<BoxProps>): PropsWithChildren<BoxProps> {
	let filtered: any = {};
	let i: keyof typeof props;
	for (i in props) {
		if (i === 'm') {
			filtered['margin'] = props[i];
		} else if (i === 'p') {
			filtered['padding'] = props[i];
		} else if (i === 'border') {
			filtered[i] = getBorder(props[i] as string | number);
		} else if (spacingKeys.includes(i)) {
			let stylePropNames = getSpacingProperties(i);
			for (let propName of stylePropNames) {
				filtered[propName] = props[i];
			}
		} else if (i === 'bgcolor') {
			filtered['backgroundColor'] = props[i];
		} else {
			filtered[i] = props[i];
		}
	}

	return filtered;
}

const Box: React.FC<BoxProps> = (props) => {
	// Based on prop value we might perform some transformations (i.e. m = margin, etc.)
	const { className, onClick, ...other } = props;

	let output = transformProps(other);
	const adjustedClassName = className ? `rsBox ${className}` : 'rsBox';

	return (
		<div className={adjustedClassName} style={output} onClick={props.onClick}>
			{props.children}
		</div>
	);
};

export default Box;
