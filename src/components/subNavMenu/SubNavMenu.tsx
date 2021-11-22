import * as React from 'react';
import './SubNavMenu.scss';
import { useEffect } from 'react';
import useWindowScrollChange from '../../customHooks/useWindowScrollChange';
import Button from '@bit/redsky.framework.rs.button';
import Icon from '@bit/redsky.framework.rs.icon';
import router from '../../utils/router';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';

interface SubNavMenuProps {
	title: string;
}

const SubNavMenu: React.FC<SubNavMenuProps> = (props) => {
	const scrollDirection = useWindowScrollChange();
	const size = useWindowResizeChange();
	const lastUrlPath = useRecoilValue<string>(globalState.lastNavigationPath);

	useEffect(() => {}, []);

	function getAppBarHeight() {
		let appBar = document.querySelector('.rsAppBar');
		if (!appBar) return '0px';
		else return appBar.scrollHeight + 'px';
	}

	return (
		<div className={`rsSubNavMenu ${scrollDirection === 'DOWN' && 'moveUp'}`} style={{ top: getAppBarHeight() }}>
			<Button
				look={'none'}
				onClick={() => {
					router.navigate(lastUrlPath).catch(console.error);
				}}
			>
				<Icon iconImg={'icon-chevron-left'} size={size === 'small' ? 13 : 20} />
			</Button>
			<Label ml={size === 'small' ? 20 : 33} variant={size === 'small' ? 'customTen' : 'customNine'}>
				{props.title}
			</Label>
		</div>
	);
};

export default SubNavMenu;
