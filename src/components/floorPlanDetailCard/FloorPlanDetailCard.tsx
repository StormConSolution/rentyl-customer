import { Box } from '@bit/redsky.framework.rs.996';
import React, { useEffect, useState } from 'react';
import './FloorPlanDetailCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import LabelButton from '../labelButton/LabelButton';
import LabelRadioButton from '../labelRadioButton/LabelRadioButton';
import Select from '../Select/Select';

export interface FloorPlanDetailCardProps {
	accommodationName: string;
	layout: Api.AccommodationLayout.Details[];
}

const FloorPlanDetailCard: React.FC<FloorPlanDetailCardProps> = (props) => {
	const [selectedLayout, setSelectedLayout] = useState<Api.AccommodationLayout.Details>();
	const [selectedRoom, setSelectedRoom] = useState<Model.AccommodationLayoutRoom | undefined>();
	const size = useWindowResizeChange();

	function renderTabs() {
		let firstRun = true;
		return props.layout.map((item, index) => {
			if (!selectedLayout && firstRun) {
				setSelectedLayout(item);
				firstRun = false;
			}
			if (!selectedLayout) return '';
			return (
				<LabelButton
					key={item.id}
					look={'none'}
					variant={'button'}
					className={`tab ${selectedLayout.id === item.id ? 'selected' : ''}`}
					label={item.title}
					onClick={() => {
						setSelectedLayout(item);
						setSelectedRoom(undefined);
					}}
				/>
			);
		});
	}

	function renderMobileOptions() {
		let firstRun = true;
		return props.layout.map((item, index) => {
			if (!selectedLayout && firstRun) {
				setSelectedLayout(item);
				firstRun = false;
			}
			if (!selectedLayout) return { value: 0, text: '', selected: false };
			return {
				value: item.id,
				text: item.title,
				selected: selectedLayout.id === item.id
			};
		});
	}

	function renderRoomRadioButtons() {
		if (!selectedLayout) return '';
		let firstRun = true;

		return selectedLayout.rooms.map((item) => {
			if (firstRun && !selectedRoom) {
				setSelectedRoom(item);
				firstRun = false;
			}
			if (!selectedRoom) return '';
			return (
				<LabelRadioButton
					key={Math.floor(Math.random() * 1000)}
					radioName={'layout'}
					value={item.title}
					checked={selectedRoom.id === item.id}
					text={item.title}
					onSelect={(value) => {
						setSelectedRoom(item);
					}}
				/>
			);
		});
	}

	function renderRoomDescriptions() {
		if (!selectedRoom) return '';
		return (
			<div className={'floorPlanRoomDescriptionContent'}>
				<Label variant="h4">{selectedRoom.title}</Label>
				<Label variant="body2">{selectedRoom.description}</Label>
			</div>
		);
	}

	return (
		<Box
			className={'rsFloorPlanDetailCard '}
			display={'flex'}
			justifyContent={'center'}
			alignItems={'center'}
			flexWrap={'wrap'}
		>
			<Box className={'floorPlanDetails'} marginRight={'170px'}>
				<Label variant="h1">{props.accommodationName} Layout</Label>
				{size === 'small' ? (
					<Select
						onChange={(value) => {
							let newSelected = props.layout.find((item) => {
								return value === item.id;
							});
							setSelectedLayout(newSelected);
							setSelectedRoom(undefined);
						}}
						options={renderMobileOptions()}
					/>
				) : (
					<Box display={'flex'}>{renderTabs()}</Box>
				)}
				<Box className="radioHolder">{renderRoomRadioButtons()}</Box>
				{renderRoomDescriptions()}
			</Box>
			<Box className={'layoutImg'}>
				<img src={selectedLayout?.media.urls.large} />
			</Box>
		</Box>
	);
};

export default FloorPlanDetailCard;
