import React from 'react';
import { Page, popupController } from '@bit/redsky.framework.rs.996';
import './DashboardPage.scss';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import Box from '../../components/box/Box';
import { useSetRecoilState } from 'recoil';
import globalState, { AvailableThemes } from '../../models/globalState';
import Button from '@bit/redsky.framework.rs.button';
import rsToasts, { RsToasts } from '@bit/redsky.framework.toast';
import TestPopup from '../../popups/testPopup/TestPopup';

const DashboardPage: React.FC = () => {
	const setTheme = useSetRecoilState<AvailableThemes>(globalState.theme);

	function changeTheme(theme: AvailableThemes) {
		setTheme(theme);
	}

	return (
		<Page className="rsDashboardPage">
			<Box>
				<Label>Dashboard</Label>
			</Box>
			<Label>Plots Go Here</Label>
			<Box>
				<Box
					className="themeButtons"
					bgcolor={'green'}
					color={'white'}
					m={10}
					p={'10px 20px'}
					border={1}
					display={'inline-block'}
					onClick={() => {
						changeTheme('green');
					}}
				>
					Click Theme Green
				</Box>
				<Box
					className="themeButtons"
					bgcolor={'blue'}
					color={'white'}
					m={10}
					p={'10px 20px'}
					border={1}
					display={'inline-block'}
					onClick={() => {
						changeTheme('blue');
					}}
				>
					Click Theme Blue
				</Box>
			</Box>
			<Box display={'flex'}>
				<Button
					look={'containedPrimary'}
					onClick={() => {
						rsToasts.error('THIS IS AN ERROR TOAST!');
					}}
				>
					Toast Error
				</Button>
				<Button
					look={'containedPrimary'}
					onClick={() => {
						popupController.open(TestPopup);
					}}
				>
					Popup
				</Button>
			</Box>
		</Page>
	);
};

export default DashboardPage;
