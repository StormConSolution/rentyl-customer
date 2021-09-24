import * as React from 'react';
import './RateCodeSelect.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';
import { useState } from 'react';
import LabelInput from '../labelInput/LabelInput';
import LabelButton from '../labelButton/LabelButton';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';

interface RateCodeSelectProps {
	apply: (value: string) => void;
	code?: string;
	valid: boolean;
}

const RateCodeSelect: React.FC<RateCodeSelectProps> = (props) => {
	const [rateCodeForm, setRateCodeForm] = useState<RsFormGroup>(
		new RsFormGroup([new RsFormControl('code', props.code || '', [])])
	);

	function updateRateCodeForm(control: RsFormControl) {
		setRateCodeForm(rateCodeForm.clone().update(control));
	}

	return (
		<Box className={'rsRateCodeSelect'}>
			<div className={'labelGroup'}>
				{props.valid && (
					<Label variant={'body1'} color={'red'}>
						The rate code you entered is invalid. Please enter a different rate code.
					</Label>
				)}
				<LabelInput
					title={'Code'}
					inputType={'text'}
					control={rateCodeForm.get('code')}
					updateControl={updateRateCodeForm}
				/>
			</div>
			<LabelButton
				look={'containedPrimary'}
				variant={'body1'}
				label={'Apply'}
				className={'applyButton'}
				onClick={() => {
					props.apply(rateCodeForm.get('code').value.toString());
					if (props.valid && rateCodeForm.get('code').value.toString() !== '') {
						rsToastify.success('Rate code successfully applied', 'Success!');
					}
				}}
			/>
		</Box>
	);
};

export default RateCodeSelect;
