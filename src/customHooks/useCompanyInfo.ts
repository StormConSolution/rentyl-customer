import { useEffect, useState } from 'react';
import globalState, { setRecoilExternalValue } from '../state/globalState';
import serviceFactory from '../services/serviceFactory';
import CompanyService from '../services/company/company.service';
import { rsToastify } from '@bit/redsky.framework.rs.toastify';
import { WebUtils } from '../utils/utils';

export default function useCompanyInfo(): boolean {
	const [isCompanyLoaded, setIsCompanyLoaded] = useState<boolean>(false);
	const companyService = serviceFactory.get<CompanyService>('CompanyService');

	useEffect(() => {
		async function getCompanyInfo() {
			try {
				let res = await companyService.getCompanyDetails();
				setRecoilExternalValue<Api.Company.Res.GetCompanyAndClientVariables>(globalState.company, res);
				setIsCompanyLoaded(true);
				document.title = res.name;
			} catch (e) {
				setIsCompanyLoaded(false);
				rsToastify.error(WebUtils.getRsErrorMessage(e, 'Server error has occurred.'), 'Server Error!');
			}
		}
		getCompanyInfo().catch(console.error);
	}, []);

	return isCompanyLoaded;
}
