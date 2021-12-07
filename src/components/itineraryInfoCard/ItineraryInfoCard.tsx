import * as React from 'react';
import './ItineraryInfoCard.scss';
import LabelLink from '../labelLink/LabelLink';
import Label from '@bit/redsky.framework.rs.label';
import { Box } from '@bit/redsky.framework.rs.996';
import Paper from '../paper/Paper';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import LinkButton from '../linkButton/LinkButton';

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
	const size = useWindowResizeChange();

	return (
		<Paper className={'rsItineraryInfoCard'} boxShadow>
			<LabelLink path={props.backButton.link} label={props.backButton.label} variant={'caption'} />
			<Label marginTop={size === 'small' ? 24 : 50} variant={'h3'}>
				Your Itinerary at <img className={'logoImg'} src={props.logoImgUrl} alt={props.name} />
			</Label>
			<Box margin={size === 'small' ? '15px auto 25px' : '40px auto 50px'} maxWidth={'477px'}>
				<Label margin={'0 auto 16px'} variant={'h1'}>
					{props.name}
				</Label>
				<Label variant={'h3'} lineClamp={3}>
					{props.description}
				</Label>
			</Box>
			<Box display={'flex'} justifyContent={'space-evenly'}>
				<LinkButton
					look={'containedPrimary'}
					label={props.callToActionButton.label}
					path={props.callToActionButton.link}
				/>
			</Box>
		</Paper>
	);
};

export default ItineraryInfoCard;
