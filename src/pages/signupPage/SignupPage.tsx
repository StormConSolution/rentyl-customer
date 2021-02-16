import * as React from 'react';
import './SignUpPage.scss';
import { Page } from '@bit/redsky.framework.rs.996';
import Footer from '../../components/footer/Footer';
import { FooterLinkTestData } from '../../components/footer/FooterLinks';
import Box from '../../components/box/Box';
import Label from '@bit/redsky.framework.rs.label';
import Paper from '../../components/paper/Paper';
import LabelInput from '../../components/labelInput/LabelInput';
import LabelButton from '../../components/labelButton/LabelButton';
import LabelLink from '../../components/labelLink/LabelLink';
import SignupOptionCheckboxes, { SignupOption } from '../../components/signupOptionCheckboxes/SignupOptionCheckboxes';
import SignupOptions from '../../components/signupOptionCheckboxes/SignupOptions';

interface SignUpPageProps {}

const SignUpPage: React.FC<SignUpPageProps> = (props) => {
	function getSignupOptions(): Array<SignupOption> {
		return SignupOptions;
	}

	function signupOptionClickPlaceholder(e: React.MouseEvent) {
		let inputValue = e.target as HTMLInputElement;
		if (inputValue.checked) console.log(inputValue.value);
	}

	return (
		<Page className={'rsSignUpPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Box display={'flex'} margin={'100px 0'} justifyContent={'center'}>
					<Box maxWidth={'480px'} marginRight={38}>
						<Label variant={'h1'}>Sign up for spire Loyalty</Label>
						<Label variant={'body1'}>
							Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
							invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
							et justo duo dolores et.
						</Label>
					</Box>
					<Box marginLeft={38}>
						<Paper
							width={'604px'}
							height={'844px'}
							boxShadow
							backgroundColor={'#FCFBF8'}
							position={'relative'}
						>
							<Box padding={'48px 92px'}>
								<Box display={'flex'} justifyContent={'space-between'}>
									<LabelInput
										title={'Name *'}
										placeholder={'First and Last'}
										onChange={(value) => console.log(value)}
										inputType={'text'}
									/>
									<LabelInput
										title={'Date Of Birth *'}
										placeholder={'MM/DD/YYYY'}
										onChange={(value) => console.log(value)}
										inputType={'text'}
									/>
								</Box>
								<LabelInput
									title={'Address *'}
									placeholder={'Street, Apartment or Suite'}
									onChange={(value) => console.log(value)}
									inputType={'text'}
								/>
								<Box display={'flex'} justifyContent={'space-between'}>
									<LabelInput
										title={'City *'}
										placeholder={'City'}
										onChange={(value) => console.log(value)}
										inputType={'text'}
									/>
									<LabelInput
										title={'Zip Code *'}
										placeholder={'Zip Code'}
										onChange={(value) => console.log(value)}
										inputType={'text'}
									/>
								</Box>
								<Box display={'flex'} justifyContent={'space-between'}>
									<LabelInput
										title={'Phone *'}
										placeholder={'(  )  - '}
										onChange={(value) => console.log(value)}
										inputType={'tel'}
										isPhoneInput
									/>
									<LabelInput
										title={'Email *'}
										placeholder={'email@address.com'}
										onChange={(value) => console.log(value)}
										inputType={'text'}
										isEmailInput
									/>
								</Box>
								<LabelInput
									title={'Password *'}
									placeholder={'Minimum 8 characters'}
									onChange={(value) => console.log(value)}
									inputType={'text'}
								/>
								<LabelInput
									title={'Confirm Password *'}
									placeholder={'Re-type password to confirm'}
									onChange={(value) => console.log(value)}
									inputType={'text'}
								/>

								<SignupOptionCheckboxes
									options={getSignupOptions()}
									onClick={signupOptionClickPlaceholder}
								/>

								<LabelButton
									look={'containedPrimary'}
									variant={'button'}
									label={'Sign Up'}
									onClick={() => console.log('Submit...')}
								/>
								<div className={'termsAndPrivacy'}>
									By signing up you are agreeing to the <a href={'/'}>Terms & Conditions</a> and{' '}
									<a href={'/'}>Privacy Policy.</a>
								</div>
							</Box>
							<Box
								className={'signInBottomBox'}
								display={'flex'}
								flexDirection={'column'}
								justifyContent={'center'}
								alignItems={'center'}
								marginTop={'auto'}
								height={'100px'}
								borderTop={'1px solid #DEDEDE'}
							>
								<Label variant={'body1'}>Already have an account?</Label>
								<LabelLink path={'/signin'} externalLink={false} label={'Sign In'} variant={'button'} />
							</Box>
						</Paper>
					</Box>
				</Box>
				<Footer links={FooterLinkTestData} />
			</div>
		</Page>
	);
};

export default SignUpPage;
