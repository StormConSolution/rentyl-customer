import React from 'react';
import { Box } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';

export interface GuestCounterProps {
	minCount: number;
	title: string;
}

const GuestCounter: React.FC<GuestCounterProps> = (props) => {
	return (
		<Box className={'rsGuestCounter'}>
			<Icon iconImg={''}>-</Icon>
			<Icon iconImg={'icon-plus'} />
		</Box>
	);
};

export default GuestCounter;
