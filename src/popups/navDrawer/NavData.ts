import INavData = Misc.INavData;

export const NavData: INavData[] = [
	{
		title: 'Redeem Points',
		route: '/reward',
		isSectionHeader: true,
		isSignedIn: false
	},
	{
		title: 'Browse Destinations',
		route: '/reservation/availability',
		isSectionHeader: false,
		isSignedIn: false
	},
	{
		title: 'Learn About Points',
		route: '/about-spire-points',
		isSectionHeader: false,
		isSignedIn: false
	},
	{
		title: 'My Account',
		route: '/account/personal-info',
		isSectionHeader: true,
		isSignedIn: true
	},
	{
		title: 'Reservations',
		route: '/reservations',
		isSectionHeader: false,
		isSignedIn: true
	},
	{
		title: 'Manage/View points',
		route: '/account/points',
		isSectionHeader: false,
		isSignedIn: true
	},
	{
		title: 'About Spire Loyalty',
		route: '/about-spire',
		isSectionHeader: true,
		isSignedIn: false
	}
];
