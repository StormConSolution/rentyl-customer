import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import './AccountOverview.scss';
import Paper from '../../components/paper/Paper';
import Label from '@bit/redsky.framework.rs.label';
import Box from '../../components/box/Box';
import { addCommasToNumber } from '../../utils/utils';
import LabelLink from '../../components/labelLink/LabelLink';
import Icon from '@bit/redsky.framework.rs.icon';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import useLoginState, { LoginStatus } from '../../customHooks/useLoginState';

interface AccountOverviewProps {
	isOpen: boolean;
	onToggle: () => void;
	onClose: () => void;
}

const AccountOverview: React.FC<AccountOverviewProps> = (props) => {
	const userService = serviceFactory.get<UserService>('UserService');
	const popupRef = useRef<HTMLElement>(null);
	const [user, setUser] = useState<Api.User.Res.Get>();
	const loginStatus = useLoginState();

	useEffect(() => {
		if (loginStatus === LoginStatus.LOGGED_IN) setUser(userService.getCurrentUser());
		function handleClickOutside(event: any) {
			if (popupRef && popupRef.current && !popupRef.current.contains(event.target)) {
				document.getElementsByTagName('body')[0].style.overflow = '';
				props.onClose();
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [loginStatus]);

	/*
		This Component needs to have an end point written to get back the correct data. As of right now we are blocked.
		We need to hook this up to use the user id, once logged in, to go and fetch their upcoming reservation. There is
		a lot of backend info that is still needing to be figured out.
	*/

	return (
		<div ref={popupRef} className={`rsAccountOverview ${props.isOpen ? 'opened' : ''}`}>
			<Paper height={'fit-content'} backgroundColor={'#FCFBF8'} padding={'20px 18px 17px'}>
				<Label variant={'h4'}>Account Overview</Label>
				<Box display={'flex'} marginBottom={'10px'}>
					<Label variant={'h2'}>{addCommasToNumber(user?.availablePoints)}</Label>
					<Label variant={'caption'}>
						CURRENT
						<br /> POINTS
					</Label>
				</Box>
				<LabelLink
					path={`/account/personal-info`}
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
