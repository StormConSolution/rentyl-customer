import * as React from 'react';
import './SuccessPage.scss';
import { Box, Link, Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import router from '../../utils/router';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';

interface SuccessPageProps {}
type SuccessData = {
	confirmationCode: string;
	destinationName: string;
};

const SuccessPage: React.FC<SuccessPageProps> = (props) => {
	const params = router.getPageUrlParams<{ data: any }>([{ key: 'data', default: 0, type: 'string', alias: 'data' }]);
	let successData: SuccessData = JSON.parse(params.data);

	return (
		<Page className={'rsSuccessPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box className={'contentWrapper'}>
					<img src={require('../../images/FullLogo-StandardBlack.png')} alt={'Spire Logo'} />
					<Label variant={'h1'} mt={20}>
						Thank you for your reservation at
						<br /> <span>{successData.destinationName}</span>
						<br /> Your confirmation code is: <span>{successData.confirmationCode}</span>. Access all your
						reservations <Link path={'/'}>here</Link>.
					</Label>
				</Box>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default SuccessPage;
