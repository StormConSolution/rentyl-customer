import * as React from 'react';
import './CustomToast.scss';
import { ToastType, ToastProps } from '@bit/redsky.framework.toast';

import { MdErrorOutline } from 'react-icons/md';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { BsInfo } from 'react-icons/bs';
import { MdFingerprint } from 'react-icons/md';

const CustomToast: React.FC<ToastProps> = ({ msg, type, display, closing }: ToastProps) => {
	let classes = ['rsToastContainer'];

	if (display && !closing) classes.push('toggleIn');
	else if (display && closing) classes.push('toggleOut');
	else if (!display) return <></>;

	if (type === ToastType.SUCCESS) classes.push('success');
	else if (type === ToastType.ERROR) classes.push('error');
	else if (type === ToastType.INFO) classes.push('info');
	else classes.push('customToast');

	function renderIcon() {
		if (type === ToastType.ERROR) return <MdErrorOutline color="red" size={35} />;
		else if (type === ToastType.SUCCESS) return <AiOutlineCheckCircle color="green" size={35} />;
		else if (type === ToastType.INFO) return <BsInfo color="dodgerblue" size={35} />;
		else if (type === ToastType.CUSTOM) return <MdFingerprint color="black" size={35} />;
	}

	return (
		<div className={classes.join(' ')}>
			<div className="content">
				<div className="iconContainer">{renderIcon()}</div>
				{msg}
			</div>
		</div>
	);
};
export default CustomToast;
