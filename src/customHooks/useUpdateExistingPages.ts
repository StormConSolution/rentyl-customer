import { useEffect } from 'react';
import { WebUtils } from '../utils/utils';
import rsToasts from '@bit/redsky.framework.toast';
import routes from '../routes';
import serviceFactory from '../services/serviceFactory';
import CompanyService from '../services/company/company.service';

export function useUpdateExistingPages() {
	const companyService = serviceFactory.get<CompanyService>('CompanyService');
	useEffect(() => {
		async function updateExistingPages() {
			let newPages: Model.PageGuard[] = [...routes].map((item) => {
				return {
					//@ts-ignore
					page: item.page.name,
					route: item.path,
					reRoute: '',
					isActive: 1
				};
			});
			try {
				const response = await companyService.updateAvailablePages({ availablePages: newPages });
				if (response) console.log('PAGES UPDATED');
			} catch (e) {
				rsToasts.error(WebUtils.getAxiosErrorMessage(e), 'Server Error', 8000);
			}
		}

		updateExistingPages().catch(console.error);
	}, []);
}
