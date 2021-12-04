import { RsFormControl, RsFormGroup } from '@bit/redsky.framework.rs.form';
import './CardInfoCard.scss';
import { Box } from '@bit/redsky.framework.rs.996';
import LabelInput from '../labelInput/LabelInput';
import * as React from 'react';
import Label from '@bit/redsky.framework.rs.label';
import Icon from '@bit/redsky.framework.rs.icon';
import { useEffect, useRef } from 'react';
import serviceFactory from '../../services/serviceFactory';
import PaymentService from '../../services/payment/payment.service';

export interface CardInfoCardProps {
	form: RsFormGroup;
	onUpdate: (control: RsFormControl) => void;
}

const CardInfoCard: React.FC<CardInfoCardProps> = (props) => {
	const paymentService = serviceFactory.get<PaymentService>('PaymentService');

	useEffect(() => {
		async function init() {
			const gatewayDetails: Api.Payment.Res.PublicData = await paymentService.getGateway();
			window.Spreedly.init(gatewayDetails.publicData.token, {
				numberEl: 'spreedly-number',
				cvvEl: 'spreedly-cvv'
			});
		}
		init().catch(console.error);
	}, []);

	async function updateExpiration(control: RsFormControl) {
		const controlValue = control.value.toString();
		if (!controlValue.includes('/') && controlValue.length === 6) {
			control.value = controlValue.slice(0, 2) + '/' + controlValue.slice(2);
			control.clearErrors();
		} else if (control.value.toString().length > 7) control.value = controlValue.slice(0, 7);

		props.onUpdate(control);
	}

	const numberRef = useRef<HTMLElement>(null);
	const cvvRef = useRef<HTMLElement>(null);

	return (
		<Box className={'rsCardInfoCard'}>
			<Box className={'title'}>
				<Label variant={'h4'}>Credit / Debit Card</Label>
			</Box>
			<Box className={'cardBody'}>
				<Box className={'cardInfoGroup stretchedInput'}>
					<div ref={numberRef} id={'spreedly-number'}>
						<Label id={'Number'} variant={'caption'} mb={10}>
							Card number
						</Label>
					</div>
				</Box>
				<Box className={'cardInfoGroup stretchedInput'}>
					<LabelInput
						labelVariant={'h5'}
						title={'Name on card'}
						inputType={'text'}
						control={props.form.get('nameOnCard')}
						updateControl={props.onUpdate}
					/>
				</Box>
				<Box className={'cardInfoGroup'}>
					<LabelInput
						labelVariant={'h5'}
						title={'Expiration'}
						inputType={'text'}
						control={props.form.get('expiration')}
						updateControl={updateExpiration}
					/>
					<div ref={cvvRef} id={'spreedly-cvv'}>
						<Label id={'Cvv'} variant={'caption'} mb={10}>
							CVC{' '}
							<span title={'The 3 digits on the back of your credit card.'}>
								<Icon className={'helpIcon'} iconImg={'icon-solid-question-circle'} size={21} />
							</span>
						</Label>
					</div>
				</Box>
			</Box>
		</Box>
	);
};

export default CardInfoCard;
