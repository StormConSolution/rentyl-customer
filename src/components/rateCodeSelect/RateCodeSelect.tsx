import * as React from 'react';
import './RateCodeSelect.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import { useState } from 'react';
import LabelInput from '../labelInput/LabelInput';
import LabelSelect from '../labelSelect/LabelSelect';
import LabelButton from '../labelButton/LabelButton';

interface RateCodeSelectProps {
	apply: (value: string) => void;
	code?: string | null;
	valid: boolean;
}

const RateCodeSelect: React.FC<RateCodeSelectProps> = (props) => {
	const [rateCodeForm, setRateCodeForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('code', props.code ? props.code : '', [
				new RsValidator(
					RsValidatorEnum.CUSTOM,
					'The rate code you enteredd is invalid. Please enter a different code.',
					() => props.valid
				)
			])
		])
	);

	function updateRateCodeForm(control: RsFormControl) {
		setRateCodeForm(rateCodeForm.clone().update(control));
	}

	return (
		<Box className={'rsRateCodeSelect'} display={'grid'}>
			<LabelInput
				title={'Code'}
				inputType={'text'}
				control={rateCodeForm.get('code')}
				updateControl={updateRateCodeForm}
			/>
			<LabelButton
				look={'containedPrimary'}
				variant={'body1'}
				label={'Apply'}
				onClick={() => props.apply(rateCodeForm.get('code').value.toString())}
			/>
		</Box>
	);
};

export default RateCodeSelect;
