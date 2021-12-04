import * as React from 'react';
import { FormEvent, useEffect, useState } from 'react';
import './CheckOutPaymentCard.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import LabelInput from '../labelInput/LabelInput';
import LabelSelect from '../labelSelect/LabelSelect';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import { WebUtils } from '../../utils/utils';
import serviceFactory from '../../services/serviceFactory';
import CountryService from '../../services/country/country.service';
import LabelButton from '../labelButton/LabelButton';
import LabelCheckboxV2 from '../labelCheckbox/LabelCheckboxV2';
import Switch from '@bit/redsky.framework.rs.switch';
import CardInfoCard from '../cardInfoCard/CardInfoCard';
import UserService from '../../services/user/user.service';
import { OptionType } from '@bit/redsky.framework.rs.select';

export interface CheckOutPaymentCardProps {
	checkoutUserState: [Api.User.Req.Checkout, React.Dispatch<React.SetStateAction<Api.User.Req.Checkout>>];
	userPrimaryPaymentMethod: Api.User.PaymentMethod | undefined;
	onContinue: VoidFunction;
	isDisplayed: boolean;
}

const CheckOutPaymentCard: React.FC<CheckOutPaymentCardProps> = (props) => {
	const [checkoutUser, setCheckoutUser] = props.checkoutUserState;
	const user = useRecoilValue<Api.User.Res.Get | undefined>(globalState.user);
	const verifiedAccommodation = useRecoilValue<Api.Reservation.Res.Verification | undefined>(
		globalState.verifiedAccommodation
	);
	const userService = serviceFactory.get<UserService>('UserService');
	const countryService = serviceFactory.get<CountryService>('CountryService');
	const [differentBillingAddress, setDifferentBillingAddress] = useState<boolean>(false);
	const [payWithPoints, setPayWithPoints] = useState<boolean>(checkoutUser.usePoints || false);
	const [useExistingPaymentMethod, setUseExistingPaymentMethod] = useState<boolean>(
		false
		// checkoutUser.useExistingPaymentMethod || false
	);
	const [stateList, setStateList] = useState<Misc.OptionType[]>([]);
	const [countryList, setCountryList] = useState<OptionType[]>([]);

	const [paymentForm, setPaymentForm] = useState<RsFormGroup>(getPaymentForm);

	function getPaymentForm() {
		return new RsFormGroup([
			new RsFormControl('firstName', checkoutUser.billing?.firstName || checkoutUser.personal.firstName, [
				new RsValidator(RsValidatorEnum.REQ, 'First name is required')
			]),
			new RsFormControl('lastName', checkoutUser.billing?.lastName || checkoutUser.personal.lastName, [
				new RsValidator(RsValidatorEnum.REQ, 'Last name is required')
			]),
			new RsFormControl('email', checkoutUser.billing?.email || checkoutUser.personal.email, [
				new RsValidator(RsValidatorEnum.EMAIL, 'Enter a valid Email')
			]),
			new RsFormControl('phone', checkoutUser.billing?.phone || checkoutUser.personal.phone, [
				new RsValidator(RsValidatorEnum.REQ, 'A phone number is required')
			]),
			new RsFormControl('address1', checkoutUser.billing?.address1 || checkoutUser.personal.address1, [
				new RsValidator(RsValidatorEnum.REQ, 'Address is required')
			]),
			new RsFormControl('address2', checkoutUser.billing?.address2 || checkoutUser.personal.address2 || '', []),
			new RsFormControl('city', checkoutUser.billing?.country || checkoutUser.personal.country, [
				new RsValidator(RsValidatorEnum.REQ, 'City is required')
			]),
			new RsFormControl('zip', checkoutUser.billing?.zip || checkoutUser.personal.zip, [
				new RsValidator(RsValidatorEnum.REQ, 'Zip is required')
			]),
			new RsFormControl('state', checkoutUser.billing?.state || checkoutUser.personal.state, [
				new RsValidator(RsValidatorEnum.REQ, 'State is required')
			]),
			new RsFormControl('country', checkoutUser.billing?.country || checkoutUser.personal.country, [
				new RsValidator(RsValidatorEnum.REQ, 'Country is required')
			]),
			new RsFormControl('nameOnCard', checkoutUser.paymentInfo?.nameOnCard || '', [
				new RsValidator(RsValidatorEnum.CUSTOM, 'Card Name is required', customRequired)
			]),
			new RsFormControl('expiration', checkoutUser.paymentInfo?.expiration || '', [
				new RsValidator(RsValidatorEnum.CUSTOM, 'Expiration is required', customRequired),
				new RsValidator(
					RsValidatorEnum.CUSTOM,
					'Expiration must be a valid date in the format MM/YY',
					(control) => {
						return (
							isPayingWithPoints() ||
							isUsingExistingPaymentMethod() ||
							/^(0[1-9]|1[0-2])\/?(20[0-9]{2})$/.test(control.value.toString())
						);
					}
				)
			])
		]);
	}

	useEffect(() => {
		setPaymentForm(getPaymentForm());
	}, [checkoutUser]);

	function isPayingWithPoints() {
		// This is used because for some reason I can't access stateful variables from within form controls
		return (document.querySelector('.isPayingWithPoints [id^="RsSwitch_"]') as HTMLInputElement)?.checked || false;
	}

	function isUsingExistingPaymentMethod() {
		// This is used because for some reason I can't access stateful variables from within form controls
		return (
			(document.querySelector('.isUsingExistingPaymentMethod [id^="RsSwitch_"]') as HTMLInputElement)?.checked ||
			false
		);
	}

	function customRequired(control: RsFormControl) {
		return isPayingWithPoints() || isUsingExistingPaymentMethod() || !!control.value;
	}

	useEffect(() => {
		async function getCountries() {
			try {
				const countries = await countryService.getAllCountries();
				setCountryList(formatStateOrCountryListForSelect(countries.countries));
			} catch (e) {
				console.error('getCountries', e);
				rsToastify.error(WebUtils.getRsErrorMessage(e, 'Unable to get a list of countries.'), 'Server Error');
			}
		}

		getCountries().catch(console.error);
	}, []);

	useEffect(() => {
		async function getStates() {
			try {
				const states = await countryService.getStates(paymentForm.get('country').value.toString());
				setStateList(formatStateOrCountryListForSelect(states.states));
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'Unable to get states for the selected country.'),
					'Server Error'
				);
			}
		}

		getStates().catch(console.error);
	}, []);

	function formatStateOrCountryListForSelect(statesOrCountries: any[]) {
		return statesOrCountries.map((item) => {
			return { value: item.isoCode, label: item.name };
		});
	}

	function updateForm(control: RsFormControl) {
		setPaymentForm(paymentForm.clone().update(control));
	}

	function buildCheckoutUser(): Api.User.Req.Checkout {
		const newCheckoutUser = { ...checkoutUser };
		if (differentBillingAddress) {
			newCheckoutUser.billing = {
				firstName: paymentForm.get('firstName').value.toString(),
				lastName: paymentForm.get('lastName').value.toString(),
				address1: paymentForm.get('address1').value.toString(),
				address2: paymentForm.get('address2').value.toString(),
				zip: paymentForm.get('zip').value.toString(),
				city: paymentForm.get('city').value.toString(),
				state: paymentForm.get('state').value.toString(),
				country: paymentForm.get('country').value.toString(),
				email: paymentForm.get('email').value.toString(),
				phone: paymentForm.get('phone').value.toString()
			};
		} else delete newCheckoutUser.billing;

		if (!payWithPoints && !useExistingPaymentMethod) {
			newCheckoutUser.paymentInfo = {
				expiration: paymentForm.get('expiration').value.toString(),
				nameOnCard: paymentForm.get('nameOnCard').value.toString()
			};
		} else delete newCheckoutUser.paymentInfo;

		return newCheckoutUser;
	}

	async function submitInfo(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		try {
			if (!(await paymentForm.isValid())) {
				setPaymentForm(paymentForm.clone());
				return;
			}

			const newCheckoutUser = buildCheckoutUser();
			setCheckoutUser(newCheckoutUser);
			await userService.setCheckoutUserInLocalStorage(newCheckoutUser);
			props.onContinue();
		} catch (e) {
			rsToastify.error('Payment information is invalid', 'Missing or Incorrect Information');
		}
	}

	function renderBillingInfo() {
		if (!differentBillingAddress) return null;

		return (
			<>
				<Box className={'fieldGroup'}>
					<LabelInput
						labelVariant={'h5'}
						title={'First Name'}
						inputType={'text'}
						control={paymentForm.get('firstName')}
						updateControl={updateForm}
					/>
					<LabelInput
						labelVariant={'h5'}
						title={'Last Name'}
						inputType={'text'}
						control={paymentForm.get('lastName')}
						updateControl={updateForm}
					/>
				</Box>
				<Box className={'fieldGroup stretchedInput'}>
					<LabelInput
						labelVariant={'h5'}
						title={'Address Line 1'}
						inputType={'text'}
						control={paymentForm.get('address1')}
						updateControl={updateForm}
					/>
				</Box>
				<Box className={'fieldGroup stretchedInput'}>
					<LabelInput
						labelVariant={'h5'}
						title={'Address Line 2'}
						inputType={'text'}
						control={paymentForm.get('address2')}
						updateControl={updateForm}
					/>
				</Box>
				<Box className={'fieldGroup'}>
					<LabelInput
						labelVariant={'h5'}
						title={'Postal/Zip code'}
						inputType={'text'}
						control={paymentForm.get('zip')}
						updateControl={updateForm}
					/>
					<LabelInput
						labelVariant={'h5'}
						title={'City'}
						inputType={'text'}
						control={paymentForm.get('city')}
						updateControl={updateForm}
					/>
				</Box>
				<Box className={'fieldGroup'}>
					<LabelSelect
						title={'State'}
						options={stateList}
						control={paymentForm.get('state')}
						updateControl={updateForm}
					/>
					<LabelSelect
						title={'Country'}
						updateControl={updateForm}
						options={countryList}
						control={paymentForm.get('country')}
					/>
				</Box>
				<Box className={'fieldGroup'}>
					<LabelInput
						labelVariant={'h5'}
						title={'Email'}
						inputType={'text'}
						control={paymentForm.get('email')}
						updateControl={updateForm}
					/>
					<LabelInput
						labelVariant={'h5'}
						inputType={'tel'}
						title={'Phone'}
						isPhoneInput
						onChange={(value) => {
							let updatedPhone = paymentForm.getClone('phone');
							updatedPhone.value = value;
							updateForm(updatedPhone);
						}}
						initialValue={user?.phone}
					/>
				</Box>
			</>
		);
	}

	function canPayWithPoints() {
		return (
			!!verifiedAccommodation && !!user && verifiedAccommodation.prices.grandTotalPoints < user.availablePoints
		);
	}

	function canUsePrimaryPaymentMethod() {
		return !payWithPoints && !!props.userPrimaryPaymentMethod;
	}

	function canShowCardForm() {
		return !payWithPoints && !useExistingPaymentMethod;
	}

	return (
		<Box className={`rsCheckOutPaymentCard ${props.isDisplayed ? '' : 'hidden'}`}>
			<form onSubmit={submitInfo}>
				<Box className={'fieldGroup stretchedInput'}>
					<LabelCheckboxV2
						value={''}
						isChecked={differentBillingAddress}
						text={'Use different billing address'}
						onSelect={() => setDifferentBillingAddress(true)}
						onDeselect={() => setDifferentBillingAddress(false)}
					/>
				</Box>
				{renderBillingInfo()}

				{canPayWithPoints() && (
					<Box className={'fieldGroup stretchedInput leftSide'}>
						<Switch
							className={'isPayingWithPoints'}
							label={'{"right":"Pay with points"}'}
							labelPosition={'right'}
							checked={payWithPoints}
							onChange={(checked) => {
								const newCheckoutUser = { ...checkoutUser };
								newCheckoutUser.usePoints = checked;
								setCheckoutUser(newCheckoutUser);
								setPayWithPoints(checked);
							}}
						/>
					</Box>
				)}
				{/*TODO: Commented out until we get some feedback and designs*/}
				{/*{canUsePrimaryPaymentMethod() && (*/}
				{/*	<Box className={'fieldGroup stretchedInput leftSide'}>*/}
				{/*		<Switch*/}
				{/*			className={'isUsingExistingPaymentMethod'}*/}
				{/*			label={'{"right":"Use existing payment method"}'}*/}
				{/*			labelPosition={'right'}*/}
				{/*			checked={useExistingPaymentMethod}*/}
				{/*			onChange={(checked) => {*/}
				{/*				const newCheckoutUser = { ...checkoutUser };*/}
				{/*				newCheckoutUser.useExistingPaymentMethod = checked;*/}
				{/*				setCheckoutUser(newCheckoutUser);*/}
				{/*				setUseExistingPaymentMethod(checked);*/}
				{/*			}}*/}
				{/*		/>*/}
				{/*	</Box>*/}
				{/*)}*/}
				{canShowCardForm() && <CardInfoCard form={paymentForm} onUpdate={updateForm} />}
				<Box className={'fieldGroup stretchedInput rightSide'}>
					<LabelButton look={'containedPrimary'} variant={'body1'} label={'Continue'} buttonType={'submit'} />
				</Box>
			</form>
		</Box>
	);
};

export default CheckOutPaymentCard;
