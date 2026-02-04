import SignIn from '@/_pages/sign-in';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Sign In',
};

const SignInPage = () => {
	return <SignIn />;
};

export default SignInPage;
