import React from 'react';
import './PointsOrLogin.scss';
import Label from '@bit/redsky.framework.rs.label';
import LabelLink from '../labelLink/LabelLink';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import { StringUtils } from '../../utils/utils';

interface PointsOrLoginProps {
	className?: string;
}

const PointsOrLogin: React.FC<PointsOrLoginProps> = (props) => {
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
	function renderPointsOrLogin() {
		if (user) {
			return (
				<div className={'availablePendingPointsContainer'}>
					<div className={'availablePointsContainer'}>
						<Label variant={'h4'}>Available Points</Label>
						<Label className={'availablePointsNumber'} variant={'h1'}>
							{StringUtils.addCommasToNumber(user.availablePoints)}
						</Label>
					</div>
					<div className={'pendingPointsContainer'}>
						<Label variant={'h4'}>Points Pending</Label>
						<Label className={'pendingPointsNumber'} variant={'h1'}>
							{StringUtils.addCommasToNumber(user.pendingPoints)}
						</Label>
					</div>
				</div>
			);
		} else {
			return (
				<div className={'signinContainer'}>
					<LabelLink className={'signinLink'} path={'/signin'} label={'Sign in'} variant={'body1'} />
					<Label variant={'body1'}>&nbsp;to redeem your points.</Label>
				</div>
			);
		}
	}

	return <div className={`rsPointsOrLogin ${props.className || ''}`}>{renderPointsOrLogin()}</div>;
};

export default PointsOrLogin;
