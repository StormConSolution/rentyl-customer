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

const Policies: React.FC<PoliciesProps> = (props) => {
	return (
		<div className={'rsPolicies'}>
			<Label className={'sectionTitle'}>Policies</Label>
			<div className={'checkInOutContainer'}>
				<div className={'checkInWrapper'}>
					<Label className={'header'}>Check in</Label>
					<Label className={'time'}>After {props.checkInTime}</Label>
				</div>
				<div className={'checkOutWrapper'}>
					<Label className={'header'}>Check out</Label>
					<Label className={'time'}>Before {props.checkOutTime}</Label>
				</div>
			</div>
			<Label className={'reservationInfo'}>{props.bookingDescription}</Label>
			<div className={'guaranteeSection'}>
				<Label className={'header'}>Guarantee Policy</Label>
				<Label className={'policyInformation'}>{props.guaranteePolicy}</Label>
			</div>
			<div className={'cancellationSection'}>
				<Label className={'header'}>Cancellation Policy</Label>
				<Label className={'policyInformation'}>{props.cancellationPolicy}</Label>
			</div>
		</div>
	);
};

export default Policies;
