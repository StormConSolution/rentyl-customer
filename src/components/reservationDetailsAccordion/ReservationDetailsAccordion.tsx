import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import './ReservationDetailsAccordion.scss';
import AccordionTitleDescription from '../accordionTitleDescription/AccordionTitleDescription';
import { Box } from '@bit/redsky.framework.rs.996';
import LabelButton from '../labelButton/LabelButton';
import Accordion from '@bit/redsky.framework.rs.accordion';
import Icon from '@bit/redsky.framework.rs.icon';
import LabelInput from '../labelInput/LabelInput';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import router from '../../utils/router';
import { DateUtils, ObjectUtils, StringUtils } from '../../utils/utils';
import Label from '@bit/redsky.framework.rs.label/dist/Label';

interface ReservationDetailsAccordionProps {
	reservationId: number;
	accommodationName: string;
	arrivalDate: string | Date;
	departureDate: string | Date;
	externalConfirmationId: string;
	maxOccupantCount: number;
	maxSleeps: number;
	adultCount: number;
	childCount: number;
	adaCompliant: 1 | 0;
	extraBed: 1 | 0;
	floorCount: number;
	featureIcons: string[];
	contactInfo: string;
	email: string;
	phone: string;
	additionalDetails: string;
	upsellPackages: Api.UpsellPackage.Details[];
	isCancelable?: boolean;
	onSave?: (data: Misc.ReservationContactInfoDetails) => void;
	isEdit?: boolean;
	isOpen?: boolean;
	hasPackages: boolean;
	isPastReservation?: boolean;
	onRemove?: () => void;
	onChangeRoom?: () => void;
	onEditService?: () => void;
	onEditDetails?: () => void;
}

