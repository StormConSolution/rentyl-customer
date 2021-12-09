import * as React from 'react';
import './ComparisonPopup.scss';
import { Box, Popup, popupController, PopupProps } from '@bit/redsky.framework.rs.996';
import Paper from '../../components/paper/Paper';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label';
import Select from '@bit/redsky.framework.rs.select';
import { RsFormControl } from '@bit/redsky.framework.rs.form';
import { useEffect, useState } from 'react';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import serviceFactory from '../../services/serviceFactory';
import AccommodationService from '../../services/accommodation/accommodation.service';
import Img from '@bit/redsky.framework.rs.img';
import ComparisonService from '../../services/comparison/comparison.service';

export interface ComparisonPopupProps extends PopupProps {}
const ComparisonPopup: React.FC<ComparisonPopupProps> = (props) => {
	const size = useWindowResizeChange();
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const comparisonState = useRecoilValue<Misc.ComparisonState>(globalState.destinationComparison);
	const accommodationService = serviceFactory.get<AccommodationService>('AccommodationService');
	const [accommodations, setAccommodations] = useState<Api.Accommodation.Res.Details[]>([]);

	useEffect(() => {
		document.body.style.overflow = 'hidden';
		document.body.style.position = 'unset';
		document.body.style.top = '0';
		return () => {
			document.body.style.overflow = 'unset';
			document.body.style.position = 'unset';
			document.body.style.top = 'unset';
		};
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

	function renderImageRow() {
		let row: React.ReactNodeArray = [
			<div />,
			...accommodations.map((accommodation, index) => {
				return (
					<div className={'carouselWrapper'} key={accommodation.id}>
						<Img
							src={
								accommodation.media.find((image) => image.isPrimary)?.urls.imageKit ||
								accommodation.media[0].urls.imageKit
							}
							alt={accommodation.name}
							width={300}
							height={300}
						/>
						{size === 'small' && (
							<Label variant={'caption3'}>{comparisonState.destinationDetails[index].title}</Label>
						)}
					</div>
				);
			})
		];
		return <Box className={'row images'}>{row}</Box>;
	}

	function renderPropertyTypeRow() {
		let row: React.ReactNodeArray = [
			<Label className={'title'} variant={size === 'small' ? 'customEight' : 'customSeventeen'}>
				Property type
			</Label>,
			...accommodations.map((accommodation, index) => {
				return (
					<Select
						key={index}
						control={new RsFormControl('', accommodation.id, [])}
						options={comparisonState.destinationDetails[index].accommodationOptions}
						updateControl={(control) => {
							comparisonService.changeAccommodation(
								control.value as number,
								comparisonState.destinationDetails[index].destinationId
							);
						}}
					/>
				);
			})
		];
		return <Box className={'row propertyType'}>{row}</Box>;
	}

	function renderGuestLimitRow() {
		let row: React.ReactNodeArray = [
			<Label className={'title'} variant={size === 'small' ? 'customEight' : 'customSeventeen'}>
				Guest limit
			</Label>,
			...accommodations.map((accommodation, index) => {
				return (
					<Label key={index} variant={size === 'small' ? 'customEight' : 'customSeventeen'}>
						{accommodation.maxOccupantCount}
					</Label>
				);
			})
		];
		return <Box className={'row guestLimit'}>{row}</Box>;
	}

	function renderExtraBeddingRow() {
		let row: React.ReactNodeArray = [
			<Label className={'title'} variant={size === 'small' ? 'customEight' : 'customSeventeen'}>
				Extra bedding
			</Label>,
			...accommodations.map((accommodation, index) => {
				return (
					<Label key={index} variant={size === 'small' ? 'customEight' : 'customSeventeen'}>
						{accommodation.extraBeds ? 'yes' : 'no'}
					</Label>
				);
			})
		];
		return <Box className={'row extraBedding'}>{row}</Box>;
	}

	function renderAccessibilityRow() {
		let row: React.ReactNodeArray = [
			<Label className={'title'} variant={size === 'small' ? 'customEight' : 'customSeventeen'}>
				Accessible
			</Label>,
			...accommodations.map((accommodation, index) => {
				return (
					<Label key={index} variant={size === 'small' ? 'customEight' : 'customSeventeen'}>
						{accommodation.adaCompliant ? 'yes' : 'no'}
					</Label>
				);
			})
		];
		return <Box className={'row accessibility'}>{row}</Box>;
	}

	function renderFeaturesRow() {
		let row: React.ReactNodeArray = [
			<Label className={'title'} variant={size === 'small' ? 'customEight' : 'customSeventeen'}>
				Features
			</Label>,
			...accommodations.map((accommodation, index) => {
				return (
					<Label variant={size === 'small' ? 'customEight' : 'customSeventeen'} key={index}>
						<ul>
							{accommodation.amenities.map((amenity, idx) => {
								return <li key={idx}>{amenity.title}</li>;
							})}
						</ul>
					</Label>
				);
			})
		];
		return <Box className={'row features'}>{row}</Box>;
	}

	function renderOverviewRow() {
		let row: React.ReactNodeArray = [
			<Label className={'title'} variant={size === 'small' ? 'customEight' : 'customSeventeen'}>
				Overview
			</Label>,
			...accommodations.map((accommodation, index) => {
				return (
					<Label key={index} variant={size === 'small' ? 'customEight' : 'customSeventeen'}>
						{accommodation.longDescription}
					</Label>
				);
			})
		];
		return <Box className={'row overview'}>{row}</Box>;
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
					{renderImageRow()}
					{renderPropertyTypeRow()}
					{renderGuestLimitRow()}
					{renderExtraBeddingRow()}
					{renderAccessibilityRow()}
					{renderFeaturesRow()}
					{renderOverviewRow()}
				</Box>
			</Paper>
		</Popup>
	);
};
export default ComparisonPopup;
