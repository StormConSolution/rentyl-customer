import * as React from 'react';
import './AccountNotificationPreferences.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import AccountHeader from '../../components/accountHeader/AccountHeader';
import Box from '@bit/redsky.framework.rs.996/dist/box/Box';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import NotificationTile from '../../components/notificationTile/NotificationTile';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';

interface AccountNotificationPreferencesProps {}

const AccountNotificationPreferences: React.FC<AccountNotificationPreferencesProps> = (props) => {
	return (
		<Page className={'rsAccountNotificationPreferences'}>
			<div className={'rs-page-content-wrapper'}>
				<AccountHeader selected={'NOTIFICATION_PREFERENCES'} />
				<Box width={'920px'} margin={'60px auto 120px'}>
					<Label variant={'h2'}>Notification preferences</Label>
					<Box marginBottom={'60px'}>
						<Box display={'flex'}>
							<Label variant={'h3'}>Invoicing</Label>
							<Box display={'flex'} justifyContent={'space-between'} marginLeft={'auto'} width={'100px'}>
								<Label variant={'h3'}>Email</Label>
								<Label variant={'h3'}>Text</Label>
							</Box>
						</Box>
						<NotificationTile
							title={'Service reminders'}
							description={
								'Get reminders based on your upcoming or recently completed services. (One required)'
							}
							onChangeEmail={(value) => {
								if (value === 'SELECT') {
									console.log('Email Selected');
								} else {
									console.log('Email Deselected');
								}
							}}
							onChangeText={(value) => {
								if (value === 'SELECT') {
									console.log('Text Selected');
								} else {
									console.log('Text Deselected');
								}
							}}
							isTextSelected={false}
							isEmailSelected={false}
						/>
						<NotificationTile
							title={'Billing reminders and notices'}
							description={
								'This includes bill reminders, payment receipts, expired credit cards, or payment failures. (One required).'
							}
							onChangeEmail={(value) => {
								if (value === 'SELECT') {
									console.log('Email Selected');
								} else {
									console.log('Email Deselected');
								}
							}}
							onChangeText={(value) => {
								if (value === 'SELECT') {
									console.log('Text Selected');
								} else {
									console.log('Text Deselected');
								}
							}}
							isTextSelected={false}
							isEmailSelected={false}
						/>
					</Box>
					<Label variant={'h3'}>Marketing communications</Label>
					<NotificationTile
						title={'Promotional content'}
						description={
							'This includes free offers, giveaways, and opportunities to win prizes and service discounts.'
						}
						onChangeEmail={(value) => {
							if (value === 'SELECT') {
								console.log('Email Selected');
							} else {
								console.log('Email Deselected');
							}
						}}
						onChangeText={(value) => {
							if (value === 'SELECT') {
								console.log('Text Selected');
							} else {
								console.log('Text Deselected');
							}
						}}
						isTextSelected={false}
						isEmailSelected={false}
					/>
					<NotificationTile
						title={'Informational content'}
						description={
							'These messages include referral requests, newsletters, and updates about Spire and their partners across the web.'
						}
						onChangeEmail={(value) => {
							if (value === 'SELECT') {
								console.log('Email Selected');
							} else {
								console.log('Email Deselected');
							}
						}}
						onChangeText={(value) => {
							if (value === 'SELECT') {
								console.log('Text Selected');
							} else {
								console.log('Text Deselected');
							}
						}}
						isTextSelected={false}
						isEmailSelected={false}
					/>
				</Box>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default AccountNotificationPreferences;
