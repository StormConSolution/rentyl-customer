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
	labelSize?:
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
	// onClick?: (event?:React.MouseEvent) => void;
}

const LabelRadioButton: React.FC<LabelRadioButtonProps> = (props) => {
	const defaultTextSize = 'body1';

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
			<Label variant={props.labelSize ? props.labelSize : defaultTextSize}>{props.text}</Label>
		</div>
	);
};

export default LabelRadioButton;
