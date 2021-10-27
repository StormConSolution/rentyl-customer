import React, { useEffect, useState } from 'react';
import './ResortComparisonCard.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Icon from '@bit/redsky.framework.rs.icon';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import ComparisonCardPopup, { ComparisonCardPopupProps } from '../../popups/comparisonCardPopup/ComparisonCardPopup';
import Select from '@bit/redsky.framework.rs.select';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';
import Img from '@bit/redsky.framework.rs.img';
import { useRecoilState } from 'recoil';
import globalState from '../../state/globalState';
import serviceFactory from '../../services/serviceFactory';
import ComparisonService from '../../services/comparison/comparison.service';

interface ResortComparisonCardProps {
	destinationDetails: Misc.ComparisonCardInfo;
}

const ResortComparisonCard: React.FC<ResortComparisonCardProps> = (props) => {
	const size = useWindowResizeChange();
	const comparisonService = serviceFactory.get<ComparisonService>('ComparisonService');
	const [recoilComparisonState, setRecoilComparisonState] = useRecoilState<Misc.ComparisonCardInfo[]>(
		globalState.destinationComparison
	);
	const [destinationDetails, setDestinationDetails] = useState<Misc.ComparisonCardInfo>(props.destinationDetails);
	const [roomTypeFormGroup, setRoomTypeFormGroup] = useState<RsFormGroup>(
		new RsFormGroup([new RsFormControl('roomValue', props.destinationDetails.selectedRoom, [])])
	);

	useEffect(() => {
		setDestinationDetails(props.destinationDetails);
	}, [props.destinationDetails, roomTypeFormGroup]);

	function updateControl(control: RsFormControl) {
		setRoomTypeFormGroup(roomTypeFormGroup.clone().update(control));
		let newRecoilState = comparisonService.setSelectedAccommodation(
			props.destinationDetails.comparisonId || 0,
			control.value as number,
			recoilComparisonState
		);
		setRecoilComparisonState(newRecoilState);
	}

	function handleOnClose() {
		let newComparisonItems = comparisonService.resortComparisonCardOnClose(
			props.destinationDetails,
			recoilComparisonState
		);
		setRecoilComparisonState(newComparisonItems);
	}

	return size === 'small' ? (
		<div className={`rsResortComparisonCard`}>
			<Box className={'topContent'}>
				<Icon
					className={'close'}
					iconImg={'icon-close'}
					onClick={handleOnClose}
					size={14}
					color={'#004b98'}
					cursorPointer
				/>
				<br />

				{destinationDetails.logo && destinationDetails.logo !== '' && (
					<div className={'imageContainer'}>
						<Img src={destinationDetails.logo} alt={'resort logo'} width={'95px'} height={'auto'} />
					</div>
				)}
				<Label
					variant={'caption'}
					onClick={() => {
						popupController.open<ComparisonCardPopupProps>(ComparisonCardPopup, {
							logo: destinationDetails.logo,
							title: destinationDetails.title,
							roomTypes: destinationDetails.roomTypes,
							updateControl: updateControl,
							onClose: handleOnClose,
							popupOnClick: (pinToFirst) => {
								// if (pinToFirst) pinAccommodationToFirstOfList(index);
							},
							control: roomTypeFormGroup.get('roomValue')
						});
					}}
				>
					Edit
				</Label>
			</Box>
		</div>
	) : (
		<div className={`rsResortComparisonCard`}>
			<Box className={'topContent'} display={'flex'}>
				{destinationDetails.logo && destinationDetails.logo !== '' && (
					<div className={'imageContainer'}>
						<Img src={destinationDetails.logo} alt={'resort logo'} width={'82px'} height={'auto'} />
					</div>
				)}
				<Label className={'title'} variant={'h2'} lineClamp={2}>
					{destinationDetails.title}
				</Label>
				<Icon
					className={'close'}
					iconImg={'icon-close'}
					onClick={handleOnClose}
					size={14}
					color={'#004b98'}
					cursorPointer
				/>
			</Box>
			<Box className={'bottomContent'} display={'flex'}>
				<Select
					control={roomTypeFormGroup.get('roomValue')}
					updateControl={updateControl}
					options={destinationDetails.roomTypes}
					isClearable={false}
					menuPlacement={'top'}
				/>
			</Box>
		</div>
	);
};

export default ResortComparisonCard;
