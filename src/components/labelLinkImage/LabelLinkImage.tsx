import React from 'react';
import './LabelLinkImage.scss';
import Label from '@bit/redsky.framework.rs.label';
import { Link } from '@bit/redsky.framework.rs.996';
import IconLabel from '../iconLabel/IconLabel';

interface LabelLinkImageProps {
	mainImg: string;
	textOnImg: string;
	linkPath: string;
	className?: string;
}

const LabelLinkImage: React.FC<LabelLinkImageProps> = (props) => {
	function renderStyles() {
		let styles: any = {
			backgroundImage: `url(${props.mainImg})`,
			height: '160px',
			width: '278px'
		};
		return styles;
	}
	return (
		<div className={`rsLabelLinkImage ${props.className || ''}`} style={renderStyles()}>
			<div className={'textLinkDiv'}>
				<Label className={'labelText'} variant={'h3'}>
					{props.textOnImg}
				</Label>
				<Link className={'linkText'} path={props.linkPath}>
					<IconLabel
						labelName={'see category'}
						labelVariant={'caption'}
						iconSize={7}
						iconPosition={'right'}
						iconImg={'icon-chevron-right'}
					/>
				</Link>
			</div>
		</div>
	);
};

export default LabelLinkImage;
