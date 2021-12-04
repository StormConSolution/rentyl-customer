import * as React from 'react';
import './PrintableQrCode.scss';
import Label from '@bit/redsky.framework.rs.label';
import QRCode from 'qrcode.react';

interface PrintableQrCodeProps {
	qrCodeValue: string;
}

const PrintableQrCode: React.FC<PrintableQrCodeProps> = (props) => {
	return (
		<div className={'rsPrintableQrCode'}>
			<Label className={'title'}>Login/Sign up for Spire!</Label>
			<Label className={'description'}>
				When signing up for Spire Loyalty by Rentyl Resorts you are able to view your reservation, get exclusive
				deal and earn points for your stay!
			</Label>
			<QRCode className={'qrCode'} value={props.qrCodeValue} />
			<div className={'scanMeWrapper'}>
				<div className={'phoneIcon'} />
				<Label className={'scanMeText'}>SCAN ME</Label>
			</div>
		</div>
	);
};

export default PrintableQrCode;
