import React from 'react';
import { Popup } from '@bit/redsky.framework.rs.996';
import { PopupProps } from '@bit/redsky.framework.rs.996/dist/popup/Popup';

export interface FidelPrivacyPolicyProps extends PopupProps {
	path: string;
}
const FidelPrivacyPolicy: React.FC<FidelPrivacyPolicyProps> = (props) => {
	return (
		<Popup opened={props.opened}>
			<iframe src={props.path} style={{ width: '800px', height: '800px', background: 'white' }} />
		</Popup>
	);
};
export default FidelPrivacyPolicy;
