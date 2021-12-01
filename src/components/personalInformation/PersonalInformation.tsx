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

const FONT_COLOR = '#001933';

const PersonalInformation: React.FC<PersonalInformationProps> = (props) => {
	return (
		<div className={'rsPersonalInformation'}>
			<div className={'personalInformationWrapper'}>
				<Label className={'sectionTitle'} color={FONT_COLOR}>
					Personal Information
				</Label>
				<Label className={'name'} color={FONT_COLOR}>
					{props.personalInfo.fullName}
				</Label>
				<Label className={'street'} color={FONT_COLOR}>
					{props.personalInfo.street}
				</Label>
				<Label className={'city'} color={FONT_COLOR}>
					{props.personalInfo.city}
				</Label>
				<Label className={'state'} color={FONT_COLOR}>
					{props.personalInfo.state}
				</Label>
				<Label className={'zipcode'} color={FONT_COLOR}>
					{props.personalInfo.zipcode}
				</Label>
			</div>
			<div className={'billingAddressWrapper'}>
				<Label className={'sectionTitle'} color={FONT_COLOR}>
					Billing Address
				</Label>
				<Label className={'name'} color={FONT_COLOR}>
					{props.billingInfo.fullName}
				</Label>
				<Label className={'street'} color={FONT_COLOR}>
					{props.billingInfo.street}
				</Label>
				<Label className={'city'} color={FONT_COLOR}>
					{props.billingInfo.city}
				</Label>
				<Label className={'state'} color={FONT_COLOR}>
					{props.billingInfo.state}
				</Label>
				<Label className={'zipcode'} color={FONT_COLOR}>
					{props.billingInfo.zipcode}
				</Label>
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
