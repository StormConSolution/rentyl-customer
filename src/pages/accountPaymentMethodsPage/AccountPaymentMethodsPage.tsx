import * as React from 'react';
import './AccountPaymentMethodsPage.scss';
import AccountPaymentMethodsResponsivePage from './accountPaymentMethodsResponsivePage/AccountPaymentMethodsResponsivePage';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import AccountPaymentMethodsMobilePage from './accountPaymentMethodsMobilePage/AccountPaymentMethodsMobilePage';

const AccountPaymentMethodsPage: React.FC = () => {
	const size = useWindowResizeChange();
	return size === 'small' ? <AccountPaymentMethodsMobilePage /> : <AccountPaymentMethodsResponsivePage />;
};

export default AccountPaymentMethodsPage;
