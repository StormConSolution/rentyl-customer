import * as React from 'react';
import './LoyaltyTierPopup.scss';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import { Box, Popup, popupController } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import TierDescriptionCard from '../../components/tierDescriptionCard/TierDescriptionCard';
import Paper from '../../components/paper/Paper';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

export interface LoyaltyTierPopupProps extends PopupProps {}

const LoyaltyTierPopup: React.FC<LoyaltyTierPopupProps> = (props) => {
	const size = useWindowResizeChange();
	return (
		<Popup opened={props.opened} className={'rsLoyaltyTierPopup'}>
			<Paper className={'tierPopupContainer'}>
				<Icon
					className={'closeIcon'}
					iconImg={'icon-close'}
					size={size === 'small' ? 16 : 29}
					color="#797979"
					onClick={() => {
						popupController.close(LoyaltyTierPopup);
					}}
				/>
				<Box className={'popupHeader'}>
					<Label variant={size === 'small' ? 'customTwenty' : 'customTwentyTwo'} className="headerText">
						Membership Tiers and Benefits
					</Label>
				</Box>
				<Box className={'tierCardContainer'}>
					<TierDescriptionCard
						tierImage={'../../images/tierIcons/Bronze.png'}
						tierName={'Bronze Spire'}
						tierPointValue={'0 - 60,000'}
						tierDescription={
							'Welcome to Spire, begin earning at our entry level and aspire to higher levels.'
						}
					/>
					<TierDescriptionCard
						tierImage={'../../images/tierIcons/Silver.png'}
						tierName={'Silver Spire'}
						tierPointValue={'60,000 - 205,000'}
						tierDescription={`As a Silver Spire Member you'll be entitled to the privileges of our elevated earning members and earn a bonus 2.5% points for your activities and spending.`}
					/>
					<TierDescriptionCard
						tierImage={'../../images/tierIcons/Gold.png'}
						tierName={'Gold Spire'}
						tierPointValue={'205,000-1,050,000'}
						tierDescription={`Our Gold Spire membership level is reserved for our esteemed Spire members who receive a 5% bonus on top of their points earning programs. In addition, Gold Spire Members receive access to special events and exclusive discounts.`}
					/>
					<TierDescriptionCard
						tierImage={'../../images/tierIcons/Platinum.png'}
						tierName={'Platinum Spire'}
						tierPointValue={'1,050,000+'}
						tierDescription={`A very exclusive membership group that give you 10% bonus earnings points for your Spire transactions, and access to an exclusive club that has the benefits of all levels and VIP access to events and Gold Spire exclusive opportunities and recognition.`}
					/>
				</Box>
			</Paper>
		</Popup>
	);
};

export default LoyaltyTierPopup;
