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
import LoadingPage from '../../pages/loadingPage/LoadingPage';

interface ResortComparisonCardProps {
	destinationDetails: Misc.ComparisonCardInfo;
	handlePinToFirst?: (pinToFirst: boolean, comparisonId: number) => void;
}

const ResortComparisonCard: React.FC<ResortComparisonCardProps> = (props) => {
	const size = useWindowResizeChange();
	let waitToLoad = false;
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
		waitToLoad = true;
		setRoomTypeFormGroup(roomTypeFormGroup.clone().update(control));
		let newRecoilState = comparisonService.setSelectedAccommodation(
			props.destinationDetails.comparisonId || 0,
			control.value as number,
			recoilComparisonState
		);
		setRecoilComparisonState(newRecoilState);
		waitToLoad = false;
	}

	function handleOnClose() {
		let newComparisonItems = comparisonService.resortComparisonCardOnClose(
			props.destinationDetails,
			recoilComparisonState
		);
		setRecoilComparisonState(newComparisonItems);
	}

	return waitToLoad ? (
		<LoadingPage />
	) : (
		<div className={`rsResortComparisonCard`}>
			{size === 'small' && (
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
					<Label className={'title'} variant={'h2'} lineClamp={2} width={'120px'}>
						{destinationDetails.title}
					</Label>
					<Label
						variant={'caption'}
						onClick={() => {
							popupController.open<ComparisonCardPopupProps>(ComparisonCardPopup, {
								logo: destinationDetails.logo,
								title: destinationDetails.title,
								roomTypes: destinationDetails.roomTypes,
								comparisonId: destinationDetails.comparisonId || 0,
								updateControl: updateControl,
								onClose: handleOnClose,
								popupOnClick: props.handlePinToFirst,
								control: roomTypeFormGroup.get('roomValue')
							});
						}}
					>
						Edit
					</Label>
				</Box>
			)}
			{size !== 'small' && (
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
			)}
			{size !== 'small' && (
				<Box className={'bottomContent'} display={'flex'}>
					<Select
						control={roomTypeFormGroup.get('roomValue')}
						updateControl={updateControl}
						options={destinationDetails.roomTypes}
						isClearable={false}
						menuPlacement={'top'}
					/>
				</Box>
			)}
		</div>
	);
};

export default ResortComparisonCard;
