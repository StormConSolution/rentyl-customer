import { useEffect, useState } from 'react';
import globalState, { setRecoilExternalValue } from '../models/globalState';
import serviceFactory from '../services/serviceFactory';
import CompanyService from '../services/company/company.service';

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

	return isCompanyLoaded;
}
