import * as React from 'react';
import './AccountPaymentMethodsPage.scss';
import AccountHeader from '../../components/accountHeader/AccountHeader';
import { Page } from '@bit/redsky.framework.rs.996';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label';
import Paper from '../../components/paper/Paper';
import Icon from '@bit/redsky.framework.rs.icon';
import LabelInput from '../../components/labelInput/LabelInput';
import LabelCheckbox from '../../components/labelCheckbox/LabelCheckbox';
import LabelButton from '../../components/labelButton/LabelButton';
import { useEffect, useState } from 'react';
import useLoginState, { LoginStatus } from '../../customHooks/useLoginState';
import serviceFactory from '../../services/serviceFactory';
import UserService from '../../services/user/user.service';
import LoadingPage from '../loadingPage/LoadingPage';

interface AccountPaymentMethodsPageProps {}

const AccountPaymentMethodsPage: React.FC<AccountPaymentMethodsPageProps> = (props) => {
	const userService = serviceFactory.get<UserService>('UserService');
	const [user, setUser] = useState<Api.User.Res.Get>();
	const [formChanged, setFormChanged] = useState<boolean>(false);
	const [creditCardObj, setCreditCardObj] = useState();

	useEffect(() => {
		let userObj = userService.getCurrentUser();
		if (userObj) {
			setUser(userObj);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		console.log(user);
	}, [user]);

	function lastFour() {}

	function expDate() {
		return '';
	}

	function nameOnCard() {
		return '';
	}

	function save() {}

	return !user ? (
		<LoadingPage />
	) : (
		<Page className={'rsAccountPaymentMethodsPage'}>
			<div className={'rs-page-content-wrapper'}>
				<AccountHeader selected={'PAYMENT_METHODS'} />
				<Box width={'921px'} margin={'60px auto'} display={'flex'} justifyContent={'space-between'}>
					<Box width={'420px'}>
						<Label variant={'h2'}>Primary payment method</Label>
						<Paper
							className={'fakeCreditCard'}
							borderRadius={'4px'}
							boxShadow
							padding={'25px 30px 16px'}
							position={'relative'}
							height={'206px'}
							width={'390px'}
						>
							<img src={require('../../images/card-chip.png')} width={38} height={30} />
							<Box display={'flex'} justifyContent={'space-between'}>
								<Box>
									<Label variant={'caption'}>Card Number</Label>
									<Label variant={'h3'}>XXX - XXX - {lastFour()}</Label>
								</Box>
								<Box>
									<Label variant={'caption'}>Card Number</Label>
									<Label variant={'body1'}>{expDate()}</Label>
								</Box>
							</Box>
							<div className={'bottomStrip'}>
								<Label variant={'caption'}>Name on card</Label>
								<Label variant={'body1'}>{nameOnCard()}</Label>
							</div>
						</Paper>
					</Box>
					<Box width={'420px'}>
						<Label variant={'h2'}>Add new payment method</Label>
						<Box display={'flex'} justifyContent={'space-between'}>
							<LabelInput
								title={'Full Name'}
								inputType={'text'}
								onChange={(value) => {
									setFormChanged(true);
									console.log('Full Name ', value);
								}}
							/>
							<LabelInput
								title={'Card Number'}
								inputType={'text'}
								onChange={(value) => {
									setFormChanged(true);
									console.log('Card Number ', value);
								}}
							/>
						</Box>
						<Box display={'flex'} justifyContent={'space-between'}>
							<LabelInput
								className={'creditCardExpInput'}
								maxLength={4}
								title={'Expiration Date'}
								inputType={'text'}
								onChange={(value) => {
									setFormChanged(true);
									console.log('Expiration Date ', value);
								}}
							/>
							<LabelInput
								title={'CCV '}
								inputType={'text'}
								onChange={(value) => {
									setFormChanged(true);
									console.log('CCV ', value);
								}}
							/>
						</Box>
						<LabelCheckbox
							value={'isPrimary'}
							text={'Set as primary'}
							isChecked={false}
							onSelect={(value, text) => {
								setFormChanged(true);
								console.log(value, true);
							}}
							onDeselect={(value, text) => {
								setFormChanged(true);
								console.log(value, false);
							}}
						/>
						<LabelButton
							look={formChanged ? 'containedPrimary' : 'containedSecondary'}
							variant={'button'}
							label={'Add New Address'}
							disabled={!formChanged}
							onClick={() => {
								save();
							}}
						/>
					</Box>
				</Box>
				<hr />
			</div>
		</Page>
	);
};

export default AccountPaymentMethodsPage;
