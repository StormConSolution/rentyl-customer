import * as React from 'react';
import './LeaveAReviewPopup.scss';
import { Box, Popup, popupController } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';
import Paper from '../../components/paper/Paper';
import { useEffect, useState } from 'react';
import { RsFormControl, RsFormGroup, RsValidator, RsValidatorEnum } from '@bit/redsky.framework.rs.form';
import { WebUtils } from '../../utils/utils';
import LabelInput from '../../components/labelInput/LabelInput';
import LabelButton from '../../components/labelButton/LabelButton';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import LabelSelect from '../../components/labelSelect/LabelSelect';
import Icon from '@bit/redsky.framework.rs.icon';
import StarRatingSelect from '../../components/starRatingSelect/StarRatingSelect';
import serviceFactory from '../../services/serviceFactory';
import ReviewService from '../../services/review/review.service';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';

export interface LeaveAReviewPopupProps extends PopupProps {
	destinationName: string;
	destinationLogo: string;
	stays: {
		id: string | number;
		name: string | number;
		review: { id: number; rating: number; message: string } | null;
	}[];
	updateReview: (reservationId: number, rating: number, message: string) => void;
}

const LeaveAReviewPopup: React.FC<LeaveAReviewPopupProps> = (props) => {
	const reviewService = serviceFactory.get<ReviewService>('ReviewService');
	const [hasAReview, setHasAReview] = useState<boolean>(false);
	const [reservationId, setReservationId] = useState<number>(-1);
	const [reviewDetails, setReviewDetails] = useState<RsFormGroup>(
		new RsFormGroup([
			new RsFormControl('reservationId', '', [
				new RsValidator(RsValidatorEnum.REQ, 'Please select which Reservation')
			]),
			new RsFormControl('message', '', [new RsValidator(RsValidatorEnum.REQ, 'Please provide a message')]),

			new RsFormControl('rating', 5, [])
		])
	);

	useEffect(() => {
		let reviewForm = reviewDetails.cloneDeep();
		const message = reviewForm.get('message');
		setHasAReview(!!props.stays.find((stay) => stay.id === reservationId)?.review);
		message.value = props.stays.find((stay) => stay.id === reservationId)?.review?.message || '';
		reviewForm.update(message);
		const rating = reviewForm.get('rating');
		rating.value = props.stays.find((stay) => stay.id === reservationId)?.review?.rating || 5;
		reviewForm.update(rating);
		setReviewDetails(reviewForm);
	}, [reservationId]);

	function updateReviewDetails(control: RsFormControl) {
		if (control.key === 'reservationId') {
			setReservationId(control.value as number);
		}
		setReviewDetails(reviewDetails.clone().update(control));
	}

	function renderSelectOptions() {
		return props.stays.map((item) => {
			return { value: item.id, label: item.name };
		});
	}

	async function saveReview() {
		let isValid = await reviewDetails.isValid();
		if (!isValid) return rsToastify.error('Please Select a stay and add a message', 'Missing Info');
		let data = reviewDetails.toModel<Api.Review.Req.Create>();
		try {
			let res = await reviewService.create(data);
			rsToastify.success('Your review has been submitted', 'Success!');
			const { reservationId, message, rating } = reviewDetails.toModel();
			props.updateReview(reservationId, rating, message);
			popupController.close(LeaveAReviewPopup);
		} catch (e) {
			rsToastify.error(
				WebUtils.getRsErrorMessage(e, 'An unknown server error has occurred, try again.'),
				'Server Error'
			);
		}
	}

	return (
		<Popup opened={props.opened}>
			<Paper className={'rsLeaveAReviewPopup'} position={'relative'}>
				<Icon
					iconImg={'icon-close'}
					onClick={() => {
						popupController.close(LeaveAReviewPopup);
					}}
					cursorPointer
				/>
				<Box display={'flex'} padding={'25px 50px'} alignItems={'center'}>
					<img src={props.destinationLogo} alt={props.destinationName} />
					<Label ml={20} variant={'h2'}>
						{props.destinationName}
					</Label>
				</Box>
				<hr />
				<Box padding={'25px 50px'}>
					<Label mb={8} variant={'h1'}>
						Leave us a rating
					</Label>
					<StarRatingSelect
						numberOfStars={5}
						onRatingSelect={(value) => {
							let newRating = reviewDetails.get('rating');
							newRating.value = value;
							updateReviewDetails(newRating);
						}}
					/>
					<LabelSelect
						title={'Select Your Stay'}
						control={reviewDetails.get('reservationId')}
						updateControl={updateReviewDetails}
						options={renderSelectOptions()}
					/>
					<LabelInput
						title={''}
						disabled={hasAReview}
						inputType={'textarea'}
						control={reviewDetails.get('message')}
						updateControl={updateReviewDetails}
						placeholder={'Please give some details about your experience'}
					/>
					{!hasAReview && (
						<LabelButton
							look={'containedPrimary'}
							variant={'button'}
							label={'Submit Rating'}
							onClick={() => {
								saveReview().catch(console.error);
							}}
						/>
					)}
				</Box>
			</Paper>
		</Popup>
	);
};

export default LeaveAReviewPopup;
