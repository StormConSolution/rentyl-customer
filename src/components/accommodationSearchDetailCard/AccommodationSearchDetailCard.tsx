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
	stats: Array<AccommodationStat>;
	className?: string;
}

const AccommodationSearchDetailCard: React.FC<AccommodationSearchDetailCardProps> = (props) => {
	function renderStats(stats: Array<AccommodationStat>): Array<JSX.Element> {
		return stats.map((stat, index) => {
			return (
				<Box className="roomStat" key={index}>
					<Label variant="caption">{stat.label}</Label>
					<Label variant="body2">{stat.datum}</Label>
				</Box>
			);
		});
	}

	return (
		<Box className={`rsAccommodationSearchDetailCard ${props.className || ''}`}>
			<Box className="stats">{renderStats(props.stats)}</Box>
		</Box>
	);
};

export default AccommodationSearchDetailCard;
