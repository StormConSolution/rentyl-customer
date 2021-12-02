import React from 'react';
import './MinMaxDestinationDetailsBar.scss';
import Label from '@bit/redsky.framework.rs.label';

interface MinMaxDestinationDetailsBarProps {
	minBed: number;
	maxBed: number;
	minBath: number;
	maxBath: number;
	squareFt: {
		minSquareFt: number;
		maxSquareFt: number;
	};
	className?: string;
}

const MinMaxDestinationDetailsBar: React.FC<MinMaxDestinationDetailsBarProps> = (props) => {
	const { minBed, maxBed, minBath, maxBath, squareFt } = props;

	function renderMinMaxLabels(min: number, max: number) {
		if (min === max) return min;
		if (min === 0) return `1-${max}`;
		return `${min}-${max}`;
	}

	return (
		<div className={`rsMinMaxDestinationDetailsBar ${props.className || ''}`}>
			<Label className={'minMaxLabel'} variant={'destinationDetailsCustomTwo'}>
				{renderMinMaxLabels(minBed, maxBed)} Bed
			</Label>
			<div className={'separator'} />
			<Label className={'minMaxLabel'} variant={'destinationDetailsCustomTwo'}>
				{renderMinMaxLabels(minBath, maxBath)} Bath
			</Label>
			<div className={'separator'} />
			<Label className={'minMaxLabel'} variant={'destinationDetailsCustomTwo'}>
				{renderMinMaxLabels(squareFt.minSquareFt, squareFt.maxSquareFt)} ft&sup2;
			</Label>
		</div>
	);
};

export default MinMaxDestinationDetailsBar;
