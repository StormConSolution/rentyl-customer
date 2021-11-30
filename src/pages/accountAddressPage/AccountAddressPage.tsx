import * as React from 'react';
import './AccountAddressPage.scss';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import AccountAddressMobilePage from './accountAddressMobilePage/AccountAddressMobilePage';
import AccountAddressResponsivePage from './accountAddressResponsivePage/AccountAddressResponsivePage';

const AccountAddressPage: React.FC = () => {
	const size = useWindowResizeChange();

	return size === 'small' ? <AccountAddressMobilePage /> : <AccountAddressResponsivePage />;
};

export default AccountAddressPage;
