import { Box } from '@bit/redsky.framework.rs.996';
import React, { useEffect, useState } from 'react';
import './FloorPlanDetailCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import LabelButton from '../labelButton/LabelButton';
import LabelRadioButton from '../labelRadioButton/LabelRadioButton';
import Img from '@bit/redsky.framework.rs.img';
import Select, { OptionType } from '@bit/redsky.framework.rs.select';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';

export interface FloorPlanDetailCardProps {
	accommodationName: string;
	layout: Api.AccommodationLayout.Details[];
}

const FloorPlanDetailCard: React.FC<FloorPlanDetailCardProps> = (props) => {
	const size = useWindowResizeChange();
	const [selectedLayout, setSelectedLayout] = useState<Api.AccommodationLayout.Details>();
	const [selectedRoom, setSelectedRoom] = useState<Model.AccommodationLayoutRoom | undefined>();
	const [options, setOptions] = useState<OptionType[]>([]);
	const [roomTypeFormGroup, setRoomTypeFormGroup] = useState<RsFormGroup>(
		new RsFormGroup([new RsFormControl('roomValue', '', [])])
	);

	useEffect(() => {
		let newOptions = props.layout.map((item, index) => {
			return {
				value: item.id,
				label: item.title
			};
		});
		setOptions(newOptions);
		let updateRoomType = roomTypeFormGroup.getCloneDeep('roomValue');
		updateRoomType.value = newOptions[0]?.value || 0;
		setRoomTypeFormGroup(roomTypeFormGroup.clone().update(updateRoomType));
	}, []);

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

	function renderRoomRadioButtons() {
		if (!selectedLayout) return '';
		let firstRun = true;

		return selectedLayout.rooms.map((item, index) => {
			if (firstRun && !selectedRoom) {
				setSelectedRoom(item);
				firstRun = false;
			}
			if (!selectedRoom) return '';
			return (
				<LabelRadioButton
					key={index}
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
						control={roomTypeFormGroup.get('roomValue')}
						updateControl={(control) => {
							setRoomTypeFormGroup(roomTypeFormGroup.clone().update(control));
							let newLayout = props.layout.find((item) => {
								return control.value === item.id;
							});
							setSelectedLayout(newLayout);
							setSelectedRoom(undefined);
						}}
						options={options}
					/>
				) : (
					<Box display={'flex'}>{renderTabs()}</Box>
				)}
				<Box className="radioHolder">{renderRoomRadioButtons()}</Box>
				{renderRoomDescriptions()}
			</Box>
			<Box className={'layoutImg'}>
				<Img
					src={selectedLayout?.media.urls.imageKit || ''}
					alt={'Layout Image'}
					width={335}
					height={500}
					srcSetSizes={[400]}
				/>
			</Box>
		</Box>
	);
};

export default FloorPlanDetailCard;