const ReservationDetailsAccordion: React.FC<ReservationDetailsAccordionProps> = (props) => {
	const whiteBox = useRef<HTMLElement>(null);
	const [isModified, setIsModified] = useState<boolean>(false);
	const [isValid, setIsValid] = useState<boolean>(true);
	const [toggleBtn, setToggleBtn] = useState<boolean>(false);
	const [reservationDetails, setReservationDetails] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('contactInfo', props.contactInfo || '', [
				new RsValidator(RsValidatorEnum.REQ, 'A name is required'),
				new RsValidator(RsValidatorEnum.CUSTOM, 'Must have first and last name', (control) => {
					let name = StringUtils.removeLineEndings(control.value.toString());
					return name.split(' ').length > 1;
				})
			]),
			new RsFormControl('email', props.email || '', [
				new RsValidator(RsValidatorEnum.REQ, 'Email Required'),
				new RsValidator(RsValidatorEnum.EMAIL, 'Invalid email')
			]),
			new RsFormControl('phone', props.phone || '', [
				new RsValidator(RsValidatorEnum.REQ, 'A phone number is required')
			]),
			new RsFormControl('additionalDetails', props.additionalDetails || '', [])
		])
	);

	useEffect(() => {
		function handleClickOutside(event: any) {
			if (
				whiteBox &&
				whiteBox.current &&
				!whiteBox.current.contains(event.target) &&
				!event.target.className.includes('editCancelBtn') &&
				!event.target.parentNode.className.includes('editCancelBtn')
			) {
				setToggleBtn(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		async function checkIfValid() {
			setIsValid(await reservationDetails.isValid());
		}
		if (reservationDetails.isModified()) {
			setIsModified(true);
			checkIfValid().catch(console.error);
		} else setIsModified(false);
	}, [reservationDetails]);

	function renderAmenities(amenities: string[]) {
		return amenities.map((item, index) => {
			return <Icon key={index} iconImg={item} />;
		});
	}

	function updateReservationDetails(control: RsFormControl) {
		setReservationDetails(reservationDetails.clone().update(control));
	}

	function renderContactInfo() {
		if (props.isEdit && !props.isPastReservation) {
			return (
				<>
					<div className={'accordionReservationGrid'}>
						<LabelInput
							labelVariant={'h4'}
							title={'Contact Info'}
							inputType={'text'}
							control={reservationDetails.get('contactInfo')}
							updateControl={updateReservationDetails}
						/>
						<LabelInput
							labelVariant={'h4'}
							title={'Email'}
							inputType={'email'}
							control={reservationDetails.get('email')}
							updateControl={updateReservationDetails}
						/>
						<LabelInput
							labelVariant={'h4'}
							title={'Phone'}
							inputType={'tel'}
							isPhoneInput
							onChange={(value) => {
								let updatedPhone = reservationDetails.get('phone');
								updatedPhone.value = value;
								setReservationDetails(reservationDetails.clone().update(updatedPhone));
							}}
							initialValue={reservationDetails.get('phone').value.toString()}
						/>
					</div>
					<hr />
					<LabelInput
						labelVariant={'h4'}
						title={'Additional Details'}
						inputType={'textarea'}
						control={reservationDetails.get('additionalDetails')}
						updateControl={updateReservationDetails}
					/>
				</>
			);
		} else {
			return (
				<>
					<div className={'accordionReservationGrid'}>
						<AccordionTitleDescription title={'Contact Info'} description={props.contactInfo} />
						<AccordionTitleDescription title={'Email'} description={props.email} />
						<AccordionTitleDescription
							title={'Phone'}
							description={StringUtils.formatPhoneNumber(props.phone)}
						/>
					</div>
					<hr />
					<AccordionTitleDescription title={'Additional Details'} description={props.additionalDetails} />
				</>
			);
		}
	}

	function renderLinks() {
		return (
			<>
				{props.isCancelable && (
					<LabelButton
						look={'none'}
						variant={'body1'}
						label={'REMOVE'}
						onClick={() => {
							if (props.onRemove) props.onRemove();
						}}
					/>
				)}
				<LabelButton
					look={'none'}
					variant={'body1'}
					label={'CHANGE ROOM'}
					onClick={() => {
						if (props.onChangeRoom) props.onChangeRoom();
					}}
				/>
				{props.hasPackages && (
					<LabelButton
						look={'none'}
						variant={'body1'}
						label={'EDIT PACKAGES'}
						onClick={() => {
							if (props.onEditService) props.onEditService();
						}}
					/>
				)}
				<LabelButton
					look={'none'}
					variant={'body1'}
					label={'EDIT DETAILS'}
					onClick={() => {
						if (props.onEditDetails) props.onEditDetails();
					}}
				/>
			</>
		);
	}

	function renderUpsellPackages() {
		if (!ObjectUtils.isArrayWithData(props.upsellPackages)) return [];

		return props.upsellPackages.map((item, index) => {
			return (
				<Box key={index} display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
					<AccordionTitleDescription title={'Package'} description={item.title} />
					<Label maxWidth={'60%'} variant={'body2'}>
						{item.description}
					</Label>
				</Box>
			);
		});
	}

	return (
		<Accordion
			className={'rsReservationDetailsAccordion'}
			isOpen={props.isOpen}
			hideHoverEffect
			titleReact={
				<div className={'accordionReservationGrid'}>
					<AccordionTitleDescription title={'Reservation Name'} description={props.accommodationName} />
					<AccordionTitleDescription
						title={'Reservation Date'}
						description={`${DateUtils.displayUserDate(props.arrivalDate)} - ${DateUtils.displayUserDate(
							props.departureDate
						)}`}
					/>
					<AccordionTitleDescription title={'Confirmation code'} description={props.externalConfirmationId} />
				</div>
			}
		>
			<Box padding={'0 16px 1px'}>
				<div className={'accordionReservationGrid'}>
					<AccordionTitleDescription title={'Max Occupancy'} description={props.maxOccupantCount} />
					<AccordionTitleDescription title={'sleeps'} description={props.maxSleeps} />
					<AccordionTitleDescription title={'Property Type'} description={'VIP SUITE'} />
					<AccordionTitleDescription title={'Adults'} description={props.adultCount} />
					<AccordionTitleDescription title={'Children'} description={props.childCount} />
					<AccordionTitleDescription
						title={'Ada Compliant'}
						description={props.adaCompliant ? 'Yes' : 'No'}
					/>
					<AccordionTitleDescription title={'Extra Bed'} description={props.extraBed ? 'Yes' : 'No'} />
					<AccordionTitleDescription title={'Floor Count'} description={props.floorCount} />
					<AccordionTitleDescription title={'Amenities'} description={renderAmenities(props.featureIcons)} />
				</div>
				<hr />
				{renderUpsellPackages()}
				<hr />
				{renderContactInfo()}
				<Box position={'relative'} display={'flex'} margin={'40px 0 24px auto'} width={210}>
					<LabelButton
						className={isModified ? 'showBtn' : 'hideBtn'}
						look={'containedPrimary'}
						variant={'button'}
						label={'Save'}
						disabled={!isValid}
						onClick={() => {
							if (!isValid) return;
							let newReservationDetails: Misc.ReservationContactInfoDetails = reservationDetails.toModel();
							if (props.onSave) props.onSave(newReservationDetails);
							reservationDetails.updateInitialValues();
							setIsModified(false);
						}}
					/>
					{!props.isPastReservation && (
						<Box marginLeft={'auto'} position={'relative'}>
							<LabelButton
								className={'editCancelBtn'}
								look={'containedPrimary'}
								variant={'button'}
								label={!props.isEdit ? 'Details' : 'Edit'}
								onClick={(event) => {
									if (!props.isEdit) {
										router
											.navigate(
												'/reservations/itinerary/reservation/details?ri=' + props.reservationId
											)
											.catch(console.error);
									} else {
										event.stopPropagation();
										setToggleBtn(!toggleBtn);
									}
								}}
							/>
							<div ref={whiteBox} className={toggleBtn ? 'whiteBox open' : 'whiteBox'}>
								{renderLinks()}
							</div>
						</Box>
					)}
				</Box>
			</Box>
		</Accordion>
	);
};

export default ReservationDetailsAccordion;
