import React from 'react';
import './PointsHeaderCard.scss';
import Paper from '../../../components/paper/Paper';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import IconLabel from '../../../components/iconLabel/IconLabel';
import LabelLink from '../../../components/labelLink/LabelLink';
import { addCommasToNumber } from '../../../utils/utils';
import useWindowResizeChange from '../../../customHooks/useWindowResizeChange';
import { Box } from '@bit/redsky.framework.rs.996';

interface PointsHeaderCardProps {
	pointsEarned: React.ReactText;
	pointsPending: React.ReactText;
	tierToNextLevelAmount: React.ReactText;
	nextTierName: React.ReactText;
	expPointsAmount: React.ReactText;
	expPointsDate: Date | string;
	className?: string;
}

const PointsHeaderCard: React.FC<PointsHeaderCardProps> = (props) => {
	const size = useWindowResizeChange();

	function renderProgressBar() {
		let userPoints = 8500;
		let nextTier = 10000;
		let startPercent = (userPoints / nextTier) * 100;
		let startRectangle = 100;
		let startTriangle = 4;
		let endPercent = 100 - startPercent;
		let endRectangle = 100;
		let endTriangle = 5;
		if (startPercent >= 95) {
			startPercent = 95;
			endPercent = 5;
			startRectangle = 102;
			startTriangle = 3;
			endTriangle = 250;
			endRectangle = 136;
		} else if (startPercent < 95 && startPercent > 80) {
			startRectangle = 102;
			startTriangle = 3;
			endTriangle = 47;
			endRectangle = 110;
		} else if (startPercent <= 80 && startPercent > 70) {
			startRectangle = 100;
			startTriangle = 4;
			endTriangle = 18;
			endRectangle = 110;
		} else if (startPercent <= 70 && startPercent > 50) {
			startRectangle = 103;
			startTriangle = 5;
			endTriangle = 10;
			endRectangle = 108;
		} else if (startPercent <= 50 && startPercent > 30) {
			startRectangle = 104;
			startTriangle = 8;
			endTriangle = 6;
			endRectangle = 106;
		} else if (startPercent <= 30 && startPercent > 20) {
			startRectangle = 106;
			startTriangle = 12;
			endTriangle = 4;
			endRectangle = 105;
		} else if (startPercent <= 20 && startPercent > 10) {
			startRectangle = 106;
			startTriangle = 20;
			endTriangle = 4;
			endRectangle = 104;
		} else if (startPercent <= 10 && startPercent > 5) {
			startRectangle = 107;
			startTriangle = 43;
			endTriangle = 3;
			endRectangle = 103;
		} else if (startPercent <= 5) {
			startPercent = 5;
			endPercent = 95;
			startRectangle = 136;
			startTriangle = 191;
			endTriangle = 3;
			endRectangle = 103;
		}
		console.log('startPercent', startPercent);
		console.log('endPercent', endPercent);
		console.log('startTriangle', startTriangle);
		console.log('endTriangle', endTriangle);
		return (
			<div className={'iconContainer'}>
				<Box className={'progressbarStartContainer'} height={'35px'} width={`${startPercent}%`}>
					<Box className={'progressbarStart'} height={'35px'} width={`${startRectangle}%`} />
					<Box className={'progressbarStartTriangle'} height={'35px'} width={`${startTriangle}%`} />
				</Box>

				<Box className={'progressbarMiddle'} height={'35px'} width={'10%'} />

				<Box className={'progressbarEndContainer'} height={'35px'} width={`${endPercent}%`}>
					<Box className={'progressbarEndTriangle'} height={'35px'} width={`${endTriangle}%`} />
					<Box className={'progressbarEnd'} height={'35px'} width={`${endRectangle}%`} />
				</Box>
			</div>
		);
	}
	return (
		<div className={`rsPointsHeaderCard ${props.className || ''}`}>
			<Paper
				className={'headerPaper'}
				backgroundColor={'#FBFCF8'}
				boxShadow
				width={size === 'small' || size === 'medSmall' || size === 'medium' ? '600px' : '1042px'}
			>
				<div className={'topContainer'}>
					<div className={'earnedContainer'}>
						<Label className={'earnedTitle title'} variant={'h4'}>
							Points Earned
						</Label>
						<Label className={'earnedAmount amount'} variant={'h1'}>
							{addCommasToNumber(Number(props.pointsEarned))}
						</Label>
						<IconLabel
							className={'redeemLink link'}
							iconImg={'icon-chevron-right'}
							iconPosition={'right'}
							iconSize={7}
							labelName={'Redeem Points'}
							labelVariant={'caption'}
						/>
					</div>
					<div className={'pendingContainer'}>
						<Label className={'pendingTitle title'} variant={'h4'}>
							Points Pending
						</Label>
						<Label className={'pendingAmount amount'} variant={'h1'}>
							{addCommasToNumber(Number(props.pointsPending))}
						</Label>
						<IconLabel
							className={'redeemLink link'}
							iconImg={'icon-chevron-right'}
							iconPosition={'right'}
							iconSize={7}
							labelName={'Manage Points'}
							labelVariant={'caption'}
						/>
					</div>
					<div className={'tierStatusContainer'}>
						<Label className={'tierMsg'} variant={'body1'}>
							You're {addCommasToNumber(Number(props.tierToNextLevelAmount))} Points until you reach{' '}
							{props.nextTierName} Member Status. or&nbsp;
							<LabelLink path={'/'} label={'pay to level up now'} variant={'body1'} />
						</Label>
						{renderProgressBar()}
						<IconLabel
							className={'seeTiersLink link'}
							iconImg={'icon-chevron-right'}
							iconPosition={'right'}
							iconSize={7}
							labelName={'See Loyalty Tiers'}
							labelVariant={'caption'}
						/>
					</div>
				</div>
				<div className={'bottomContainer'}>
					<Label variant={'caption'}>
						{addCommasToNumber(Number(props.expPointsAmount))} points will expire on {props.expPointsDate}
					</Label>
				</div>
			</Paper>
		</div>
	);
};

export default PointsHeaderCard;
