import Label from '@bit/redsky.framework.rs.label';
import React from 'react';
import { addCommasToNumber, NumberUtils, StringUtils } from '../../utils/utils';
import LabelButton from '../labelButton/LabelButton';
import './DestinationSummaryAccommodationList.scss';
import IconToolTip from '../iconToolTip/IconToolTip';
import { useRecoilValue } from 'recoil';
import globalState from '../../models/globalState';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

export interface DestinationSummaryAccommodationListProps {
	accommodationType: string;
	accommodations: AccommodationListRowProp[];
	onDetailsClick: (accommodationId: number | string) => void;
	onBookNowClick: (accommodationId: number) => void;
	onAddCompareClick?: (accommodationId: number | string) => void;
}

interface AccommodationListRowProp extends Api.Destination.Res.Accommodation {}

const DestinationSummaryAccommodationList: React.FC<DestinationSummaryAccommodationListProps> = (props) => {
	const size = useWindowResizeChange();
	const company = useRecoilValue<Api.Company.Res.GetCompanyAndClientVariables>(globalState.company);
	function renderAccommodationListRow(accommodation: AccommodationListRowProp, index: number): JSX.Element {
		return (
			<div
				className="accommodationRow"
				key={index}
				onClick={() => {
					if (size !== 'small') return;
					props.onDetailsClick(accommodation.id);
				}}
			>
				<Label variant={'caption'}>{accommodation.name}</Label>
				{size !== 'small' && (
					<>
						<Label display={'flex'} className={'icons'}>
							{renderIcons(accommodation.features)}
						</Label>
						<Label variant={'caption'}>{accommodation.roomCount}</Label>
						<Label variant={'caption'}>{accommodation.maxOccupantCount}</Label>
					</>
				)}
				<div>
					{company.allowCashBooking === 1 && (
						<Label variant="h4" className="rate">
							${StringUtils.formatMoney(accommodation.prices[0].priceCents)}
						</Label>
					)}
					{company.allowPointBooking === 1 && (
						<Label variant={company.allowCashBooking !== 1 ? 'h4' : 'body2'} className="points">
							{addCommasToNumber(
								NumberUtils.convertCentsToPoints(accommodation.prices[0].priceCents, 10)
							)}{' '}
							pts
						</Label>
					)}
				</div>
				{size !== 'small' && (
					<div>
						<LabelButton
							variant="caption"
							look="containedSecondary"
							label="Details"
							onClick={() => {
								props.onDetailsClick(accommodation.id);
							}}
						/>
					</div>
				)}
				<div>
					<LabelButton
						variant="caption"
						look="containedPrimary"
						label="Book Now"
						onClick={() => {
							props.onBookNowClick(accommodation.id);
						}}
					/>
				</div>
				{size !== 'small' && !!props.onAddCompareClick && (
					<Label
						className={'comparePlusText'}
						variant="caption"
						onClick={() => {
							props.onAddCompareClick?.(accommodation.id);
						}}
					>
						Compare +
					</Label>
				)}
			</div>
		);
	}

	function renderIcons(icons: { id: number; title: string; icon: string }[]): JSX.Element[] {
		return icons
			.map((icon) => {
				return <IconToolTip iconImg={icon.icon} key={icon.id} title={icon.title} />;
			})
			.slice(0, 4);
	}

	function renderAccommodationList(accommodations: AccommodationListRowProp[], index: number): JSX.Element[] {
		return accommodations
			.sort((room1, room2) => room2.maxOccupantCount - room1.maxOccupantCount)
			.map(renderAccommodationListRow, index);
	}

	return (
		<div className="rsDestinationSummaryAccommodationList">
			<div className="accommodationRow header">
				<Label variant="caption">{props.accommodationType}</Label>
				{size !== 'small' && (
					<>
						<Label variant="caption">Amenities</Label>
						<Label variant="caption">Bedrooms</Label>
						<Label variant="caption">Guests</Label>{' '}
					</>
				)}
				<Label variant="caption">Rate/Night</Label>
				<div>&nbsp;</div>
			</div>
			<div className={'availableAccommodationRows'}>{renderAccommodationList(props.accommodations, 0)}</div>
		</div>
	);
};

export default DestinationSummaryAccommodationList;
