import * as React from 'react';
import './PersonalInformation.scss';
import Label from '@bit/redsky.framework.rs.label';
import Icon from '@bit/redsky.framework.rs.icon';
import UserCheckoutInfo = Misc.UserCheckoutInfo;

interface PersonalInformationProps {
	personalInfo: UserCheckoutInfo;
	billingInfo: UserCheckoutInfo;
	onEditClickCallback?: () => void;
}

const PersonalInformation: React.FC<PersonalInformationProps> = (props) => {
	return (
		<div className={'rsPersonalInformation'}>
			<div className={'personalInformationWrapper'}>
				<Label className={'sectionTitle'}>Personal Information</Label>
				<Label className={'name'}>
					{props.personalInfo.firstName} {props.personalInfo.lastName}
				</Label>
				<Label className={'street'}>
					{props.personalInfo.address1} {props.personalInfo.address2}
				</Label>
				<Label className={'city'}>{props.personalInfo.city}</Label>
				<Label className={'state'}>{props.personalInfo.state}</Label>
				<Label className={'zipcode'}>{props.personalInfo.zip}</Label>
			</div>
			<div className={'billingAddressWrapper'}>
				<Label className={'sectionTitle'}>Billing Address</Label>
				<Label className={'name'}>
					{props.billingInfo.firstName} {props.billingInfo.lastName}
				</Label>
				<Label className={'street'}>
					{props.billingInfo.address1} {props.billingInfo.address2}
				</Label>
				<Label className={'city'}>{props.billingInfo.city}</Label>
				<Label className={'state'}>{props.billingInfo.state}</Label>
				<Label className={'zipcode'}>{props.billingInfo.zip}</Label>
			</div>
			{!!props.onEditClickCallback && (
				<Icon
					className={'editIcon'}
					iconImg={'icon-edit'}
					size={32}
					color={'black'}
					onClick={props.onEditClickCallback}
				/>
			)}
		</div>
	);
};

export default PersonalInformation;
