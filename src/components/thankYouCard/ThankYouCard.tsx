import * as React from 'react';
import './ThankYouCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import { Box } from '@bit/redsky.framework.rs.996';

interface ThankYouCardProps {
	reservationNumber: number;
}

const FONT_COLOR = '#001933';

const ThankYouCard: React.FC<ThankYouCardProps> = (props) => {
	return (
		<div className={'rsThankYouCard'}>
			<Label className={'sectionTitle'} color={FONT_COLOR}>
				Thank you for booking with Rentyl Resorts!
			</Label>
			<Label className={'emailConfirmation'} color={FONT_COLOR}>
				You will receive an email shortly with your email confirmation.
			</Label>
			<Label className={'portalEmail'} color={FONT_COLOR}>
				Additionally you will receive email to our portal where you can enhance your stay with our various
				upgrades and packages.
			</Label>
			<Box display={'flex'} alignItems={'center'} paddingTop={28}>
				<Label className={'reservationNumber'} color={FONT_COLOR}>
					Reservation Number :
				</Label>
				<Label className={'number'} color={FONT_COLOR}>
					#{props.reservationNumber}
				</Label>
			</Box>
		</div>
	);
};

export default ThankYouCard;
