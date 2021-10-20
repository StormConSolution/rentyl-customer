import React from 'react';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import UserPointStatusBarMobile from './userPointStatusBarMobile/UserPointStatusBarMobile';
import UserPointStatusBarResponsive from './userPointStatusBarResponsive/UserPointStatusBarResponsive';

interface UserPointStatusBarProps {
	className?: string;
}

const UserPointStatusBar: React.FC<UserPointStatusBarProps> = (props) => {
	const size = useWindowResizeChange();

	return size === 'small' ? (
		<UserPointStatusBarMobile className={props.className} />
	) : (
		<UserPointStatusBarResponsive className={props.className} />
	);
};

export default UserPointStatusBar;
