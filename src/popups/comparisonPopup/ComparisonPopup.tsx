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
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { useRecoilState } from 'recoil';
import globalState from '../../state/globalState';
import serviceFactory from '../../services/serviceFactory';
import AccommodationService from '../../services/accommodation/accommodation.service';

export interface ComparisonPopupProps extends PopupProps {}
const ComparisonPopup: React.FC<ComparisonPopupProps> = (props) => {
	const size = useWindowResizeChange();
	const rowTitlesRef = useRef<HTMLDivElement>(null);
	const comparisonColumnWrapperRef = useRef<HTMLDivElement>(null);
	const [comparisonState, setComparisonState] = useRecoilState<Misc.ComparisonState>(
		globalState.destinationComparison
	);
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const [accommodations, setAccommodations] = useState<Api.Accommodation.Res.Details[]>([]);

	useEffect(() => {
		if (!rowTitlesRef.current || !comparisonColumnWrapperRef.current) return;
		let row = rowTitlesRef.current;
		let child = comparisonColumnWrapperRef.current.children[0];
		if (!child) return;
		let comparison = child.children;
		let heightArray = [];
		for (let i = 0; i < comparison.length; i++) {
			heightArray.push(i === 0 ? comparison[i].scrollHeight : comparison[i].scrollHeight + 1);
		}
		console.log(heightArray.join('px ') + 'px');
		row.style.gridTemplateRows = heightArray.join('px ') + 'px';
	}, []);

	useEffect(() => {
		async function getAccommodations() {
			const result = await accommodationService.getManyAccommodationDetails(
				comparisonState.destinationDetails.map((item) => item.selectedAccommodationId)
			);
			setAccommodations(result);
		}
		getAccommodations().catch(console.error);
	}, [comparisonState]);

	function renderTitles() {
		return (
			<Box boxRef={rowTitlesRef} className={'rowTitles'}>
				<div />
				<Label className={'borderRadiusTop'} variant={'custom17'}>
					Property Type
				</Label>
				<Label variant={size === 'small' ? 'custom8' : 'custom17'}>Guest Limit</Label>
				<Label variant={size === 'small' ? 'custom8' : 'custom17'}>Extra Bedding</Label>
				<Label variant={size === 'small' ? 'custom8' : 'custom17'}>Accessible</Label>
				<Label variant={size === 'small' ? 'custom8' : 'custom17'}>Features</Label>
				<Label className={'borderRadiusBottom'} variant={size === 'small' ? 'custom8' : 'custom17'}>
					Overview
				</Label>
			</Box>
		);
	}

	function renderComparisonColumns() {
		return accommodations.map((accommodation, index) => {
			return (
				<Box className={'comparisonColumn'}>
					<div className={'carouselWrapper'}>
						<CarouselV2
							path={() => {}}
							imgPaths={accommodation.media.map((image) => image.urls.imageKit)}
							onGalleryClick={() => {}}
							hideCompareButton
						/>
					</div>
					<Select
						control={new RsFormControl('', '', [])}
						options={comparisonState.destinationDetails[index].accommodationOptions}
						updateControl={(control) => {
							setComparisonState((prev) => {
								prev.destinationDetails[index].selectedAccommodationId = control.value as number;
								return prev;
							});
						}}
					/>
					<Label variant={'custom17'}>{accommodation.maxOccupantCount}</Label>
					<Label variant={'custom17'}>{!!accommodation.extraBeds ? 'Yes' : 'No'}</Label>
					<Label variant={'custom17'}>{!!accommodation.adaCompliant ? 'Yes' : 'No'}</Label>
					<Label variant={'custom17'}>
						<ul>
							{accommodation.amenities.map((amenity) => {
								return <li>{amenity}</li>;
							})}
						</ul>
					</Label>
					<Label variant={'custom17'}>{accommodation.longDescription}</Label>
				</Box>
			);
		});
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
