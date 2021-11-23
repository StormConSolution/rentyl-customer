import * as React from 'react';
import './ComparisonTableMobile.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import ComparisonAccommodationCardMobile from '../../comparisonAccommodationCard/comparisonAccommodationCardMobile/ComparisonAccommodationCardMobile';
import { useEffect, useState } from 'react';

interface ComparisonTableMobileProps {
	comparisonItems: Misc.ComparisonState;
	accommodationDetailList: Api.Accommodation.Res.Details[];
}

const ComparisonTableMobile: React.FC<ComparisonTableMobileProps> = (props) => {
	const [pinnedAccommodationId, setPinnedAccommodationId] = useState<number>(0);

	useEffect(() => {
		setPinnedAccommodationId(props.comparisonItems.destinationDetails[0].destinationId);
	}, []);

	function handlePinToFirst(pinToFirst: boolean, comparisonId: number) {
		if (!pinToFirst) return;
		setPinnedAccommodationId(comparisonId);
	}

	// function renderPinnedAccommodation() {
	// const pinnedItem = props.comparisonItems.destinationIds.find((item) => item === pinnedAccommodationId);
	// if (!pinnedItem) return;
	// // const pinnedAccommodationInfo = props.accommodationDetailList.find(
	// // 	(accommodation) => accommodation.id === pinnedItem.selectedRoom
	// // );
	// return (
	// 	<Box key={pinnedItem} className={'pinnedAccommodation'}>
	// 		{/*<ComparisonAccommodationCardMobile*/}
	// 		{/*	accommodationDetails={props.accommodationDetailList[0]}*/}
	// 		{/*	destinationDetails={pinnedItem}*/}
	// 		{/*	handlePinToFirst={handlePinToFirst}*/}
	// 		{/*/>*/}
	// 	</Box>
	// );
	// }

	// function renderUnpinnedAccommodations() {
	// return props.comparisonItems.destinationIds
	// 	.filter((item) => item !== pinnedAccommodationId)
	// 	.map((item) => {
	// 		const accommodationInfo = props.accommodationDetailList.find(
	// 			(accommodation) => accommodation.id === item
	// 		);
	// 		return (
	// 			<Box className={'unpinnedAccommodation'}>
	// 				{/*<ComparisonAccommodationCardMobile*/}
	// 				{/*	accommodationDetails={accommodationInfo || props.accommodationDetailList[0]}*/}
	// 				{/*	destinationDetails={item}*/}
	// 				{/*	handlePinToFirst={handlePinToFirst}*/}
	// 				{/*/>*/}
	// 			</Box>
	// 		);
	// 	});
	// }

	return (
		<Box className={'rsComparisonTableMobile'}>
			<Box className={'pinnedSection'}>
				<Box className={'rowTitles'}>
					<Box height={'100px'}></Box>
					<Label variant={'h4'}>Property Type</Label>
					<Label variant={'h4'} className={'oddCell'}>
						Guest Limit
					</Label>
					<Label variant={'h4'}>Extra Bedding</Label>
					<Label variant={'h4'} className={'oddCell'}>
						Accessible
					</Label>
					<Label variant={'h4'}>Features</Label>
				</Box>
				{/*{renderPinnedAccommodation()}*/}
			</Box>
			{/*<Box className={'unpinnedSection'}>{renderUnpinnedAccommodations()}</Box>*/}
		</Box>
	);
};

export default ComparisonTableMobile;
