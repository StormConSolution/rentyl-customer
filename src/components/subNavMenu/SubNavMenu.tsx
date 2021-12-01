import * as React from 'react';
import './SubNavMenu.scss';
import { useEffect, useState } from 'react';
import useWindowScrollChange from '../../customHooks/useWindowScrollChange';
import Button from '@bit/redsky.framework.rs.button';
import Icon from '@bit/redsky.framework.rs.icon';
import router from '../../utils/router';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import useWindowResizeChange from '../../customHooks/useWindowResizeChange';
import { useRecoilValue } from 'recoil';
import globalState from '../../state/globalState';
import LabelButton from '../labelButton/LabelButton';
import { Box } from '@bit/redsky.framework.rs.996';
import { StringUtils } from '../../utils/utils';

type PageRefs = {
	galleryRef: React.RefObject<HTMLElement>;
	overviewRef: React.RefObject<HTMLElement>;
	experiencesRef: React.RefObject<HTMLElement>;
	availableStaysRef: React.RefObject<HTMLElement>;
};

interface SubNavMenuProps {
	title?: string;
	pageRefs?: PageRefs;
}

const SubNavMenu: React.FC<SubNavMenuProps> = (props) => {
	const scrollDirection = useWindowScrollChange();
	const size = useWindowResizeChange();
	const lastUrlPath = useRecoilValue<string>(globalState.lastNavigationPath);
	const [selected, setSelected] = useState<'gallery' | 'overview' | 'experiences' | 'availableStays'>('gallery');
	const subNavBarHeight = parseInt(StringUtils.removeAllExceptNumbers(getAppBarHeight()));

	function getAppBarHeight() {
		let appBar = document.querySelector('.rsAppBar');
		if (!appBar) return '0px';
		else return appBar.scrollHeight + 'px';
	}

	return (
		<div
			className={`rsSubNavMenu ${scrollDirection === 'DOWN' ? 'moveUp' : ''}`}
			style={{ top: getAppBarHeight() }}
		>
			<Button
				className={'backButton'}
				look={'none'}
				onClick={() => {
					router.navigate(lastUrlPath).catch(console.error);
				}}
			>
				<Icon iconImg={'icon-chevron-left'} size={size === 'small' ? 13 : 20} />
			</Button>
			{!props.pageRefs ? (
				<Label ml={size === 'small' ? 20 : 33} variant={size === 'small' ? 'customTen' : 'customNine'}>
					{props.title}
				</Label>
			) : (
				<Box className={'destinationPageRefsWrapper'}>
					<LabelButton
						className={`refButton ${selected === 'gallery' ? 'selected' : ''}`}
						look={'none'}
						variant={'customTen'}
						label={'Gallery'}
						onClick={() => {
							window.scrollTo({ top: 0, behavior: 'smooth' });
							setSelected('gallery');
						}}
					/>
					<LabelButton
						className={`refButton ${selected === 'overview' ? 'selected' : ''}`}
						look={'none'}
						variant={'customTen'}
						label={'Overview'}
						onClick={() => {
							if (!props.pageRefs) return;
							let ref = props.pageRefs.overviewRef.current;
							if (!ref) return;
							window.scrollTo({ top: ref.offsetTop - subNavBarHeight, behavior: 'smooth' });
							setSelected('overview');
						}}
					/>
					<LabelButton
						className={`refButton ${selected === 'experiences' ? 'selected' : ''}`}
						look={'none'}
						variant={'customTen'}
						label={'Experiences'}
						onClick={() => {
							if (!props.pageRefs) return;
							let ref = props.pageRefs.experiencesRef.current;
							if (!ref) return;
							window.scrollTo({ top: ref.offsetTop - subNavBarHeight, behavior: 'smooth' });
							setSelected('experiences');
						}}
					/>
					<LabelButton
						className={`refButton ${selected === 'availableStays' ? 'selected' : ''}`}
						look={'none'}
						variant={'customTen'}
						label={'Available Stays'}
						onClick={() => {
							if (!props.pageRefs) return;
							let ref = props.pageRefs.availableStaysRef.current;
							if (!ref) return;
							window.scrollTo({ top: ref.offsetTop - subNavBarHeight, behavior: 'smooth' });
							setSelected('availableStays');
						}}
					/>
					<LabelButton
						look={'containedPrimary'}
						variant={'customTwelve'}
						label={'Reserve Stay'}
						onClick={() => {
							if (!props.pageRefs) return;
							let ref = props.pageRefs.availableStaysRef.current;
							if (!ref) return;
							window.scrollTo({ top: ref.offsetTop - subNavBarHeight, behavior: 'smooth' });
						}}
					/>
				</Box>
			)}
		</div>
	);
};

export default SubNavMenu;
