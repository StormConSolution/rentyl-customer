import React, { useEffect, useState } from 'react';
import './ResortComparisonCard.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Icon from '@bit/redsky.framework.rs.icon';
import { Box, popupController } from '@bit/redsky.framework.rs.996';
import Select from '../Select/Select';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import ComparisonCardPopup, { ComparisonCardPopupProps } from '../../popups/comparisonCardPopup/ComparisonCardPopup';
// import Select from '@bit/redsky.framework.rs.select';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';

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
	const [value, setValue] = useState<string | number>(1);
	const [label, setLabel] = useState<string | number>('Deluxe King');

	const [roomTypeFormGroup, setRoomTypeFormGroup] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('value', value, [new RsValidator(RsValidatorEnum.REQ, 'Room Type is Required')]),
			new RsFormControl('label', label, [new RsValidator(RsValidatorEnum.REQ, 'Room Type is Required')])
		])
	);

	function updateRoomTypeControl(control: RsFormControl) {
		roomTypeFormGroup.update(control);
	}

	// function isFormFilledOut(): boolean {
	// 	let filledOut =
	// 		!!creditCardFormGroup.get('creditCard')?.value.toString().length &&
	// 		!!creditCardFormGroup.get('expirationMonth')?.value.toString().length &&
	// 		!!creditCardFormGroup.get('expirationYear')?.value.toString().length &&
	// 		!!creditCardFormGroup.get('cvv')?.value.toString().length;
	//
	// 	if (!isBillingAddressSame) {
	// 		filledOut =
	// 			filledOut ||
	// 			(!!billingAddressFormGroup.get('address1')?.value.toString().length &&
	// 				!!billingAddressFormGroup.get('city')?.value.toString().length &&
	// 				!!billingAddressFormGroup.get('zip')?.value.toString().length &&
	// 				billingState.length > 0);
	// 	}
	//
	// 	return filledOut;
	// }

	// useEffect(() => {
	// 	console.log(props.roomTypes);
	// 	let optionsArray: { value: string | number; label: string | number }[];
	// 	props.roomTypes.map((roomType) => {
	// 		optionsArray.push({ value: roomType.value, label: roomType.text });
	// 		setOptions(optionsArray);
	// 	});
	// }, []);

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
					className={'selectRoomType'}
					onChange={props.onChange}
					placeHolder={props.placeHolder || 'select room type'}
					options={props.roomTypes}
				/>
				{/*<Select*/}
				{/*	control={roomTypeFormGroup}*/}
				{/*	options={options}*/}
				{/*	defaultValue={{ value: 1, label: 'Deluxe Queen' }}*/}
				{/*/>*/}
			</Box>
		</div>
	);
};

export default ResortComparisonCard;
