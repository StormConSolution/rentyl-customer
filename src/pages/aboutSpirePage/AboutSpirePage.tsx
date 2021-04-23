import * as React from 'react';
import './AboutSpirePage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import HeroImage from '../../components/heroImage/HeroImage';
import Paper from '../../components/paper/Paper';

interface AboutSpirePageProps {}

const AboutSpirePage: React.FC<AboutSpirePageProps> = (props) => {
	return (
		<Page className={'rsAboutSpirePage'}>
			<HeroImage
				image={require('../../images/aboutSpirePage/family-hugging.png')}
				height={'630px'}
				mobileHeight={'430px'}
			>
				<Paper boxShadow width={'536px'} padding={'50px'}></Paper>
			</HeroImage>
		</Page>
	);
};

export default AboutSpirePage;
