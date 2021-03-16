import * as React from 'react';
import './AccountOverview.scss';
import Paper from '../../components/paper/Paper';
import Label from '@bit/redsky.framework.rs.label';
import Box from '../../components/box/Box';
import { addCommasToNumber } from '../../utils/utils';
import LabelLink from '../../components/labelLink/LabelLink';
import Icon from '@bit/redsky.framework.rs.icon';

interface AccountOverviewProps {
	isOpen: boolean;
	onToggle: () => void;
}

const AccountOverview: React.FC<AccountOverviewProps> = (props) => {
	/*
		This Component needs to have an end point written to get back the correct data. As of right now we are blocked.
		We need to hook this up to use the user id, once logged in, to go and fetch their upcoming reservation. There is
		a lot of backend info that is still needing to be figured out.
	*/

	return (
		<div className={`rsAccountOverview ${props.isOpen ? 'opened' : ''}`}>
			<Paper height={'fit-content'} backgroundColor={'#FCFBF8'} padding={'20px 18px 17px'}>
				<Label variant={'h4'}>Account Overview</Label>
				<Box display={'flex'} marginBottom={'10px'}>
					<Label variant={'h2'}>{addCommasToNumber(15202)}</Label>
					<Label variant={'caption'}>
						CURRENT
						<br /> POINTS
					</Label>
				</Box>
				<LabelLink
					path={'/'}
					externalLink={false}
					label={'My Account'}
					variant={'button'}
					iconRight={'icon-chevron-right'}
					iconSize={7}
				/>
				<hr />
				<Label variant={'h4'}>Upcoming Stay</Label>
				<Box display={'flex'}>
					<img src={require('../../images/FullLogo-StandardBlack.png')} alt={''} />
					<Label className={'yellow'} variant={'h4'}>
						6 bedroom villa
					</Label>
				</Box>
				<Box marginBottom={15}>
					<Label variant={'caption'}>Dates</Label>
					<Label variant={'body1'}>05/25/2020 - 05/31/2020</Label>
				</Box>
				<Box marginBottom={15}>
					<Label variant={'caption'}>Room Rate</Label>
					<Label variant={'body1'}>$250/per night</Label>
				</Box>
				<LabelLink
					path={'/'}
					externalLink={false}
					label={'View Booking Details'}
					variant={'button'}
					iconRight={'icon-chevron-right'}
					iconSize={7}
				/>
			</Paper>
			<Box className={'tab'} onClick={props.onToggle}>
				<Icon
					iconImg={'icon-chevron-left'}
					className={props.isOpen ? 'iconSpinDown' : 'iconSpinUp'}
					color={'#001933'}
				/>
			</Box>
		</div>
	);
};

export default AccountOverview;
