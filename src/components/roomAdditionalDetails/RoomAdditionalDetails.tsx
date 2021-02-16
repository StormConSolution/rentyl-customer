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

	function displayListItems() {
		const listElements: JSX.Element[] = [];
		for (let i in props.detailList) {
			listElements.push(
				<li>
					<Label className={'additionalDetailsListItems'} variant={'body2'}>
						{props.detailList[i]}
					</Label>
				</li>
			);
		}
		return listElements;
	}
	return (
		<Box className={'rsRoomAdditionalDetails'}>
			<Label className={'additionalDetailsTitle'} variant={size === 'small' ? 'h2' : 'h1'}>
				Additional {props.typeOfRoom} Details
			</Label>
			<Label
				className={size === 'small' ? 'additionalDetailsMobileDescription' : 'additionalDetailsDescription'}
				variant={'body2'}
			>
				{props.description}
			</Label>
			<ul className={'additionalDetailsList'}>{displayListItems()}</ul>
		</Box>
	);
};
export default RoomAdditionalDetails;
