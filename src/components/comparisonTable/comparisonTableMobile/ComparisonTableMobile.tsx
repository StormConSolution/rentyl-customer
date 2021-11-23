import * as React from 'react';
import './ComparisonTableMobile.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label';
import ComparisonAccommodationCardMobile from '../../comparisonAccommodationCard/comparisonAccommodationCardMobile/ComparisonAccommodationCardMobile';
import { useEffect, useState } from 'react';

interface ComparisonTableMobileProps {
	comparisonState: Misc.ComparisonState;
	destinationDetailList: Api.Destination.Res.Get[];
}

const ComparisonTableMobile: React.FC<ComparisonTableMobileProps> = (props) => {
	const [pinnedDestinationId, setPinnedDestinationId] = useState<number>(0);

	useEffect(() => {
		setPinnedDestinationId(props.comparisonState.destinationDetails[0].destinationId);
	}, []);

	function handlePinToFirst(pinToFirst: boolean, destinationId: number) {
		if (!pinToFirst) return;
		setPinnedDestinationId(destinationId);
	}

	function renderPinnedAccommodation() {
		const pinnedItem = props.destinationDetailList.find((item) => item.id === pinnedDestinationId);
		if (!pinnedItem) return;
		return (
			<Box key={pinnedItem.id} className={'pinnedAccommodation'}>
				<ComparisonAccommodationCardMobile
					destinationDetails={pinnedItem}
					handlePinToFirst={handlePinToFirst}
				/>
			</Box>
		);
	}

	function renderUnpinnedAccommodations() {
		return props.destinationDetailList
			.filter((item) => item.id !== pinnedDestinationId)
			.map((item) => {
				return (
					<Box className={'unpinnedAccommodation'}>
						<ComparisonAccommodationCardMobile
							destinationDetails={item}
							handlePinToFirst={handlePinToFirst}
						/>
					</Box>
				);
			});
	}

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
				{renderPinnedAccommodation()}
			</Box>
			<Box className={'unpinnedSection'}>{renderUnpinnedAccommodations()}</Box>
		</Box>
	);
};

export default ComparisonTableMobile;
