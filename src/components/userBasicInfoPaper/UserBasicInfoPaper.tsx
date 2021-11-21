import * as React from 'react';
import './UserBasicInfoPaper.scss';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import UserBasicInfoPaperMobile from './userBasicInfoPaperMobile/UserBasicInfoPaperMobile';
import UserBasicInfoPaperResponsive from './userBasicInfoPaperResponsive/UserBasicInfoPaperResponsive';

interface UserBasicInfoPaperProps {
	userData: Api.User.Res.Detail;
	onLogOut: () => void;
}

const UserBasicInfoPaper: React.FC<UserBasicInfoPaperProps> = (props) => {
	const size = useWindowResizeChange();
	return size === 'small' ? (
		<UserBasicInfoPaperMobile userData={props.userData} onLogOut={props.onLogOut} />
	) : (
		<UserBasicInfoPaperResponsive userData={props.userData} onLogOut={props.onLogOut} />
	);
};

export default UserBasicInfoPaper;
