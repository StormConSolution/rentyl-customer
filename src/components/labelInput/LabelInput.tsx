import * as React from 'react';
import './LabelInput.scss';
import Label from '@bit/redsky.framework.rs.label';
import Input from '@bit/redsky.framework.rs.input';
import { RsFormControl } from '@bit/redsky.framework.rs.form';
import Icon from '@bit/redsky.framework.rs.icon';

interface LabelInputProps {
	title: string;
	onChange?: (value: any) => void;
	control: RsFormControl;
	updateControl: (updateControl: RsFormControl) => void;
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
}

const LabelInput: React.FC<LabelInputProps> = (props) => {
	return (
		<div className={'rsLabelInput'}>
			<Label variant={'caption'}>{props.title}</Label>
			{!!props.iconImage && (
				<div className="iconHolder">
					<Icon iconImg={props.iconImage} size={props.iconSize} />
				</div>
			)}
			<Input
				className={`${!!props.iconImage ? 'hasIcon' : ''}`}
				placeholder={props.placeholder}
				type={props.inputType}
				look={'none'}
				color={'#858585'}
				control={props.control}
				updateControl={props.updateControl}
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
