import { Box } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label';
import React from 'react';
import './RoomSearchDetailCard.scss';

export interface RoomStat {
	label: string;
	datum: string | number;
}

export interface RoomSearchDetailCardProps {
	amenityIconNames: Array<string>;
	stats: Array<RoomStat>;
}

const RoomSearchDetailCard: React.FC<RoomSearchDetailCardProps> = (props) => {
	function renderAmenityIcons(iconPaths: Array<string>): Array<JSX.Element> {
		return iconPaths.map((icon) => <Icon iconImg={icon} />);
	}

	function renderRoomStats(stats: Array<RoomStat>): Array<JSX.Element> {
		return stats.map((stat) => {
			return (
				<Box className="roomStat">
					<Label variant="caption">{stat.label}</Label>
					<Label variant="body2">{stat.datum}</Label>
				</Box>
			);
		});
	}

	return (
		<Box className="rsRoomSearchDetailCard">
			{!!props.amenityIconNames.length && (
				<Box className="amenityIcons">{renderAmenityIcons(props.amenityIconNames)}</Box>
			)}
			<Box className="stats">{renderRoomStats(props.stats)}</Box>
		</Box>
	);
};

export default RoomSearchDetailCard;
