import React from 'react';
import './RoomSearchCallToActionCard.scss';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { Box } from '@bit/redsky.framework.rs.996';
import LabelButton from '../labelButton/LabelButton';
import Icon from '@bit/redsky.framework.rs.icon';
import Button from '@bit/redsky.framework.rs.button';

interface RoomSearchCallToActionCardProps {
	className?: string;
	points: number;
	bookNowOnClick?: () => void;
	bookNowDisabled?: boolean;
	compareOnClick?: () => void;
	compareDisabled?: boolean;
	viewDetailsOnClick?: () => void;
	viewDetailsDisabled?: boolean;
	squareFeet: string;
	bedrooms: number;
}

const RoomSearchCallToActionCard: React.FC<RoomSearchCallToActionCardProps> = (props) => {
	const size = useWindowResizeChange();

	if (size === 'small') {
		return (
			<div
				className={
					!!props.className
						? `rsRoomSearchCallToActionCardMobile ${props.className}`
						: 'rsRoomSearchCallToActionCardMobile'
				}
			>
				<Box className={'mobileTopContents'}>
					<Box className={'sizeBoxMobile'}>
						<Label className={'sizeTitleLabel'} variant={'body2'}>
							SIZE
						</Label>
						<Label className={'sizeContentLabel'} variant={'body2'}>
							{props.squareFeet}
						</Label>
					</Box>
					<Box className={'bedroomsBoxMobile'}>
						<Label className={'bedroomsTitleLabel'} variant={'body2'}>
							BEDROOMS
						</Label>
						<Label className={'bedroomsContentLabel'} variant={'body2'}>
							{props.bedrooms}
						</Label>
					</Box>
					<Box className={'earnBoxMobile'}>
						<Label className={'earnTitle'} variant={'body1'}>
							Earn Up To
						</Label>
						<Label className={'earnContent'} variant={'h2'}>
							{props.points.toLocaleString('en-US', { useGrouping: true })} points
						</Label>
					</Box>
				</Box>
				<Box className={'mobileBottomContents'} display={'flex'}>
					<Button
						className={'compareBtnMobile'}
						look={'containedSecondary'}
						onClick={props.compareOnClick}
						disabled={props.compareDisabled}
						type={'button'}
					>
						<Label className={'compareBtnTextMobile'} variant={'button'}>
							ADD TO COMPARE
							<Icon className={'addCompareIconMobile'} iconImg={'icon-plus'} size={8} color={'#004b98'} />
						</Label>
					</Button>
					<LabelButton
						className={'bookNowBtnMobile'}
						look={'containedPrimary'}
						variant={'button'}
						label={'BOOK NOW'}
						disabled={props.bookNowDisabled}
						onClick={props.bookNowOnClick}
					/>
				</Box>
			</div>
		);
	} else {
		return (
			<div className={`rsRoomSearchCallToActionCard ${props.className || ''}`}>
				<Label className={'earnLabel'} variant={'body1'}>
					Earn Up To
				</Label>
				<Label className={'pointsLabel'} variant={'h2'}>
					{props.points.toLocaleString('en-US', { useGrouping: true })} points
				</Label>
				<LabelButton
					className={'bookNowBtn'}
					look={'containedPrimary'}
					variant={'button'}
					label={'BOOK NOW'}
					disabled={props.bookNowDisabled}
					onClick={props.bookNowOnClick}
				/>
				<LabelButton
					className={'viewDetailsBtn'}
					look={'containedSecondary'}
					variant={'button'}
					label={'VIEW DETAILS'}
					disabled={props.viewDetailsDisabled}
					onClick={props.viewDetailsOnClick}
				/>

				<div className={'compareLinkDiv'}>
					<Label className={'compareLink'} onClick={props.compareOnClick}>
						Add To Compare
						<Icon className={'addCompareIcon'} iconImg={'icon-plus'} size={9} color={'#004b98'} />
					</Label>
				</div>
			</div>
		);
	}
};

export default RoomSearchCallToActionCard;
