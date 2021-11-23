import * as React from 'react';
import { useState } from 'react';
import { Box } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Input from '@bit/redsky.framework.rs.input';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import LabelInput from '../labelInput/LabelInput';
import LabelSelect from '../labelSelect/LabelSelect';

export interface CheckOutInfoCardProps {}
const CheckOutInfoCard: React.FC<CheckOutInfoCardProps> = (props) => {
	const [infoForm, setInfoForm] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('firstName', '', [new RsValidator(RsValidatorEnum.REQ, 'Enter a first name')]),
			new RsFormControl('lastName', '', [new RsValidator(RsValidatorEnum.REQ, 'Enter a last name')]),
			new RsFormControl('address1', '', [new RsValidator(RsValidatorEnum.REQ, 'Enter a password')]),
			new RsFormControl('address2', '', []),
			new RsFormControl('zip', '', [new RsValidator(RsValidatorEnum.REQ, 'Enter a zip code')]),
			new RsFormControl('city', '', [new RsValidator(RsValidatorEnum.REQ, 'Enter your city')]),
			new RsFormControl('state', 0, []),
			new RsFormControl('primaryEmailAddress', '', [
				new RsValidator(RsValidatorEnum.EMAIL, 'Enter a valid email')
			]),
			new RsFormControl('phone', '', [new RsValidator(RsValidatorEnum.REQ, 'Enter a phone number')])
		])
	);

	function updateForm(control: RsFormControl) {
		setInfoForm(infoForm.clone().update(control));
	}
	return (
		<Box className={'rsCheckOutInfoCard'}>
			<Box className={'message'}>
				<Label variant={'h3'}>Reserve & Relax</Label>
				<p>
					When you book directly with Rentyl Resorts, you can relax knowing you are not only getting the best
					rate but you also are getting the flexibility you want.
				</p>
			</Box>
			<form>
				<LabelInput
					title={'First name'}
					inputType={'text'}
					control={infoForm.get('firstName')}
					updateControl={updateForm}
				/>
				<LabelInput
					title={'Last name'}
					inputType={'text'}
					control={infoForm.get('lastName')}
					updateControl={updateForm}
				/>
				<LabelInput
					title={'Address line 1'}
					inputType={'text'}
					control={infoForm.get('address1')}
					updateControl={updateForm}
				/>
				<LabelInput
					title={'Address line 2'}
					inputType={'text'}
					control={infoForm.get('address2')}
					updateControl={updateForm}
				/>
				<LabelInput
					title={'Post/Zip code'}
					inputType={'text'}
					control={infoForm.get('zip')}
					updateControl={updateForm}
				/>
				<LabelInput
					title={'City'}
					inputType={'text'}
					control={infoForm.get('city')}
					updateControl={updateForm}
				/>
				<LabelSelect title={'State'} control={infoForm.get('state')} options={} updateControl={updateForm} />
				<LabelInput
					title={'primaryEmailAddress'}
					inputType={'email'}
					control={infoForm.get('firstName')}
					updateControl={updateForm}
				/>
				<LabelInput
					title={'Phone'}
					inputType={'tel'}
					control={infoForm.get('phone')}
					updateControl={updateForm}
				/>
			</form>
		</Box>
	);
};

export default CheckOutInfoCard;
