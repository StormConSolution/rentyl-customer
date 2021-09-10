import React, { useEffect, useState } from 'react';
import './ResortComparisonCard.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Icon from '@bit/redsky.framework.rs.icon';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
// import Select from '../Select/Select';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import ComparisonCardPopup, { ComparisonCardPopupProps } from '../../popups/comparisonCardPopup/ComparisonCardPopup';
import Select, { OptionType } from '@bit/redsky.framework.rs.select';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';

interface ResortComparisonCardProps {
	logo: string;
	title: string;
	roomTypes: { value: string | number; text: string | number; selected: boolean }[];
	onChange: (value: any) => void;
	onClose: () => void;
	popupOnClick?: (pinToFirst: boolean) => void;
	className?: string;
	placeHolder?: string;
}

const ResortComparisonCard: React.FC<ResortComparisonCardProps> = (props) => {
	const size = useWindowResizeChange();
	const [options, setOptions] = useState<{ value: string | number; label: string | number }[]>([]);
	const [defaultValue, setDefaultValue] = useState<OptionType>();
	const [roomTypeFormGroup] = useState<RsFormGroup>(new RsFormGroup([new RsFormControl('roomValue', 0, [])]));

	useEffect(() => {
		let optionsArray: { value: string | number; label: string | number }[] = [];
		props.roomTypes.map((roomType) => {
			optionsArray.push({ value: roomType.value, label: roomType.text });
			setOptions(optionsArray);
		});
	}, []);

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
							roomTypes: props.roomTypes,
							onChange: props.onChange,
							onClose: props.onClose,
							popupOnClick: props.popupOnClick
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
					updateControl={(value) => {
						props.onChange(value);
						console.log('value', value.value);
					}}
					options={options}
					isClearable={true}
					menuPlacement={'top'}
					// value={}
				/>
			</Box>
		</div>
	);
};

export default ResortComparisonCard;
