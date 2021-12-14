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

	function renderSmallBreadCrumbs() {
		return (
			<div className={'smallBreadCrumbs'}>
				<div className={handleClasses('info', 0)}>
					<Label className={'stageTitle'} variant={'customEight'}>
						Info
					</Label>
					<div className={'numberBubble'}>1</div>
				</div>
				<div className={'smallDivider'} />
				<div className={handleClasses('payment', 1)}>
					<Label className={'stageTitle'} variant={'customEight'}>
						Payment
					</Label>
					<div className={'numberBubble'}>2</div>
				</div>
				<div className={'smallDivider'} />
				<div className={handleClasses('reviewAndBook', 2)}>
					<Label className={'stageTitle'} variant={'customEight'}>
						Book
					</Label>
					<div className={'numberBubble'}>3</div>
				</div>
				<div className={'smallDivider'} />
				<div className={handleClasses('confirmation', 3)}>
					<Label className={'stageTitle'} variant={'customEight'}>
						Confirmation
					</Label>
					<div className={'numberBubble'}>4</div>
				</div>
			</div>
		);
	}

	function handleCheckoutTitle() {
		if (props.activeStage > 2) {
			return 'Confirmation';
		}
		return 'Checkout';
	}

	return (
		<div className={'rsCheckoutBreadcrumbs'}>
			<div className={'backBarWrapper'}>
				{size !== 'small' && renderBreadCrumbs()}
				<div className={'backButtonWrapper'} onClick={props.onBackButtonClick}>
					<Icon
						className={'backButton'}
						iconImg={'icon-chevron-thin-down'}
						size={size === 'small' ? 25 : 38}
					/>
				</div>
				<div className={'checkoutTitle'}>
					<Label variant={'pointsPageCustomTwo'}>{handleCheckoutTitle()}</Label>
				</div>
			</div>
			{size === 'small' && renderSmallBreadCrumbs()}
		</div>
	);
};

export default CheckoutBreadcrumbs;
