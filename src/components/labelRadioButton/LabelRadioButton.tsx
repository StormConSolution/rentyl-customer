import * as React from 'react';
import './LabelRadioButton.scss';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label';

interface LabelRadioButtonProps {
	radioName: string;
	value: string | number;
	checked: boolean;
	text: string;
	onSelect: (value: string | number) => void;
	// onClick?: (event?:React.MouseEvent) => void;
}

const LabelRadioButton: React.FC<LabelRadioButtonProps> = (props) => {
	return (
		<div
			className={'rsLabelRadioButton'}
			onClick={(event: React.MouseEvent) => {
				event?.stopPropagation();
			}}
		>
			<label className={'radioButtonContainer'}>
				<input
					type={'radio'}
					name={props.radioName}
					value={props.value}
					checked={props.checked}
					onChange={(e) => {
						let inputValue = e.target as HTMLInputElement;
						if (inputValue.checked) props.onSelect(props.value);
					}}
				/>
				<span className={'radioButton'}>
					<Box />
				</span>
			</label>
			<Label variant={'body1'}>{props.text}</Label>
		</div>
	);
};

export default LabelRadioButton;
