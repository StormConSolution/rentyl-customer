export interface IPromotionWheel {
	title: string;
	description: string;
	imgUrl: string;
}

const promotionWheelData = [
	{
		title: 'Get 2x the points value for Margaritaville today only when paying with points.',
		description:
			'Earning points is now twice as fun with our Margaritaville points promotion. Increase your points earning power while you enjoy Margaritavilles award winning hospitality…….and Margaritas!',
		imgUrl: require('../../images/aboutSpirePage/credit-card-payment.png')
	},
	{
		title: 'Island H20 Live!',
		description: 'Join us at Island H20 Live! Spire Loyalty members receive the VIP treatment',
		imgUrl: require('../../images/aboutSpirePage/island_h2o.jpg')
	},
	{
		title: 'Sunset Walk',
		description:
			'Sunset Walk your way to points earnings - El Jeffe and Estefan Kitchen are offering discounted drinks and appetizers to Spire members',
		imgUrl: require('../../images/aboutSpirePage/estefan_kitchen.jpeg')
	},
	{
		title: 'Upgrade Your Stay',
		description:
			'Upgrade your stay at our partner resort properties where Spire members receive points multipliers on stays and on property spending.',
		imgUrl: require('../../images/aboutSpirePage/upgrade.jpg')
	}
];

export default promotionWheelData;
