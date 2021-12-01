import * as React from 'react';
import './PersonalInformation.scss';
import Label from '@bit/redsky.framework.rs.label';
import Icon from '@bit/redsky.framework.rs.icon';

interface CustomerInfo {
	fullName: string;
	street: string;
	city: string;
	state: string;
	zipcode: string;
}

interface PersonalInformationProps {
	personalInfo: CustomerInfo;
	billingInfo: CustomerInfo;
	onEditClickCallback?: () => void;
}

const PersonalInformation: React.FC<PersonalInformationProps> = (props) => {
	return (
		<div className={'rsPersonalInformation'}>
			<div className={'personalInformationWrapper'}>
				<Label className={'sectionTitle'}>Personal Information</Label>
				<Label className={'name'}>{props.personalInfo.fullName}</Label>
				<Label className={'street'}>{props.personalInfo.street}</Label>
				<Label className={'city'}>{props.personalInfo.city}</Label>
				<Label className={'state'}>{props.personalInfo.state}</Label>
				<Label className={'zipcode'}>{props.personalInfo.zipcode}</Label>
			</div>
			<div className={'billingAddressWrapper'}>
				<Label className={'sectionTitle'}>Billing Address</Label>
				<Label className={'name'}>{props.billingInfo.fullName}</Label>
				<Label className={'street'}>{props.billingInfo.street}</Label>
				<Label className={'city'}>{props.billingInfo.city}</Label>
				<Label className={'state'}>{props.billingInfo.state}</Label>
				<Label className={'zipcode'}>{props.billingInfo.zipcode}</Label>
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
