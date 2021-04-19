import React from 'react';
import './PointsOrLogin.scss';
import Label from '@bit/redsky.framework.rs.label';
import LabelLink from '../labelLink/LabelLink';
import useLoginState from '../../customHooks/useLoginState';

interface PointsOrLoginProps {
	className?: string;
	user: Api.User.Res.Get | undefined;
}

const PointsOrLogin: React.FC<PointsOrLoginProps> = (props) => {
	const loginStatus = useLoginState();

	function renderPointsOrLoginButton() {
		console.log('user', loginStatus);
		if (props.user) {
			return (
				<div className={'availablePendingPointsContainer'}>
					<div className={'availablePointsContainer'}>
						<Label variant={'h4'}>Available Points</Label>
						<Label className={'availablePointsNumber'} variant={'h1'}>
							{props.user.availablePoints}
						</Label>
					</div>
					<div className={'pendingPointsContainer'}>
						<Label variant={'h4'}>Points Pending</Label>
						<Label className={'pendingPointsNumber'} variant={'h1'}>
							951
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

	return <div className={`rsPointsOrLogin ${props.className || ''}`}>{renderPointsOrLoginButton()}</div>;
};

export default PointsOrLogin;
