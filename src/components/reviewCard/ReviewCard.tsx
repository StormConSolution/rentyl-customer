import * as React from 'react';
import './ReviewCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import { DateUtils } from '../../utils/utils';
import StarRating from '../starRating/StarRating';
import LabelButton from '../labelButton/LabelButton';
import { Box } from '@bit/redsky.framework.rs.996';
import Chip from '@bit/redsky.framework.rs.chip';

interface ReviewCardProps {
	guestName: string;
	createdOn: string | Date;
	rating: number;
	message: string;
	packages: string[];
	accommodationName: string;
}

const ReviewCard: React.FC<ReviewCardProps> = (props) => {
	function renderPackages() {
		if (props.packages.length > 1) {
			return props.packages.join(', ');
		} else return props.packages;
	}

	return (
		<Box className={'rsReviewCard'} maxWidth={'70%'}>
			<Label variant={'h4'}>{props.guestName}</Label>
			<Label variant={'caption'} margin={'6px 0'}>
				{DateUtils.displayUserDate(new Date())}
			</Label>
			<StarRating size={'small16px'} rating={props.rating} />
			<Label
				margin={'15px 0 10px'}
				variant={'body1'}
				lineClamp={4}
				showLessText={<LabelButton look={'none'} variant={'button'} label={'see less'} disableRipple />}
				showMoreText={<LabelButton look={'none'} variant={'button'} label={'see more'} disableRipple />}
				showMoreButton
			>
				{props.message}
			</Label>
			<Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mt={10}>
				<Box maxWidth={'50%'}>
					<Label variant={'body1'}>
						<i>Packages</i>
					</Label>
					<Box display={'flex'}>
						<Label variant={'body2'}>
							<i>{renderPackages()}</i>
						</Label>
					</Box>
				</Box>
				<Box display={'flex'}>
					<Chip label={props.accommodationName} look={'standard'} />
					<Chip label={'Verified Guest'} look={'standard'} />
				</Box>
			</Box>
		</Box>
	);
};

export default ReviewCard;
