import { Box } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label';
import React from 'react';
import './AccommodationSearchDetailCard.scss';

export interface AccommodationStat {
	label: string;
	datum: string | number;
}

export interface AccommodationSearchDetailCardProps {
	amenityIconNames: Array<string>;
	stats: Array<AccommodationStat>;
	className?: string;
}

const AccommodationSearchDetailCard: React.FC<AccommodationSearchDetailCardProps> = (props) => {
	function renderAmenityIcons(iconPaths: Array<string>): Array<JSX.Element> {
		return iconPaths.map((icon) => <Icon iconImg={icon} />);
	}

	function renderStats(stats: Array<AccommodationStat>): Array<JSX.Element> {
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
		<Box className={`rsAccommodationSearchDetailCard ${props.className || ''}`}>
			{!!props.amenityIconNames.length && (
				<Box className="amenityIcons">{renderAmenityIcons(props.amenityIconNames)}</Box>
			)}
			<Box className="stats">{renderStats(props.stats)}</Box>
		</Box>
	);
};

export default AccommodationSearchDetailCard;
