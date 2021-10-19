import React from 'react';
import './FeaturedCategoryCard.scss';
import Label from '@bit/redsky.framework.rs.label';
import IconLabel from '../../../components/iconLabel/IconLabel';
import FeaturedCategory = Misc.FeaturedCategory;

interface FeaturedCategoryCardProps {
	category: FeaturedCategory;
	onClick: (categoryId: number) => void;
	className?: string;
}

const FeaturedCategoryCard: React.FC<FeaturedCategoryCardProps> = (props) => {
	function renderStyles() {
		let styles: any = {
			backgroundImage: `url(${props.category.imagePath}?tr=w-$556,tr=h-320)`,
			height: '160px',
			width: '278px',
			backgroundSize: 'cover',
			backgroundRepeat: 'no-repeat'
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
