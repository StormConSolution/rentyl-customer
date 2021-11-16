import * as React from 'react';
import './LabelInputV2.scss';
import debounce from 'lodash.debounce';
import Label from '@bit/redsky.framework.rs.label';
import Input from '@bit/redsky.framework.rs.input';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import Icon from '@bit/redsky.framework.rs.icon';
import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { StringUtils } from '../../utils/utils';

interface LabelInputV2Props {
	title: string;
	onChange?: (value: any) => void;
	control?: RsFormControl;
	updateControl?: (updateControl: RsFormControl) => void;
	inputType: 'text' | 'password' | 'number' | 'textarea' | 'tel' | 'email' | 'hidden' | 'date';
	initialValue?: string;
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
	labelVariant?:
		| 'h1'
		| 'h2'
		| 'h3'
		| 'h4'
		| 'h5'
		| 'h6'
		| 'link1'
		| 'link2'
		| 'subtitle1'
		| 'subtitle2'
		| 'body1'
		| 'body2'
		| 'caption'
		| 'button'
		| 'overline'
		| string;
}

const LabelInputV2: React.FC<LabelInputV2Props> = (props) => {
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
		if (props.isEmailInput && !StringUtils.validateEmail(value.value)) return setIsValid(false);
		else setIsValid(true);
		if (props.inputType === 'tel') return props.onChange(StringUtils.formatPhoneNumber(value.value));
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
		<div className={`rsLabelInputV2 ${props.className || ''}`}>
			<Label variant={props.labelVariant || 'caption'} className="titleLabel">
				{props.title}
			</Label>

			{!props.isPhoneInput ? (
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
			) : (
				<PhoneInput
					inputClass={'phoneInput'}
					country={'us'}
					onChange={(value) => {
						if (props.onChange) props.onChange(value);
					}}
					value={props.initialValue}
					countryCodeEditable={false}
				/>
			)}
		</div>
	);
};

export default LabelInputV2;
