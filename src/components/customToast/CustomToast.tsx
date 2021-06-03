import * as React from 'react';
import './CustomToast.scss';
import { ToastType, ToastProps } from '@bit/redsky.framework.toast';

import Label from '@bit/redsky.framework.rs.label/dist/Label';
import { Box } from '@bit/redsky.framework.rs.996';
import Icon from '@bit/redsky.framework.rs.icon';

const CustomToast: React.FC<ToastProps> = (props) => {
	let classes = ['rsToastContainer'];

	if (props.display && !props.closing) classes.push('toggleIn');
	else if (props.display && props.closing) classes.push('toggleOut');
	else if (!props.display) return <></>;

	if (props.type === ToastType.SUCCESS) classes.push('success');
	else if (props.type === ToastType.ERROR) classes.push('error');
	else if (props.type === ToastType.WARNING) classes.push('warning');
	else if (props.type === ToastType.INFO) classes.push('info');
	else classes.push('customToast');

	function renderIcon() {
		if (props.type === ToastType.ERROR) return <Icon iconImg={'icon-exclamation-circle'} size={21} />;
		if (props.type === ToastType.WARNING) return <Icon iconImg={'icon-exclamation-circle'} size={21} />;
		else if (props.type === ToastType.SUCCESS) return <Icon iconImg={'icon-solid-check-circle'} size={21} />;
		else if (props.type === ToastType.INFO) return <Icon iconImg={'icon-solid-info-circle'} size={21} />;
		else if (props.type === ToastType.CUSTOM) return <Icon iconImg={'icon-exclamation-circle'} size={21} />;
	}

	return (
		<Box className={classes.join(' ')}>
			<Box width={3} height={47} className={'verticalLine'} mr={12} />
			{renderIcon()}
			<Box>
				<Label variant={'subtitle1'}>{props.title}</Label>
				<Label variant={'body2'}>{props.msg}</Label>
			</Box>
		</Box>
	);
};
export default CustomToast;
