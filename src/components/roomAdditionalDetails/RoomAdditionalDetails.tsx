import React from 'react';
import './RoomAdditionalDetails.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

interface roomAdditionalDetailsProps {
	className?: string;
	typeOfRoom: string;
	description: string;
	detailList: string[];
}

const RoomAdditionalDetails: React.FC<roomAdditionalDetailsProps> = (props) => {
	const size = useWindowResizeChange();

	function renderListItems() {
		return props.detailList.map((item, index) => {
			return (
				<li>
					<Label key={index} className={'listItems'} variant={'body2'}>
						{item}
					</Label>
				</li>
			);
		});
	}
	return (
		<Box className={`rsRoomAdditionalDetails ${props.className || ''}`}>
			<Label className={'additionalDetailsTitle'} variant={size === 'small' ? 'h2' : 'h1'}>
				Additional {props.typeOfRoom} Details
			</Label>
			<Label className={size === 'small' ? 'description mobile' : 'description'} variant={'body2'}>
				{props.description}
			</Label>
			<ul className={'list'}>{renderListItems()}</ul>
		</Box>
	);
};
export default RoomAdditionalDetails;
