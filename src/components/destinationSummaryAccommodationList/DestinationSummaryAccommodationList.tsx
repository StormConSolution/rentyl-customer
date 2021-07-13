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

interface AccommodationListRowProp {
	id: any;
	name: string;
	amenityIconNames: string[];
	bedrooms: number;
	beds: number;
	ratePerNight: number;
	pointsPerNight: number;
}

const DestinationSummaryAccommodationList: React.FC<DestinationSummaryAccommodationListProps> = (props) => {
	function renderAccommodationListRow(accommodation: AccommodationListRowProp, index: number): JSX.Element {
		return (
			<div className="accommodationRow" key={index}>
				<Label>{accommodation.name}</Label>
				<Label display={'flex'}>{renderIcons(accommodation.amenityIconNames)}</Label>
				<Label>{accommodation.bedrooms}</Label>
				<Label>{accommodation.beds}</Label>
				<div>
					<Label variant="h3" className="rate">
						{StringUtils.formatMoney(accommodation.ratePerNight)}
					</Label>
					<Label variant="body2" className="points">
						{addCommasToNumber(accommodation.pointsPerNight)} pts.
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
		return iconNames.map((name, index: number) => {
			return <IconToolTip iconImg={name} key={index} title={name} />;
			// return <Icon iconImg={name} key={index} />;
		});
	}

	function renderAccommodationList(accommodations: AccommodationListRowProp[], index: number): JSX.Element[] {
		return accommodations.map(renderAccommodationListRow, index);
	}

	return (
		<div className="rsDestinationSummaryAccomodationList">
			<div className="accommodationRow header">
				<div>
					<Label variant="caption">{props.accommodationType}</Label>
				</div>
				<div>
					<Label variant="caption">Amenities</Label>
				</div>
				<div>
					<Label variant="caption">Bedrooms</Label>
				</div>
				<div>
					<Label variant="caption">Beds</Label>
				</div>
				<div>
					<Label variant="caption">Rate/Night</Label>
				</div>
				<div>&nbsp;</div>
			</div>
			{renderAccommodationList(props.accommodations, 0)}
		</div>
	);
};

export default DestinationSummaryAccommodationList;
