import { Box } from '@bit/redsky.framework.rs.996';
import React, { useState } from 'react';
import './FloorPlanDetailCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

export interface FloorPlanDetailCardProps {
	accomodationName: string;
	rooms: FloorPlanRoomDescriptionProp[];
}

export interface FloorPlanRoomDescriptionProp {
	name: string;
	description: string;
}

const FloorPlanDetailCard: React.FC<FloorPlanDetailCardProps> = (props) => {
	const [activeRoomIndex, setActiveRoomIndex] = useState<number>(0);
	const size = useWindowResizeChange();

	function renderRoomRadioButtons(): JSX.Element[] {
		return props.rooms.map((room, index) => {
			return (
				<div className="floorPlanRoomDescriptionRadio" key={index}>
					<input
						type="radio"
						id={'floorPlanRoom' + index}
						name="floorPlanRoom"
						value={index}
						onClick={() => setActiveRoomIndex(index)}
						checked={activeRoomIndex === index}
					/>
					<label htmlFor={'floorplanroom' + index}>{room.name}</label>
				</div>
			);
		});
	}

	function renderRoomDescriptions(): JSX.Element[] {
		return props.rooms.map((room, index) => {
			return (
				<div className={'floorPlanRoomDescriptionContent' + (activeRoomIndex === index ? ' active' : '')}>
					<Label variant="h4">{room.name}</Label>
					<Label variant="body2">{room.description}</Label>
				</div>
			);
		});
	}

	return (
		<Box className={'rsFloorPlanDetailCard ' + (size === 'small' ? 'small' : '')}>
			<Label variant="h1">{props.accomodationName} Layout</Label>
			<Box className="radioHolder">{renderRoomRadioButtons()}</Box>
			<Box>{renderRoomDescriptions()}</Box>
		</Box>
	);
};

export default FloorPlanDetailCard;
