import React, { useRef, useState } from 'react';
import './AppBar.scss';
import { Box, Link } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import NavDrawer from '../../popups/navDrawer/NavDrawer';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import useWindowScrollChange from '../../customHooks/useWindowScrollChange';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import { isRouteUnauthorized } from '../../utils/utils';
import LinkButton from '../linkButton/LinkButton';

const AppBar: React.FC = () => {
	const appBarRef = useRef<HTMLElement>(null);
	const company = useRecoilValue<Api.Company.Res.GetCompanyAndClientVariables>(globalState.company);
	const [showSlideOutMenu, setShowSlideOutMenu] = useState<boolean>(false);
	const size = useWindowResizeChange();
	let scrollDirection = useWindowScrollChange();

	return (
		<div ref={appBarRef} className={`rsAppBar ${scrollDirection === 'DOWN' && 'hide'}`}>
			<Link path={'/'}>
				<img src={company.wideLogoUrl} alt={company.name} width={'111px'} />
			</Link>

			<Box display={'flex'} alignItems={'center'}>
				{!size && !isRouteUnauthorized('/about-spire') && (
					<LinkButton
						yellow
						label={'Learn about spire loyalty'}
						path={'/about-spire'}
						look={'containedPrimary'}
					/>
				)}
				<Icon
					iconImg={'icon-hamburger-menu'}
					color={'#003A76'}
					size={21}
					cursorPointer
					onClick={() => {
						document.getElementsByTagName('body')[0].style.overflow = 'hidden';
						setShowSlideOutMenu(true);
					}}
				/>
			</Box>

			<NavDrawer
				isOpened={showSlideOutMenu}
				onClose={() => {
					document.getElementsByTagName('body')[0].style.overflow = '';
					setShowSlideOutMenu(false);
				}}
			/>
		</div>
	);
};

export default AppBar;
