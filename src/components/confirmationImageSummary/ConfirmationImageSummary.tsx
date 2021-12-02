import * as React from 'react';
import './ConfirmationImageSummary.scss';

interface ConfirmationImageSummaryProps {
	images: string[];
}

const ConfirmationImageSummary: React.FC<ConfirmationImageSummaryProps> = (props) => {
	if (props.images.length < 3) {
		throw Error('Confirmation Image Summary requires at least three images.');
	}

	return (
		<div className={'rsConfirmationImageSummary'}>
			<img className={'confirmationImage hero'} src={props.images[0]} alt={'hero Image'} />
			<img className={'confirmationImage'} src={props.images[1]} alt={'secondary image'} />
			<img className={'confirmationImage'} src={props.images[2]} alt={'secondary image'} />
		</div>
	);
};

export default ConfirmationImageSummary;
