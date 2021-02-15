import { SignupOption } from './SignupOptionCheckboxes';

const SignupOptions: Array<SignupOption> = [
	{
		value: 'newsletter',
		text: 'Sign up for newsletter',
		defaultToChecked: true
	},
	{
		value: 'notifications',
		text: 'Allow Spire to send email notifications',
		defaultToChecked: false
	},
	{
		value: 'test',
		text: 'Test item',
		defaultToChecked: false
	}
];

export default SignupOptions;
