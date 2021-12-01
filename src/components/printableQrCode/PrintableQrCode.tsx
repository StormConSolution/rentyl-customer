import * as React from 'react';
import './PrintableQrCode.scss';
import Label from '@bit/redsky.framework.rs.label';

interface PrintableQrCodeProps {
	qrCode: string;
}

const FONT_COLOR = '#001933';

const PrintableQrCode: React.FC<PrintableQrCodeProps> = (props) => {
	return (
		<div className={'rsPrintableQrCode'}>
			<Label className={'title'} color={FONT_COLOR}>
				Login/Sign up for Spire!
			</Label>
			<Label className={'description'}>
				When signing up for Spire Loyalty by Rentyl Resorts you are able to view your reservation, get exclusive
				deal and earn points for your stay!
			</Label>
			<img className={'qrCode'} src={props.qrCode} alt={'qr code'} />
			<div className={'scanMeWrapper'}>
				<div className={'phoneIcon'} />
				<Label className={'scanMeText'} color={'white'}>
					SCAN ME
				</Label>
			</div>
		</div>
	);
};

export default PrintableQrCode;
