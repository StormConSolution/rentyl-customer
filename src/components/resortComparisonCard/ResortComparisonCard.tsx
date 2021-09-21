import React, { useEffect, useState } from 'react';
import './ResortComparisonCard.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Icon from '@bit/redsky.framework.rs.icon';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import ComparisonCardPopup, { ComparisonCardPopupProps } from '../../popups/comparisonCardPopup/ComparisonCardPopup';
import Select from '@bit/redsky.framework.rs.select';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';

interface ResortComparisonCardProps {
	logo: string;
	title: string;
	roomTypes: { value: string | number; text: string | number; selected: boolean }[];
	onChange: (value: any) => void;
	onClose: () => void;
	popupOnClick?: (pinToFirst: boolean) => void;
	className?: string;
	selectedRoom: string | number;
}

const ResortComparisonCard: React.FC<ResortComparisonCardProps> = (props) => {
	const size = useWindowResizeChange();
	const [options, setOptions] = useState<{ value: string | number; label: string | number }[]>([]);
	const [roomTypeFormGroup, setRoomTypeFormGroup] = useState<RsFormGroup>(
		new RsFormGroup([new RsFormControl('roomValue', 0, [])])
	);

	useEffect(() => {
		setOptions(
			props.roomTypes.map((roomType) => {
				return { value: roomType.value, label: roomType.text };
			})
		);
	}, []);

	function renderDefaultValue() {
		if (props.roomTypes.length > 0) {
			let selected = props.roomTypes.filter((value) => value.selected);
			if (selected.length > 0) {
				return { value: selected[0].value, label: selected[0].text };
			}
		}
		return { value: 0, label: 'Select...' };
	}

	return size === 'small' ? (
		<div className={`rsResortComparisonCard ${props.className || ''}`}>
			<Box className={'topContent'}>
				<Icon
					className={'close'}
					iconImg={'icon-close'}
					onClick={props.onClose}
					size={14}
					color={'#004b98'}
					cursorPointer
				/>
				<Label className={'title'} variant={'h2'}>
					{props.title}
				</Label>
				<Label
					variant={'caption'}
					onClick={() => {
						popupController.open<ComparisonCardPopupProps>(ComparisonCardPopup, {
							logo: props.logo,
							title: props.title,
							roomTypes: options,
							onChange: props.onChange,
							onClose: props.onClose,
							popupOnClick: props.popupOnClick,
							control: roomTypeFormGroup.get('roomValue')
						});
					}}
				>
					Edit
				</Label>
			</Box>
		</div>
	) : (
		<div className={`rsResortComparisonCard ${props.className || ''}`}>
			<Box className={'topContent'} display={'flex'}>
				<img src={props.logo} alt={'resort logo'} width={'82px'} />
				<Label className={'title'} variant={'h2'}>
					{props.title}
				</Label>
				<Icon
					className={'close'}
					iconImg={'icon-close'}
					onClick={props.onClose}
					size={14}
					color={'#004b98'}
					cursorPointer
				/>
			</Box>
			<Box className={'bottomContent'} display={'flex'}>
				<Select
					control={roomTypeFormGroup.get('roomValue')}
					updateControl={(control) => {
						setRoomTypeFormGroup(roomTypeFormGroup.clone().update(control));
						props.onChange(roomTypeFormGroup.get('roomValue'));
					}}
					options={options}
					isClearable={true}
					menuPlacement={'top'}
				/>
			</Box>
		</div>
	);
};

export default ResortComparisonCard;
