import * as React from 'react';
import './CheckoutBreadcrumbs.scss';
import Icon from '@bit/redsky.framework.rs.icon';

interface CheckoutBreadcrumbsProps {
	activeStage: number;
	onBackButtonClick: () => void;
}

const CheckoutBreadcrumbs: React.FC<CheckoutBreadcrumbsProps> = (props) => {
	function handleClasses(stage: string, position: number) {
		if (position === props.activeStage) {
			return `${stage} active`;
		}

		return stage;
	}

	return (
		<div className={'rsCheckoutBreadcrumbs'}>
			<div className={'breadcrumbs'}>
				<div className={handleClasses('info', 0)}>Info</div>
				<div className={'divider'} />
				<div className={handleClasses('payment', 1)}>Payment</div>
				<div className={'divider'} />
				<div className={handleClasses('reviewAndBook', 2)}>Review & Book</div>
				<div className={'divider'} />
				<div className={handleClasses('confirmation', 3)}>Confirmation</div>
			</div>
			<div className={'backButtonWrapper'} onClick={props.onBackButtonClick}>
				<Icon className={'backButton'} iconImg={'icon-chevron-thin-down'} size={38} />
			</div>
		</div>
	);
};

export default CheckoutBreadcrumbs;
