import React from 'react';
import './MinMaxDestinationDetailsBar.scss';
import Label from '@bit/redsky.framework.rs.label';

interface MinMaxDestinationDetailsBarProps {
	minBed: number;
	maxBed: number;
	minBath: number;
	maxBath: number;
	minArea: number;
	maxArea: number;
	className?: string;
}

const MinMaxDestinationDetailsBar: React.FC<MinMaxDestinationDetailsBarProps> = (props) => {
	const { minBed, maxBed, minBath, maxBath, minArea, maxArea } = props;

	function renderMinMaxLabels(min: number, max: number) {
		if (min === max) return min;
		if (min === 0) return `1-${max}`;
		return `${min}-${max}`;
	}

	return (
		<div className={`rsMinMaxDestinationDetailsBar ${props.className || ''}`}>
			<Label variant={'destinationDetailsCustomTwo'}>{renderMinMaxLabels(minBed, maxBed)} Bed</Label>
			<div className={'separator'} />
			<Label variant={'destinationDetailsCustomTwo'}>{renderMinMaxLabels(minBath, maxBath)} Bath</Label>
			<div className={'separator'} />
			<Label variant={'destinationDetailsCustomTwo'}>{renderMinMaxLabels(minArea, maxArea)} ft&sup2;</Label>
		</div>
	);
};

export default MinMaxDestinationDetailsBar;
