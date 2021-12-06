import * as React from 'react';
import './CarouselV2.scss';
import { useEffect, useRef, useState } from 'react';
import Img from '@bit/redsky.framework.rs.img';
import Button from '@bit/redsky.framework.rs.button';
import Icon from '@bit/redsky.framework.rs.icon';
import router from '../../utils/router';
import Label from '@bit/redsky.framework.rs.label';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import { ObjectUtils } from '../../utils/utils';

interface CarouselV2Props {
	path: string | (() => void);
	imgPaths: string[];
	onAddCompareClick?: () => void;
	onRemoveCompareClick?: () => void;
	onGalleryClick?: () => void;
	destinationId?: number;
	hideCompareButton?: boolean;
}

const CarouselV2: React.FC<CarouselV2Props> = (props) => {
	const size = useWindowResizeChange();
	const comparisonState = useRecoilValue<Misc.ComparisonState>(globalState.destinationComparison);
	const parentRef = useRef<HTMLDivElement>(null);
	const totalChildren = props.imgPaths.length;
	const [imageViewIndex, setImageViewIndex] = useState<number>(1);

	useEffect(() => {
		setTimeout(() => {
			if (!parentRef.current) return;
			parentRef.current!.scrollTo({ top: 0, left: 0 });
		}, 50);
	}, []);

	function renderImages() {
		return props.imgPaths.map((item, index) => {
			return (
				<Img
					key={index}
					src={item}
					alt={'img alt'}
					width={size === 'small' ? 327 : 414}
					height={size === 'small' ? 220 : 278}
				/>
			);
		});
	}

	return (
		<div
			className={'rsCarouselV2'}
			onClick={() => {
				if (typeof props.path === 'string') router.navigate(props.path).catch(console.error);
				else props.path();
			}}
		>
			<div ref={parentRef} className={'imageCarouselContainer'}>
				{renderImages()}
			</div>
			<Button
				className={'clickLeft'}
				look={'none'}
				onClick={(event) => {
					event.stopPropagation();
					let val = parentRef.current!.scrollLeft - parentRef.current!.offsetWidth;
					setImageViewIndex(imageViewIndex - 1);
					if (imageViewIndex <= 1) {
						val = parentRef.current!.offsetWidth * totalChildren;
						setImageViewIndex(totalChildren);
					}
					parentRef.current!.scrollTo({ top: 0, left: val, behavior: 'smooth' });
				}}
			>
				<Icon iconImg={'icon-chevron-left'} color={'#001933'} size={8} />
			</Button>
			<Button
				className={'clickRight'}
				look={'none'}
				onClick={(event) => {
					event.stopPropagation();
					let val = parentRef.current!.offsetWidth + parentRef.current!.scrollLeft;
					setImageViewIndex(imageViewIndex + 1);
					if (imageViewIndex >= totalChildren) {
						val = 0;
						setImageViewIndex(1);
					}
					parentRef.current!.scrollTo({ top: 0, left: val, behavior: 'smooth' });
				}}
			>
				<Icon iconImg={'icon-chevron-right'} color={'#001933'} size={8} />
			</Button>
			{((size !== 'small' && !props.hideCompareButton) || comparisonState.showCompareButton) && (
				<Button
					className={'addToCompareButton'}
					look={'none'}
					disableRipple
					onClick={(event) => {
						event.stopPropagation();
						if (
							props.destinationId !== undefined &&
							ObjectUtils.isArrayWithData(comparisonState.destinationDetails) &&
							comparisonState.destinationDetails
								.map((details) => details.destinationId)
								.includes(props.destinationId)
						) {
							if (props.onRemoveCompareClick) props.onRemoveCompareClick();
						} else {
							if (props.onAddCompareClick) props.onAddCompareClick();
						}
					}}
				>
					<Icon
						iconImg={
							props.destinationId !== undefined &&
							ObjectUtils.isArrayWithData(comparisonState.destinationDetails) &&
							comparisonState.destinationDetails
								.map((details) => details.destinationId)
								.includes(props.destinationId)
								? 'icon-solid-check'
								: 'icon-plus'
						}
						color={'#ffffff'}
						size={
							props.destinationId !== undefined &&
							ObjectUtils.isArrayWithData(comparisonState.destinationDetails) &&
							comparisonState.destinationDetails
								.map((details) => details.destinationId)
								.includes(props.destinationId)
								? 16
								: 12
						}
					/>
					<div className={'compareToolTip'}>
						<div className={'toolTipTriangle'} />
						<Label className={'caption'}>Compare</Label>
					</div>
				</Button>
			)}
			<Button
				look={'none'}
				className={'imageCountContainer'}
				onClick={(event) => {
					event.stopPropagation();
					if (props.onGalleryClick) props.onGalleryClick();
				}}
			>
				<Icon iconImg={'icon-gallery'} color={'#ffffff'} size={18} />
				<Label variant={'subtitle1'}>{`${imageViewIndex} / ${totalChildren}`}</Label>
			</Button>
		</div>
	);
};

export default CarouselV2;
