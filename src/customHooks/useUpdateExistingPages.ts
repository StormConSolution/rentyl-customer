import { useEffect } from 'react';
import { WebUtils } from '../utils/utils';
import routes from '../routes';
import serviceFactory from '../services/serviceFactory';
import CompanyService from '../services/company/company.service';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';

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
				await companyService.updateAvailablePages({ availablePages: newPages });
			} catch (e) {
				rsToastify.error(
					WebUtils.getRsErrorMessage(e, 'An unexpected server error has occurred'),
					'Server Error'
				);
			}
		}

		updateExistingPages().catch(console.error);
	}, []);
}
