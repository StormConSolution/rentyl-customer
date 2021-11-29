import * as React from 'react';
import './ComparisonPopup.scss';
import { Box, Popup, popupController, PopupProps } from '@bit/redsky.framework.rs.996';
import Paper from '../../components/paper/Paper';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label';
import CarouselV2 from '../../components/carouselV2/CarouselV2';
import Select from '@bit/redsky.framework.rs.select';
import { RsFormControl } from '@bit/redsky.framework.rs.form';
import { useEffect, useRef, useState } from 'react';

export interface ComparisonPopupProps extends PopupProps {}
const ComparisonPopup: React.FC<ComparisonPopupProps> = (props) => {
	const rowTitlesRef = useRef<HTMLDivElement>(null);
	const comparisonColumnWrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!rowTitlesRef.current || !comparisonColumnWrapperRef.current) return;
		let row = rowTitlesRef.current;
		let comparison = comparisonColumnWrapperRef.current.children[0].children;
		let heightArray = [];
		for (let i = 0; i < comparison.length; i++) {
			heightArray.push(i === 0 ? comparison[i].scrollHeight : comparison[i].scrollHeight + 1);
		}
		console.log(heightArray.join('px ') + 'px');
		row.style.gridTemplateRows = heightArray.join('px ') + 'px';
	}, []);

	function renderTitles() {
		return (
			<Box boxRef={rowTitlesRef} className={'rowTitles'}>
				<div />
				<Label className={'borderRadiusTop'} variant={'custom17'}>
					Property Type
				</Label>
				<Label variant={'custom17'}>Guest Limit</Label>
				<Label variant={'custom17'}>Extra Bedding</Label>
				<Label variant={'custom17'}>Accessible</Label>
				<Label variant={'custom17'}>Features</Label>
				<Label className={'borderRadiusBottom'} variant={'custom17'}>
					Overview
				</Label>
			</Box>
		);
	}

	function renderComparisonColumns() {
		let test = [];
		for (let i = 0; i < 3; i++) {
			test.push(
				<Box className={'comparisonColumn'}>
					<div className={'carouselWrapper'}>
						<CarouselV2 path={''} imgPaths={[]} onGalleryClick={() => {}} hideCompareButton />
					</div>

					<Select control={new RsFormControl('', '', [])} options={[]} />
					<Label variant={'custom17'}>Guest Limit</Label>
					<Label variant={'custom17'}>Extra Bedding</Label>
					<Label variant={'custom17'}>Accessible</Label>
					<Label variant={'custom17'}>
						<ul>
							<li>amenity1</li>
							<li>amenity1</li>
							<li>amenity1</li>
							<li>amenity1</li>
						</ul>
					</Label>
					<Label variant={'custom17'}>Overview</Label>
				</Box>
			);
		}
		return test;
	}
	return (
		<Popup opened={props.opened} preventCloseByBackgroundClick>
			<Paper className={'rsComparisonPopup'}>
				<Box className={'popupTitle'}>
					<Label variant={'h4'}>Compare</Label>
					<Icon
						iconImg={'icon-close'}
						onClick={() => {
							popupController.close(ComparisonPopup);
						}}
						cursorPointer
					/>
				</Box>
				<Box className={'comparisonTable'}>
					{renderTitles()}
					<div ref={comparisonColumnWrapperRef} className={'comparisonColumnWrapper'}>
						{renderComparisonColumns()}
					</div>
				</Box>
			</Paper>
		</Popup>
	);
};
export default ComparisonPopup;
