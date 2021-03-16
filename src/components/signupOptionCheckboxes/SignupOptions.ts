import { SignupOption } from './SignupOptionCheckboxes';

const SignupOptions: SignupOption[] = [
	{
		value: 'newsletter',
		text: 'Sign up for newsletter',
		defaultToChecked: true
	},
	{
		value: 'notifications',
		text: 'Allow Spire to send email notifications',
		defaultToChecked: false
	}
];

export default SignupOptions;
