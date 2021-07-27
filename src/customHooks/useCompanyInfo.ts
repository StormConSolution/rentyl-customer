import { useEffect, useState } from 'react';
import globalState, { setRecoilExternalValue } from '../models/globalState';
import serviceFactory from '../services/serviceFactory';
import CompanyService from '../services/company/company.service';
import router from '../utils/router';
import { WebUtils } from '../utils/utils';
import http from '../utils/http';

export default function useCompanyInfo(): boolean {
	const [isCompanyLoaded, setIsCompanyLoaded] = useState<boolean>(false);
	const companyService = serviceFactory.get<CompanyService>('CompanyService');

	useEffect(() => {
		async function getCompanyInfo() {
			let res = await companyService.getCompanyDetails();
			setRecoilExternalValue<Api.Company.Res.GetCompanyAndClientVariables>(globalState.company, res);
			setIsCompanyLoaded(true);
		}
		getCompanyInfo().catch(console.error);
	}, []);

	useEffect(() => {
		if (!WebUtils.isLocalHost()) return;
		router.subscribeToAfterRouterNavigate(() => {
			let searchParams = new URLSearchParams(window.location.search);
			if (searchParams.has('company_id')) return;

			searchParams.append('company_id', http.currentConfig().headers['company-id']);
			window.history.replaceState(
				null,
				'',
				window.location.toString().split('?')[0] + '?' + searchParams.toString()
			);
		});
	}, []);

	return isCompanyLoaded;
}
