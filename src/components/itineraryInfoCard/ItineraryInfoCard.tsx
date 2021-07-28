import * as React from 'react';
import './ItineraryInfoCard.scss';
import LabelLink from '../labelLink/LabelLink';
import Label from '@bit/redsky.framework.rs.label';
import { Box } from '@bit/redsky.framework.rs.996';
import LabelButton from '../labelButton/LabelButton';
import router from '../../utils/router';
import Paper from '../paper/Paper';

interface NavButtons {
	link: string;
	label: string;
}

interface ItineraryInfoCardProps {
	backButton: NavButtons;
	logoImgUrl: string;
	name: string;
	description: string;
	callToActionButton: NavButtons;
}

const ItineraryInfoCard: React.FC<ItineraryInfoCardProps> = (props) => {
	return (
		<Paper className={'rsItineraryInfoCard'} boxShadow padding={'40px'}>
			<LabelLink path={props.backButton.link} label={props.backButton.label} variant={'caption'} />
			<Label marginTop={85} variant={'h3'}>
				Your Itinerary at <img className={'logoImg'} src={props.logoImgUrl} alt={props.name} />
			</Label>
			<Box margin={'40px auto 50px'} width={'477px'}>
				<Label margin={'0 auto 16px'} variant={'h1'}>
					{props.name}
				</Label>
				<Label variant={'h3'} lineClamp={3}>
					{props.description}
				</Label>
			</Box>
			<LabelButton
				look={'containedPrimary'}
				variant={'button'}
				label={props.callToActionButton.label}
				onClick={() => {
					router.navigate(props.callToActionButton.link).catch(console.error);
				}}
			/>
		</Paper>
	);
};

export default ItineraryInfoCard;
