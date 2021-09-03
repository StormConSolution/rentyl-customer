import React from 'react';
import './AccommodationSearchCallToActionCard.scss';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { Box, Link } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import Button from '@bit/redsky.framework.rs.button';
import Paper from '../paper/Paper';
import { StringUtils } from '../../utils/utils';
import LinkButton from '../linkButton/LinkButton';

interface AccommodationSearchCallToActionCardProps {
	points: number;
	squareFeet: number | null;
	maxSleeps: number;
	bookNowOnClick?: () => void;
	bookNowDisabled?: boolean;
	compareOnClick?: () => void;
	viewDetailsOnClick?: () => void;
	hideButtons?: boolean;
	compareDisabled?: boolean;
	viewDetailsDisabled?: boolean;
	className?: string;
	currentRoom?: boolean;
}

const AccommodationSearchCallToActionCard: React.FC<AccommodationSearchCallToActionCardProps> = (props) => {
	const size = useWindowResizeChange();

	if (size === 'small') {
		return (
			<Paper
				boxShadow
				className={`rsAccommodationSearchCallToActionCard ${props.className || ''}`}
				height={'117px'}
				backgroundColor={'#fcfbf8'}
				padding={'8px 10px 15px'}
			>
				<Box className={'topContents'}>
					{props.squareFeet && (
						<Box className={'sizeBoxMobile'}>
							<Label className={'sizeTitleLabel'} variant={'caption'}>
								Size
							</Label>
							<Label className={'sizeContentLabel'} variant={'body2'}>
								{StringUtils.addCommasToNumber(props.squareFeet)}sq.
							</Label>
						</Box>
					)}
					<Box className={'bedroomsBoxMobile'}>
						<Label className={'bedroomsTitleLabel'} variant={'caption'}>
							Sleeps
						</Label>
						<Label className={'bedroomsContentLabel'} variant={'body2'}>
							{props.maxSleeps}
						</Label>
					</Box>
					<Box className={'earnBoxMobile'}>
						<Label className={'earnTitle'} variant={'caption'}>
							Earn Up To
						</Label>
						<Label className={'earnContent'} variant={'h4'}>
							{StringUtils.addCommasToNumber(props.points)} points
						</Label>
					</Box>
				</Box>
				<Box className={'bottomContents'} display={'flex'}>
					{!props.hideButtons && (
						<Button
							className={'compareBtnMobile'}
							look={'containedSecondary'}
							onClick={props.compareOnClick}
							disabled={props.compareDisabled}
							type={'button'}
						>
							<Label className={'compareBtnTextMobile'} variant={'button'}>
								ADD TO COMPARE
								<Icon
									className={'addCompareIconMobile'}
									iconImg={'icon-plus'}
									size={8}
									color={'#004b98'}
								/>
							</Label>
						</Button>
					)}
					<LinkButton
						className={'bookNowBtnMobile'}
						label={props.currentRoom ? 'Keep Room' : 'BOOK NOW'}
						disabled={props.bookNowDisabled}
						onClick={props.bookNowOnClick}
						path={'/booking/packages'}
						look={'containedPrimary'}
					/>
				</Box>
			</Paper>
		);
	} else {
		return (
			<Paper
				boxShadow
				className={`rsAccommodationSearchCallToActionCard ${props.className || ''}`}
				// height={'280px'}
				width={'180px'}
				backgroundColor={'#fcfbf8'}
				padding={'13px 22px 16px'}
			>
				<Label className={'earnLabel'} variant={'caption'}>
					Earn Up To
				</Label>
				<Label className={'pointsLabel'} variant={'h2'}>
					{StringUtils.addCommasToNumber(props.points)} points
				</Label>
				<LinkButton
					className={'bookNowBtnMobile'}
					label={props.currentRoom ? 'Keep Room' : 'BOOK NOW'}
					disabled={props.bookNowDisabled}
					onClick={props.bookNowOnClick}
					path={'/booking/packages'}
					look={'containedPrimary'}
				/>
				{!props.hideButtons && (
					<LinkButton
						label={'VIEW DETAILS'}
						className={'viewDetailsBtn'}
						path={'/accommodation/details'}
						disabled={props.viewDetailsDisabled}
						onClick={props.viewDetailsOnClick}
						look={'containedSecondary'}
					/>
				)}

				{!props.hideButtons && (
					<div className={'compareLinkDiv'}>
						<Label className={'compareLink'} onClick={props.compareOnClick} variant={'caption'}>
							Add To Compare
							<Icon className={'addCompareIcon'} iconImg={'icon-plus'} size={9} color={'#004b98'} />
						</Label>
					</div>
				)}
			</Paper>
		);
	}
};

export default AccommodationSearchCallToActionCard;
