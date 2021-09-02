import * as React from 'react';
import './SuccessPage.scss';
import { Box, Link, Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import router from '../../utils/router';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';

interface SuccessPageProps {}
type SuccessData = {
	itineraryNumber: string;
	destinationName: string;
};

const SuccessPage: React.FC<SuccessPageProps> = (props) => {
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	let successData: SuccessData = JSON.parse(params.data);
	const company = useRecoilValue<Api.Company.Res.GetCompanyAndClientVariables>(globalState.company);

	return (
		<Page className={'rsSuccessPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box className={'contentWrapper'}>
					<img src={company.wideLogoUrl} alt={'Spire Logo'} />
					<Label variant={'h1'} mt={20}>
						Thank you for your reservation at
						<br /> <span>{successData.destinationName}</span>
						<br /> Your itinerary number is: <span>{successData.itineraryNumber}</span>.
						<br /> Access all your reservations <Link path={'/reservations'}>here</Link>.
					</Label>
				</Box>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default SuccessPage;
