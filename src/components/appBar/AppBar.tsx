import React, { useEffect, useRef, useState } from 'react';
import './AppBar.scss';
import { Box, Link, popupController } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import NavDrawer from '../../popups/navDrawer/NavDrawer';
import useWindowScrollChange from '../../customHooks/useWindowScrollChange';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import router from '../../utils/router';
import SigninPopup from '../../popups/signin/SigninPopup';

const AppBar: React.FC = () => {
	const appBarRef = useRef<HTMLElement>(null);
	const company = useRecoilValue<Api.Company.Res.GetCompanyAndClientVariables>(globalState.company);
	const user = useRecoilValue<Api.User.Res.Detail | undefined>(globalState.user);
	const [showSlideOutMenu, setShowSlideOutMenu] = useState<boolean>(false);
	const [addWhiteBackground, setAddWhiteBackground] = useState<boolean>(false);
	let scrollDirection = useWindowScrollChange();
	const addWhiteBackgroundPagesUrl: string[] = ['/account', '/destination/details'];

	useEffect(() => {
		let id = router.subscribeToAfterRouterNavigate(() => {
			let url = window.location.href;
			for (let i in addWhiteBackgroundPagesUrl) {
				if (url.includes(addWhiteBackgroundPagesUrl[i])) {
					setAddWhiteBackground(true);
					break;
				} else {
					setAddWhiteBackground(false);
				}
			}
		});

		return () => {
			router.unsubscribeFromAfterRouterNavigate(id);
		};
	}, []);

	return (
		<div
			ref={appBarRef}
			className={`rsAppBar ${scrollDirection === 'DOWN' && 'hide'} ${addWhiteBackground ? 'white' : ''}`}
		>
			<Link path={'/'} className={'logoContainer'}>
				<img src={company.wideLogoUrl} alt={company.name} width={'166px'} className={'logo'} />
			</Link>

			<Box display={'flex'} alignItems={'center'} className={'menuContainer'}>
				<Icon
					iconImg={'icon-hamburger-menu'}
					size={16}
					color={'#767676'}
					onClick={() => {
						document.getElementsByTagName('body')[0].style.overflow = 'hidden';
						setShowSlideOutMenu(true);
					}}
				/>
				<Icon
					iconImg={'icon-account-icon'}
					size={29}
					color={'#00000029'}
					onClick={() => {
						if (!user) {
							popupController.open(SigninPopup);
						} else {
							router.navigate('/account').catch(console.error);
						}
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
