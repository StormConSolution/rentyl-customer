import * as React from 'react';
import './AccountNavigationTile.scss';
import Paper from '../paper/Paper';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { Box } from '@bit/redsky.framework.rs.996';
import router from '../../utils/router';

interface AccountNavigationTileProps {
	imgSrc: 'id' | 'house' | 'medal' | 'credit';
	route: string;
	title: string;
}

const AccountNavigationTile: React.FC<AccountNavigationTileProps> = (props) => {
	function getImgSrc() {
		let imageSrc: string;
		switch (props.imgSrc) {
			case 'id':
				imageSrc = require('../../images/accountNavigationTileImages/id.png');
				break;
			case 'house':
				imageSrc = require('../../images/accountNavigationTileImages/house.png');
				break;
			case 'medal':
				imageSrc = require('../../images/accountNavigationTileImages/medal.png');
				break;
			case 'credit':
				imageSrc = require('../../images/accountNavigationTileImages/credit.png');
				break;
		}
		return imageSrc;
	}

	return (
		<Paper
			className={'rsAccountNavigationTile'}
			boxShadow
			borderRadius={'20px'}
			padding={'38px 24px 24px'}
			onClick={() => {
				router.navigate(props.route).catch(console.error);
			}}
		>
			<img src={getImgSrc()} alt={'Account Tile Img'} />
			<Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mt={18}>
				<Label variant={'customSeven'}>{props.title}</Label>
				<Icon iconImg={'icon-chevron-right'} size={17} />
			</Box>
		</Paper>
	);
};

export default AccountNavigationTile;
