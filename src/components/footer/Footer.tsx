import * as React from 'react';
import './Footer.scss';
import Box from '../box/Box';
import Label from '@bit/redsky.framework.rs.label';
import Icon from '@bit/redsky.framework.rs.icon';
import { Link } from '@bit/redsky.framework.rs.996';

export interface FooterLink {
	text: string;
	path: string;
}

interface FooterProps {
	links: FooterLink[];
}

const Footer: React.FC<FooterProps> = (props) => {
	function renderSocialMedia() {
		return (
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
		);
	}
	function renderLinks(links: FooterLink[]) {
		return links.map((link: FooterLink) => {
			return <Link path={link.path}>{link.text}</Link>;
		});
	}

	return (
		<Box className={'rsFooter'}>
			<Box className="footerNavigation" display={'grid'}>
				<img src={require('../../images/spire-logo.png')} alt={'Company Logo'} />
				<Box display={'grid'}>{renderLinks(props.links)}</Box>
			</Box>
			<Box className="copyright" display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
				<Label variant={'caption'}>Spire &#169; 2020, all rights reserved.</Label>
				{renderSocialMedia()}
			</Box>
		</Box>
	);
};

export default Footer;
