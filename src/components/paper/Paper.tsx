import * as React from 'react';
import './Paper.scss';

interface PaperProps {
	backgroundColor?: string;
	padding?: string;
	borderRadius?: string;
	boxShadow?: boolean;
	width?: string;
	height?: string;
	position?: 'static' | 'relative' | 'absolute' | 'sticky' | 'fixed';
	className?: string;
}

const Paper: React.FC<PaperProps> = (props) => {
	function renderStyles() {
		let styles: any = {};
		if (props.padding) styles.padding = props.padding;
		if (props.backgroundColor) styles.backgroundColor = props.backgroundColor;
		if (props.borderRadius) styles.borderRadius = props.borderRadius;
		if (props.boxShadow) styles.boxShadow = '0px 5px 15px #1e180b33';
		if (props.width) styles.width = props.width;
		if (props.height) styles.height = props.height;
		if (props.position) styles.position = props.position;
		return styles;
	}

	return (
		<div className={!!props.className ? `${props.className} rsPaper` : 'rsPaper'} style={renderStyles()}>
			{props.children}
		</div>
	);
};

export default Paper;
