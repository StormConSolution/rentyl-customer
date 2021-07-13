import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label';
import { StringUtils } from '@bit/redsky.framework.rs.utils';
import React from 'react';
import { addCommasToNumber } from '../../utils/utils';
import LabelButton from '../labelButton/LabelButton';
import './DestinationSummaryAccommodationList.scss';
import IconToolTip from '../iconToolTip/IconToolTip';

export interface DestinationSummaryAccommodationListProps {
	accommodationType: string;
	accommodations: AccommodationListRowProp[];
	onDetailsClick: (accommodationId: number | string) => void;
	onBookNowClick: (accommodationId: number | string) => void;
	onAddCompareClick?: (accommodationId: number | string) => void;
}

interface BedDetails {
	type: string;
	isPrimary: number;
	qty: string;
	description: string;
}

interface AccommodationListRowProp {
	id: number;
	name: string;
	roomCount: number;
	bedDetails: BedDetails[];
	priceCents: number;
	prices: {
		priceCents: number;
		quantityAvailable: number;
		rateCode: string;
	}[];
	features: {
		id: number;
		title: string;
		icon: string;
	}[];
}

const DestinationSummaryAccommodationList: React.FC<DestinationSummaryAccommodationListProps> = (props) => {
	function getBedQuantity(room: BedDetails[]): number {
		return room.reduce((total, bed) => (total += +bed.qty), 0);
	}
	function renderAccommodationListRow(accommodation: AccommodationListRowProp, index: number): JSX.Element {
		return (
			<div className="accommodationRow" key={index}>
				<Label variant={'caption'}>{accommodation.name}</Label>
				<Label display={'flex'} className={'icons'}>
					{renderIcons(accommodation.features.map((feature) => feature.icon))}
				</Label>
				<Label variant={'caption'}>{accommodation.roomCount}</Label>
				<Label variant={'caption'}>{getBedQuantity(accommodation.bedDetails)}</Label>
				<div>
					<Label variant="h3" className="rate">
						${StringUtils.formatMoney(accommodation.prices[0].priceCents)}
					</Label>
					<Label variant="body2" className="points">
						{addCommasToNumber(accommodation.prices[0].priceCents)} pts.
					</Label>
				</div>
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
				{!!props.onAddCompareClick && (
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

	function renderIcons(iconNames: string[]): JSX.Element[] {
		return iconNames
			.map((name, index: number) => {
				return <IconToolTip iconImg={name} key={index} title={name} />;
				// return <Icon iconImg={name} key={index} />;
			})
			.slice(0, 4);
	}

	function renderAccommodationList(accommodations: AccommodationListRowProp[], index: number): JSX.Element[] {
		return accommodations
			.sort((room1, room2) => getBedQuantity(room2.bedDetails) - getBedQuantity(room1.bedDetails))
			.map(renderAccommodationListRow, index);
	}

	return (
		<div className="rsDestinationSummaryAccomodationList">
			<div className="accommodationRow header">
				<div>
					<Label variant="h4">{props.accommodationType}</Label>
				</div>
				<div>
					<Label variant="h4">Amenities</Label>
				</div>
				<div>
					<Label variant="h4">Bedrooms</Label>
				</div>
				<div>
					<Label variant="h4">Beds</Label>
				</div>
				<div>
					<Label variant="h4">Rate/Night</Label>
				</div>
				<div>&nbsp;</div>
			</div>
			<div className={'availableAccommodationRows'}>{renderAccommodationList(props.accommodations, 0)}</div>
		</div>
	);
};

export default DestinationSummaryAccommodationList;
