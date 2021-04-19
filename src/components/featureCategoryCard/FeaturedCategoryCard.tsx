import React from 'react';
import './FeaturedCategoryCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import IconLabel from '../iconLabel/IconLabel';
import FeaturedCategory = Model.FeaturedCategory;

interface LabelLinkImageProps {
	category: FeaturedCategory;
	onClick: (categoryId: number | string) => void;
	className?: string;
}

const FeaturedCategoryCard: React.FC<LabelLinkImageProps> = (props) => {
	function renderStyles() {
		let styles: any = {
			backgroundImage: `url(${props.category.imagePath})`,
			height: '160px',
			width: '278px'
		};
		return styles;
	}
	return (
		<div className={`rsFeaturedCategoryCard ${props.className || ''}`} style={renderStyles()}>
			<div className={'textSeeCategoryDiv'}>
				<Label className={'labelText'} variant={'h3'}>
					{props.category.name}
				</Label>
				<div
					className={'seeCategoryText'}
					onClick={() => {
						props.onClick(props.category.categoryId);
					}}
				>
					<IconLabel
						labelName={'see category'}
						labelVariant={'caption'}
						iconSize={7}
						iconPosition={'right'}
						iconImg={'icon-chevron-right'}
					/>
				</div>
			</div>
		</div>
	);
};

export default FeaturedCategoryCard;
