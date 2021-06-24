import * as React from 'react';
import './RateCodeSelect.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import { useState } from 'react';
import LabelInput from '../labelInput/LabelInput';
import LabelSelect from '../labelSelect/LabelSelect';
import LabelButton from '../labelButton/LabelButton';

interface RateCodeSelectProps {
	cancel: () => void;
	apply: (value: string) => void;
	code?: string | null;
}

const RateCodeSelect: React.FC<RateCodeSelectProps> = (props) => {
	const [rateCodeForm, setRateCodeForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('code', props.code ? props.code : '', [
				new RsValidator(RsValidatorEnum.REQ, 'Enter a code')
			])
		])
	);

	function updateRateCodeForm(control: RsFormControl) {
		setRateCodeForm(rateCodeForm.clone().update(control));
	}

	return (
		<Box className={'rsRateCodeSelect'} display={'grid'}>
			<Box className={'enterCode'} display={'grid'}>
				<LabelInput
					title={'Code'}
					inputType={'text'}
					control={rateCodeForm.get('code')}
					updateControl={updateRateCodeForm}
				/>
			</Box>
			<Box display={'flex'} className={'buttonGroup'}>
				<LabelButton look={'containedSecondary'} variant={'body1'} label={'Cancel'} onClick={props.cancel} />
				<LabelButton
					look={'containedPrimary'}
					variant={'body1'}
					label={'Apply'}
					onClick={() => props.apply(rateCodeForm.get('code').value.toString())}
				/>
			</Box>
		</Box>
	);
};

export default RateCodeSelect;
