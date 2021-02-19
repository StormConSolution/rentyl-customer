import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label';
import React from 'react';
import { addCommasToNumber } from '../../utils/utils';
import LabelButton from '../labelButton/LabelButton';
import './DestinationSummaryAccommodationList.scss';

export interface DestinationSummaryAccommodationListProps {
	accommodationType: string;
	accommodations: AccommodationListRowProp[];
	onDetailsClick: (accommodationId: number | string) => void;
	onBookNowClick: (accommodationId: number | string) => void;
	onAddCompareClick: (accommodationId: number | string) => void;
}

interface AccommodationListRowProp {
	id: any;
	name: string;
	amenityIconNames: Array<string>;
	bedrooms: number;
	beds: number;
	ratePerNight: number;
	pointsEarned: number;
}

const DestinationSummaryAccomodationList: React.FC<DestinationSummaryAccommodationListProps> = (props) => {
	function renderAccommodationListRow(accommodation: AccommodationListRowProp): JSX.Element {
		return (
			<div class="accommodationRow">
				<Label>{accommodation.name}</Label>
				<Label>{renderIcons(accommodation.amenityIconNames)}</Label>
				<Label>{accommodation.bedrooms}</Label>
				<Label>{accommodation.beds}</Label>
				<div>
					<Label variant="h3" className="rate">
						{formatMoney(accommodation.ratePerNight, true)}
					</Label>
					<Label variant="body2" className="points">
						{addCommasToNumber(accommodation.pointsEarned)} pts.
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
				<Label
					variant="caption"
					onClick={() => {
						props.onAddCompareClick(accommodation.id);
					}}
				>
					Compare +
				</Label>
			</div>
		);
	}

	function renderIcons(iconNames: Array<string>): Array<JSX.Element> {
		return iconNames.map((name, index: number) => {
			return <Icon iconImg={name} key={index} />;
		});
	}

	function formatMoney(intNum: number, includeCents: boolean = false): string {
		const rawNumberString: string = includeCents ? intNum.toFixed(2) : intNum + '';
		return '$' + addCommasToNumber(rawNumberString);
	}

	function renderAccommodationList(accommodations: AccommodationListRowProp[]): Array<JSX.Element> {
		return accommodations.map(renderAccommodationListRow);
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
			{renderAccommodationList(props.accommodations)}
		</div>
	);
};

export default DestinationSummaryAccomodationList;
