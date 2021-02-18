import { Box } from '@bit/redsky.framework.rs.996';
import React, { useState } from 'react';
import 'FloorPlanDetailCard.scss';
import Label from '@bit/redsky.framework.rs.label';

export interface FloorPlanDetailCardProps {
	accomodationName: string;
	rooms: Array<FloorPlanRoomDescriptionProp>;
}

export interface FloorPlanRoomDescriptionProp {
	name: string;
	description: string;
}

const FloorPlanDetailCard: React.FC<FloorPlanDetailCardProps> = (props) => {
	const [activeRoomIndex, setActiveRoomIndex] = useState<number>(0);

	function renderRoomRadioButtons(): JSX.Element[] {
		return props.rooms.map((room, index) => {
			return (
				<div className="floorPlanRoomDescriptionRadio">
					<input
						type="radio"
						id={'floorplanroom' + index}
						value={index}
						onClick={() => setActiveRoomIndex(index)}
					/>
					<label for={'floorplanroom' + index}>{room.name}</label>
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
		<Box className="rsFloorPlanDetailCard">
			<Label variant="h1">{props.accomodationName} Layout</Label>
			<Box>{renderRoomRadioButtons()}</Box>
			<Box>{renderRoomDescriptions()}</Box>
		</Box>
	);
};

export default FloorPlanDetailCard;
