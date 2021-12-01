import * as React from 'react';
import './Policies.scss';
import Label from '@bit/redsky.framework.rs.label';

interface PoliciesProps {
	checkInTime: string;
	checkOutTime: string;
	bookingDescription: string;
	guaranteePolicy: string;
	cancellationPolicy: string;
}

const FONT_COLOR = '#001933';

const Policies: React.FC<PoliciesProps> = (props) => {
	return (
		<div className={'rsPolicies'}>
			<Label className={'sectionTitle'} color={FONT_COLOR}>
				Policies
			</Label>
			<div className={'checkInOutContainer'}>
				<div className={'checkInWrapper'}>
					<Label className={'header'} color={FONT_COLOR}>
						Check in
					</Label>
					<Label className={'time'} color={FONT_COLOR}>
						After {props.checkInTime}
					</Label>
				</div>
				<div className={'checkOutWrapper'}>
					<Label className={'header'} color={FONT_COLOR}>
						Check out
					</Label>
					<Label className={'time'} color={FONT_COLOR}>
						Before {props.checkOutTime}
					</Label>
				</div>
			</div>
			<Label className={'reservationInfo'} color={FONT_COLOR}>
				{props.bookingDescription}
			</Label>
			<div className={'guaranteeSection'}>
				<Label className={'header'} color={FONT_COLOR}>
					Guarantee Policy
				</Label>
				<Label className={'policyInformation'} color={FONT_COLOR}>
					{props.guaranteePolicy}
				</Label>
			</div>
			<div className={'cancellationSection'}>
				<Label className={'header'} color={FONT_COLOR}>
					Cancellation Policy
				</Label>
				<Label className={'policyInformation'} color={FONT_COLOR}>
					{props.cancellationPolicy}
				</Label>
			</div>
		</div>
	);
};

export default Policies;
