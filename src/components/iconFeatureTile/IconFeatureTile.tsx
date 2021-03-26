import * as React from 'react';
import './IconFeatureTile.scss';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label';
import Paper from '../paper/Paper';

interface IconFeatureTileProps {
	title: string;
	icon: string;
}

const IconFeatureTile: React.FC<IconFeatureTileProps> = (props) => {
	return (
		<Paper className={'rsIconFeatureTile'} height={'90px'} width={'344px'} borderRadius={'4px'} padding={'0 25px'}>
			<Icon iconImg={props.icon} size={35} />
			<Label variant={'h2'}>{props.title}</Label>
		</Paper>
	);
};

export default IconFeatureTile;
