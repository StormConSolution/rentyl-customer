import * as React from 'react';
import './LabelInput.scss';
import debounce from 'lodash.debounce';
import Label from '@bit/redsky.framework.rs.label';
import Input from '@bit/redsky.framework.rs.input';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import { useState } from 'react';
import rsToasts from '@bit/redsky.framework.toast';
import validate = WebAssembly.validate;

interface LabelInputProps {
	title: string;
	onChange: (value: any) => void;
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

	function validateEmail(mail: string) {
		return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail);
	}

	function formatPhoneNumber(phone: string) {
		if (phone.length !== 10) {
			setIsValid(false);
			throw rsToasts.error("Phone Number Isn't 10 characters");
		}
		setIsValid(true);
		let cleaned = ('' + phone).replace(/\D/g, '');
		let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

		if (match) {
			return `${match[1]}-${match[2]}-${match[3]}`;
		}
	}

	let searchDebounced = debounce(async (value) => {
		if (value.value.length === 0) return;
		if (props.isEmailInput && !validateEmail(value.value)) return setIsValid(false);
		else setIsValid(true);
		if (props.inputType === 'tel') return props.onChange(formatPhoneNumber(value.value));
		props.onChange(value.value);
	}, 1000);

	return (
		<div className={'rsLabelInput'}>
			<Label variant={'caption'}>{props.title}</Label>
			<Input
				className={!isValid ? 'invalid' : ''}
				placeholder={props.placeholder}
				type={props.inputType}
				look={'none'}
				color={'#858585'}
				control={form.get('value')}
				updateControl={(updateControl) => searchDebounced(updateControl)}
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
