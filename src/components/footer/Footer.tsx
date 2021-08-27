import * as React from 'react';
import './Footer.scss';
import Label from '@bit/redsky.framework.rs.label';
import Icon from '@bit/redsky.framework.rs.icon';
import { Box, Link } from '@bit/redsky.framework.rs.996';
import router from '../../utils/router';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';

export interface FooterLink {
	text: string;
	path: string;
}

interface FooterProps {
	links: FooterLink[];
}

const Footer: React.FC<FooterProps> = (props) => {
	const company = useRecoilValue<Api.Company.Res.GetCompanyAndClientVariables>(globalState.company);

	useEffect(() => {
		let id = router.subscribeToBeforeRouterNavigate(() => {
			setTimeout(() => {
				window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
			}, 300);
		});
		return () => {
			router.unsubscribeFromBeforeRouterNavigate(id);
		};
	}, []);

	function renderLinks(links: FooterLink[]) {
		return links.map((link: FooterLink, index: number) => {
			return (
				<Link
					path={link.path}
					key={index}
					onClick={() => {
						router.navigate(link.path).catch(console.error);
					}}
				>
					{link.text}
				</Link>
			);
		});
	}

	return (
		<Box className={'rsFooter'}>
			<Box className={'footerNavigation'} display={'grid'}>
				<img
					src={company.squareLogoUrl}
					alt={company.name}
					onClick={() => {
						router.navigate('/').catch(console.error);
					}}
				/>
				<Box display={'grid'}>{renderLinks(props.links)}</Box>
			</Box>
			<Box className="copyright" display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
				<Label variant={'caption'}>Spire &#169; {new Date().getFullYear()}, all rights reserved.</Label>
				<Box className={'socialMediaLinks'} display={'flex'}>
					<Icon
						iconImg={'icon-facebook'}
						size={21}
						color={'#004B98'}
						cursorPointer
						onClick={() => {
							console.log('Navigating to facebook');
						}}
					/>
					<Icon
						iconImg={'icon-Twitter'}
						size={21}
						color={'#004B98'}
						cursorPointer
						onClick={() => {
							console.log('Navigating to Twitter');
						}}
					/>
					<Icon
						iconImg={'icon-youtube'}
						size={21}
						color={'#004B98'}
						cursorPointer
						onClick={() => {
							console.log('Navigating to youtube');
						}}
					/>
					<Icon
						iconImg={'icon-instagram'}
						size={21}
						color={'#004B98'}
						cursorPointer
						onClick={() => {
							console.log('Navigating to instagram');
						}}
					/>
				</Box>
			</Box>
		</Box>
	);
};

export default Footer;
