import rsToasts from '@bit/redsky.framework.toast';
import CustomToast from '../components/customToast/CustomToast';
import { useEffect } from 'react';

export function useSetCustomToast() {
	useEffect(() => {
		rsToasts.setRenderDelegate(CustomToast);
	}, []);
}
