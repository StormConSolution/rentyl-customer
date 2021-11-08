import * as React from 'react';
import './RateCodeSelect.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';
import { useEffect, useState } from 'react';
import LabelInput from '../labelInput/LabelInput';
import LabelButton from '../labelButton/LabelButton';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { useRecoilState } from 'recoil';
import globalState from '../../state/globalState';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';

interface RateCodeSelectProps {
	code?: string;
	valid: boolean;
}

const RateCodeSelect: React.FC<RateCodeSelectProps> = (props) => {
	const [rateCode, setRateCode] = useRecoilState<string>(globalState.userRateCode);
	const [searchQueryObj, setSearchQueryObj] = useRecoilState<Misc.ReservationFilters>(globalState.reservationFilters);
	const [rateCodeForm, setRateCodeForm] = useState<RsFormGroup>(
		new RsFormGroup([new RsFormControl('code', props.code || '', [])])
	);

	useEffect(() => {
		let newRateCode = rateCodeForm.get('code');
		newRateCode.value = rateCode;
		setRateCodeForm(rateCodeForm.cloneDeep().update(newRateCode));
	}, [rateCode]);

	function updateRateCodeForm(control: RsFormControl) {
		setRateCode(control.value as string);
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
					if (rateCode) {
						rsToastify.success('Rate code has been successfully applied', 'Success!');
					}
					let newSearchQueryObj: Misc.ReservationFilters = { ...searchQueryObj };
					newSearchQueryObj.rateCode = rateCodeForm.get('code').value.toString();
					setSearchQueryObj(newSearchQueryObj);
				}}
			/>
		</Box>
	);
};

export default RateCodeSelect;
