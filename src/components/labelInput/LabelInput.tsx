import * as React from 'react';
import './LabelInput.scss';
import debounce from 'lodash.debounce';
import Label from '@bit/redsky.framework.rs.label';
import Input from '@bit/redsky.framework.rs.input';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import Icon from '@bit/redsky.framework.rs.icon';
import { formatPhoneNumber, validateEmail } from '../../utils/utils';
import { useState } from 'react';

interface LabelInputProps {
	title: string | React.ReactNode;
	onChange?: (value: any) => void;
	control?: RsFormControl;
	updateControl?: (updateControl: RsFormControl) => void;
	inputType: 'text' | 'textarea' | 'number' | 'password' | 'tel';
	initialValue?: string | number;
	placeholder?: string;
	disabled?: boolean;
	isEmailInput?: boolean;
	isPhoneInput?: boolean;
	minLength?: number;
	maxLength?: number;
	textareaCols?: number;
	textareaRows?: number;
	iconImage?: string;
	iconSize?: number;
	className?: string;
}

const LabelInput: React.FC<LabelInputProps> = (props) => {
	const [isValid, setIsValid] = useState<boolean>(true);
	const form = new RsFormGroup([
		new RsFormControl(
			'value',
			props.initialValue || '',
			props.isEmailInput ? [new RsValidator(RsValidatorEnum.EMAIL, 'Email format is invalid')] : []
		)
	]);

	let searchDebounced = debounce(async (value) => {
		if (!props.onChange) return;
		if (value.value.length === 0) {
			props.onChange(value.value);
			return;
		}
		if (props.isEmailInput && !validateEmail(value.value)) return setIsValid(false);
		else setIsValid(true);
		if (props.inputType === 'tel') return props.onChange(formatPhoneNumber(value.value));
		props.onChange(
			value.value
				.replace(/\r?\n|\t|\r/g, ' ')
				.match(/[^ ]+/g)
				.join(' ')
		);
	}, 100);

	function renderClassNames(): string {
		let classNames: string = '';
		if (!!props.iconImage) classNames += 'hasIcon';
		if (!isValid) classNames += ' invalid';
		if (props.className) classNames += ` ${props.className}`;
		return classNames;
	}

	return (
		<div className={`rsLabelInput ${props.className || ''}`}>
			<Label variant={'caption'}>{props.title}</Label>
			{!!props.iconImage && (
				<div className="iconHolder">
					<Icon iconImg={props.iconImage} size={props.iconSize} />
				</div>
			)}
			<Input
				className={renderClassNames()}
				placeholder={props.placeholder}
				type={props.inputType}
				look={'none'}
				color={'#858585'}
				control={props.control || form.get('value')}
				updateControl={
					props.updateControl ? props.updateControl : (updateControl) => searchDebounced(updateControl)
				}
				disabled={props.disabled}
				minLength={props.minLength}
				maxLength={props.maxLength}
				rows={props.textareaRows}
				cols={props.textareaCols}
				unStyled
			/>
		</div>
	);
};

export default LabelInput;
