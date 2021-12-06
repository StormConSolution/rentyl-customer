import * as React from 'react';
import './CheckoutBreadcrumbs.scss';
import Icon from '@bit/redsky.framework.rs.icon';
import Label from '@bit/redsky.framework.rs.label';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';

interface CheckoutBreadcrumbsProps {
	activeStage: number;
	onBackButtonClick: () => void;
}

const CheckoutBreadcrumbs: React.FC<CheckoutBreadcrumbsProps> = (props) => {
	const size = useWindowResizeChange();
	function handleClasses(stage: string, position: number) {
		if (position === props.activeStage) {
			return `${stage} active`;
		}

		return stage;
	}

	function renderBreadCrumbs() {
		if (size === 'small') {
			return (
				<div className={'smallBreadCrumbs'}>
					<div className={handleClasses('info', 0)}>
						<Label variant={'customEight'}>Info</Label>
						<div className={'numberBubble'}>1</div>
					</div>
					<div className={'smallDivider'} />
					<div className={handleClasses('billing', 1)}>
						<Label variant={'customEight'}>Billing</Label>
						<div className={'numberBubble'}>2</div>
					</div>
					<div className={'smallDivider'} />
					<div className={handleClasses('book', 2)}>
						<Label variant={'customEight'}>Book</Label>
						<div className={'numberBubble'}>3</div>
					</div>
				</div>
			);
		}
		return (
			<div className={'breadcrumbs'}>
				<div className={handleClasses('info', 0)}>Info</div>
				<div className={'divider'} />
				<div className={handleClasses('payment', 1)}>Payment</div>
				<div className={'divider'} />
				<div className={handleClasses('reviewAndBook', 2)}>Review & Book</div>
				<div className={'divider'} />
				<div className={handleClasses('confirmation', 3)}>Confirmation</div>
			</div>
		);
	}

	return (
		<div className={'rsCheckoutBreadcrumbs'}>
			{renderBreadCrumbs()}
			<div className={'backButtonWrapper'} onClick={props.onBackButtonClick}>
				<Icon className={'backButton'} iconImg={'icon-chevron-thin-down'} size={38} />
			</div>
			<div className={'checkoutTitle'}>
				<Label variant={'h5'}>Checkout</Label>
			</div>
		</div>
	);
};

export default CheckoutBreadcrumbs;
