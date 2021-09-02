import React from 'react';
import { Page } from '@bit/redsky.framework.rs.996';
import Label from '@bit/redsky.framework.rs.label/dist/Label';
import './PrivacyPolicyPage.scss';
import Footer from '../../components/footer/Footer';
import { FooterLinks } from '../../components/footer/FooterLinks';

const PrivacyPolicyPage: React.FC = () => {
	function renderBullets(bullets: string[]) {
		return (
			<ul>
				{bullets.map((bullet, index) => (
					<li key={index} dangerouslySetInnerHTML={{ __html: bullet }} />
				))}
			</ul>
		);
	}
	function renderSectionHeader(text: string) {
		return (
			<Label variant={'h2'}>
				<u>{text}</u>
			</Label>
		);
	}
	function renderTableRow(text: string[]) {
		return (
			<tr>
				{text.map((cell, index) => (
					<th key={index} dangerouslySetInnerHTML={{ __html: cell }} />
				))}
			</tr>
		);
	}
	return (
		<Page className={'rsPrivacyPolicyPage'}>
			<div className={'rs-page-content-wrapper'}>
				<Label variant={'h1'} className={'centerAlign'}>
					Privacy Policy
				</Label>
				{renderSectionHeader('Introduction')}
				<p>
					<Label variant={'h1'}>SPIRE TECHNOLOGY INC.</Label> a Delaware corporation (together with its
					affiliates, collectively, the <b>“Company,” “we,” “our,”</b> or <b>“us”</b>) respect your privacy
					and are committed to protecting it through our compliance with this policy. This privacy policy
					describes the types of information we may collect from you or that you may provide to us, including
					when you visit the internet site with the domain name of <b>SpireLoyalty.com</b>, including any
					pages, content, functionality, and services offered on or through such internet site (collectively,
					the <b>“Website”</b>), and our practices for collecting, using, maintaining, protecting, and
					disclosing that information.
				</p>
				<p>
					This policy applies to information we collect:
					{renderBullets([
						'On our Website.',
						'In email, text, and other electronic messages between you and the Company',
						'Telephonically or otherwise in communications between you and the Company or its agents.',
						'Through mobile and desktop applications we provide and you download, which provide dedicated non-browser-based interaction between you and our Website.'
					])}
					It does not apply to information collected by any third party, including through any application or
					content (including advertising) that may link to or be accessible from our Website.
				</p>
				<p>
					Please read this policy carefully to understand our policies and practices regarding your
					information and how we will treat it. If you do not agree with our policies and practices, your
					choice is not to use our Website. By accessing or using our Website, you agree to this privacy
					policy. This policy may change from time to time. Your continued use of our Website after we make
					changes is deemed to be acceptance of those changes, so please check the policy periodically for
					updates.
				</p>
				{renderSectionHeader('Children Under the Age of 18')}
				<p>
					Our Website is not intended for children under 18 years of age. No one under age 18 may provide any
					information to the Website. We do not knowingly collect personal information from children under 18.
					If you are under 18, do not use or provide any information on our Website or through any of its
					features or social media links, register on our Website, or provide any information about yourself
					to us, including your name, address, telephone number, email address, or any screen name or user
					name you may use. If we learn we have collected or received personal information from a child under
					18 without verification of parental consent, we will delete that information. If you believe we
					might have any information from or about a child under 18, please contact us at
					info@spireloyalty.com.
				</p>
				{renderSectionHeader('Information We Collect About You and How We Collect It')}
				<p>
					We do not collect, and do not have access to, your social security number or information about your
					financial accounts or history via our Website.{' '}
				</p>
				<p>
					We collect several types of information from and about users of our Website, including information:
					{renderBullets([
						'By which you may be personally identified, such as name, address, e-mail address, telephone number, and social media usernames <b>(“personal information”);</b>',
						'That is about you but individually does not identify you, and/or about your internet connection, the equipment you use to access our Website, and usage details <b>(“technology usage information”);</b> and/or',
						'Transactional information described in the Collection and Use of Transactional Information section below.'
					])}
				</p>
				<p>
					We collect this information:{' '}
					{renderBullets([
						'Directly from you when you provide it to use.',
						'Automatically as you navigate through the site. Information collected automatically may include usage details, IP addresses, and information collected through cookies, web beacons, and other tracking technologies.',
						'From third parties, for example, our business partners and affiliates.'
					])}
				</p>
				<p>Information You Provide to Us</p>
				<p>The information we collect on or through our Website may include:</p>
				{renderBullets([
					'Information that you provide by filling in forms on our Website.',
					'Records and copies of your correspondence (including email addresses), if you contact us.',
					'Your search queries on the Website.'
				])}
				<p>Information We Collect Through Automatic Date Collection Technologies</p>
				<p>
					As you navigate through and interact with our Website, we may use automatic data collection
					technologies to collect certain information about your equipment, browsing actions, and patterns,
					including:
					{renderBullets([
						'Details of your visits to our Website, potentially including traffic data, logs, analytics, and other communication data and the resources that you access and use on the Website.',
						'Information about your computer and internet connection, including your IP address, operating system, and browser type. '
					])}
				</p>
				<p>
					The information we collect automatically is only statistical data and does not include personal
					information, but we may maintain it or associate it with personal information we collect in other
					ways or receive from third parties. It helps us to improve our Website and to deliver a better and
					more personalized service, including by enabling us to:{' '}
					{renderBullets([
						'Estimate our audience size and usage patterns.',
						'Store information about your preferences, allowing us to customize our Website according to your individual interests.',
						'Speed up your searches.',
						'Recognize you when you return to our Website.'
					])}
				</p>
				<p>
					The technologies we use for this automatic data collection may include:{' '}
					{renderBullets([
						'<b>Cookies (or browser cookies).</b> A cookie is a small file placed on the hard drive of your computer. You may refuse to accept browser cookies by activating the appropriate setting on your browser. However, if you select this setting you may be unable to access certain parts of our Website. Unless you have adjusted your browser setting so that it will refuse cookies, our system will issue cookies when you direct your browser to our Website. ',
						'<b>Flash Cookies.</b> Certain features of our Website may use local stored objects (or Flash cookies) to collect and store information about your preferences and navigation to, from, and on our Website. Flash cookies are not managed by the same browser settings as are used for browser cookies. For information about managing your privacy and security settings for Flash cookies, see Choices About How We Use and Disclose Your Information.',
						'<b>Web Beacons.</b> Pages of our the Website and our e-mails may contain small electronic files known as web beacons (also referred to as clear gifs, pixel tags, and single-pixel gifs) that permit the Company, for example, to count users who have visited those pages or opened an email and for other related website statistics (for example, recording the popularity of certain website content and verifying system and server integrity).'
					])}
				</p>
				{renderSectionHeader('How We Use Your Personal Information and Technology Usage Information')}
				<p>
					We use information that we collect about you or that you provide to us, including any personal
					information:{' '}
					{renderBullets([
						'To present our Website and its contents to you.',
						'To provide you with information, products, or services that you request from us.',
						'To notify you about any products or services we offer or provide.',
						'To fulfill any other purpose for which you provide it.',
						'To carry out our obligations and enforce our rights arising from any contracts entered into between you and us.',
						'In any other way we may describe when you provide the information.',
						'For any other purpose with your consent.'
					])}
				</p>
				<p>
					We may use the information we have collected from you to enable us to display advertisements to our
					advertisers’ target audiences. Even though we do not disclose your personal information for these
					purposes without your consent, if you click on or otherwise interact with an advertisement, the
					advertiser may assume that you meet its target criteria.
				</p>
				{renderSectionHeader('Disclosure of Your Personal Information and Technology Usage Information')}
				<p>
					We may disclose personal information that we collect or you provide as described in this privacy
					policy:{' '}
					{renderBullets([
						'To our subsidiaries and affiliates.',
						'To contractors, service providers, and other third parties we use to support our business.',
						'To a buyer or other successor in the event of a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of the Company’s assets.',
						'To third parties to market their products or services to you if you have consented to these disclosures. For more information, see <u>Choices About How We Use and Disclose Your Information</u>].',
						'To fulfill the purpose for which you provide it.',
						'For any other purpose disclosed by us when you provide the information.',
						'With your consent.'
					])}
				</p>
				<p>We may disclose aggregated information about our users without restriction.</p>
				<p>
					We may also disclose your personal information and/or technology usage information:{' '}
					{renderBullets([
						'To comply with any court order, law, or legal process, including to respond to any government or regulatory request.',
						'To enforce or apply our Website Terms of Use [INSERT LINK TO WEBSITE’S TERMS OF USE], the <b>[Spire™ Loyalty Rewards Program Terms and Conditions]</b> [INSERT LINK TO SPIRE REWARDS TERMS and CONDITIONS] <b>(“Spire Loyalty Terms and Conditions”)</b> and other agreements and/or documents governing the relationship between you and the Company.',
						'If we believe disclosure is necessary or appropriate to protect the rights, property, or safety of the Company, our customers, or others. This includes exchanging information with other companies and organizations for the purposes of fraud protection and credit risk reduction.'
					])}
				</p>
				{renderSectionHeader('Collection and Use of Transactional Information')}
				<p>
					In addition to the policies described herein regarding our collection and use of your personal
					information (and the other information elsewhere described herein, if you enroll in the{' '}
					<b>Spire Loyalty Program (“Spire Loyalty”)</b>, the Company and its third party Service Providers
					will collect and monitor information regarding the transactions that you make on Linked Cards, as
					described in the Spire Loyalty Terms and Conditions. This information is referred to as
					“transactional information” and is treated differently than your personal information and other
					information described herein. For example, if you register a payment card as a “Linked Card” in
					connection with transaction monitoring, you authorize us to share your payment card information with
					the “Payment Networks” so the applicable Payment Network(s) is or are informed of the registration
					of the Linked Card as a part of Spire Loyalty. You authorize the applicable Payment Network(s) to
					monitor transactions on your Linked Card(s) to identify “Eligible Transactions” in order to
					determine whether you have qualified for or earned an offer linked to your Linked Card(s), and for
					the Payment Network(s) to share such transaction details with us to enable your Linked Card(s)
					offer(s) and target offers that may be of interest to you. You may opt-out of transaction monitoring
					on the Linked Card(s) at any time by either (a) deleting the Linked Card(s) as Linked Cards or (b)
					terminating your participation in the Spire Loyalty, in either case in accordance with the Spire
					Loyalty Terms and Conditions.
				</p>
				<p>
					Notwithstanding anything to the herein or in the Spire Loyalty Terms and Conditions, the Company and
					its third party Service Providers (including Fidel Limited) will use transaction information solely
					as follows: Use transaction data such as transaction amount, transaction time and merchant location
					to confirm an Eligible Purchase or return to match transactions to confirm whether you qualify for
					rewards. Share transaction data with the participating merchant where a transaction occurred as
					needed for the merchant to confirm a specific transaction occurred. For example, the date and amount
					of your purchase and the last 4 digits of your card number so the merchant can verify your purchase
					with its records if there is a missing or disputed transaction; Provide participating merchants or
					third party Service Providers aggregated and anonymized information relating specifically to
					registered card activity solely to allow participating merchants and third party Service Providers
					to assess the results of their campaign; Create a record of the transaction data and thereafter
					maintain and use data in connection with operating the Spire Loyalty; Provide information in order
					to respond to a request from government authority or a payment organization involved in a
					transaction with you or a merchant. Members authorize the sharing, exchange and use of transactional
					information described above and herein by and among Company and Company’s third party Service
					Providers, applicable Payment Card Networks and applicable Merchants.
				</p>
				<p>
					Capitalized terms used but not otherwise defined in this “Collection and Use of Transactional
					Information” section shall have the meanings ascribed thereto in the{' '}
					<u>Spire™ Loyalty Rewards Program Terms and Conditions</u>.
				</p>
				{renderSectionHeader('Transaction Monitoring')}
				<p>
					By registering a payment card in connection with transaction monitoring, you authorize Spire Loyalty
					to share your payment card information with Visa, Mastercard and AMEX (Payment Networks) so it knows
					you enrolled. You authorize Mastercard, Visa and AMEX to monitor transactions on your registered
					card(s) to identify qualifying purchases in order to determine whether you have qualified for or
					earned an offer linked to your payment card, and for Visa, Mastercard and AMEX (Payment Networks) to
					share such transaction details with Spire Loyalty to enable your card-linked offer(s) and target
					offers that may be of interest to you. You may opt-out of transaction monitoring on the payment
					card(s) you have registered by navigating to your settings menu to remove your linked card(s).
				</p>
				{renderSectionHeader('Choices About How We Use and Disclose Your Information')}
				<p>
					We strive to provide you with choices regarding the personal information you provide to us. We have
					created mechanisms to provide you with the following control over your information:
					{renderBullets([
						'<b>Tracking Technologies and Advertising.</b> You can set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent. To learn how you can manage your Flash cookie settings, visit the Flash player settings page on Adobe’s website. If you disable or refuse cookies, please note that some parts of this site may then be inaccessible or not function properly.',
						'<b>Opting Out of the Sharing of Your Personal Information.</b> You may direct us to limit the disclosure of your personal information that we share with nonaffiliated third parties by emailing us at support@spireloyalty.com with your name, address, email address and the statement “I hereby request per your Company’s privacy policy that you do not disclose non-public personal financial information about me to any nonaffiliated third parties, except as permitted or required by law.” However, even if you make this opt-out choice we may still disclose your personal information to third parties: (i) that perform marketing or other services on our behalf; (ii) as permitted by law, such as to service providers; and (iii) to protect against fraud, and to protect the security or confidentiality of our records. Your privacy instructions and any previous privacy instructions will remain in effect until you request a change. Your preference will apply to all of the personal information which you have provided to us.',
						'<b>Opting Out of Sharing of Your Transactional Information.</b> We will only use transactional information of Spire Members, and such use is limited as described in the “Collection and Use of Transactional Information” section above. Spire Members may opt out of such use as described in that section.',
						'<b>Opting Out of our Promotional Emails.</b> If we have sent you a promotional email, you may send us a return email asking to be omitted from future email distributions or, as applicable, click on the unsubscribe or similar link in the email.'
					])}
				</p>
				{renderSectionHeader('Data Security')}
				<p>
					We have implemented measures designed to secure your personal information and transactional
					information from accidental loss and from unauthorized access, use, alteration, and disclosure.{' '}
				</p>
				<p>
					Unfortunately, the transmission of information via the internet is not completely secure. Although
					we do our best to protect your personal information, we cannot guarantee the security of your
					personal information transmitted to our Website. Any transmission of personal information is at your
					own risk. We are not responsible for circumvention of any privacy settings or security measures
					contained on the Website.{' '}
				</p>
				{renderSectionHeader('Website in United States')}
				<p>
					The Company is a United States company governed by the state and federal laws of the United States.
					The Website are hosted on servers located in the United States or other countries. The laws of those
					countries, including their data privacy laws and laws regarding transfer of data across borders, may
					differ from the laws in your country. If you are not located in the United States, you use the
					Website at your own risk.
				</p>
				{renderSectionHeader('Changes to Our Privacy Policy')}
				<p>
					It is our policy to post any changes we make to our privacy policy on this page. If we make material
					changes to how we treat our users’ personal information, we will notify you by email to the email
					address specified in your account and/or through a notice on the Website home page. The date the
					privacy policy was last revised is identified at the top of the page. You are responsible for
					ensuring we have an up-to-date active and deliverable email address for you, and for periodically
					visiting our Website and this privacy policy to check for any changes.
				</p>
				{renderSectionHeader('Contact Information')}
				<p>
					To ask questions or comment about this privacy policy and our privacy practices, contact us at:
					info@spireloyalty.com.{' '}
				</p>
				<Label variant={'h3'} className={'centerAlign'}>
					Supplemental Privacy Notice for California Residents
				</Label>
				{renderSectionHeader('[NV AND VT SUPPLEMENTS TBD]')}'
				<p>
					<b>SPIRE TECHNOLOGY INC</b>, a Delaware corporation (<b>“Company,” “we,” “our,”</b> or <b>“us”</b>)
					provides this supplemental privacy notice (<b>"CCPA Notice"</b>) for consumers that reside in
					California (<b>“you,"</b> or <b>“your”</b>) as required under California privacy laws, including the
					California Consumer Privacy Act of 2018 (<b>“CCPA”</b>). This CCPA Notice applies to the Company and
					its affiliated operating companies (<b>“Affiliates”</b>).
				</p>
				<p>
					We provide this CCPA Notice to inform you about how we collect, use or disclose your personal
					information. Under the CCPA, <b>“personal information”</b> is any information that identifies,
					relates to, describes, is reasonably capable of being associated with, or could reasonably be
					linked, directly or indirectly, with a particular California resident or household. It does not
					include publicly available data as defined by the CCPA. This CCPA Notice supplements our Privacy
					Notice. In the event of a conflict between our Privacy Notice and this CCPA Notice, this CCPA Notice
					will prevail for California residents and their rights under California law.
				</p>
				<p>
					Personal information we collect, use, or disclose that is governed by the federal Gramm-Leach-Bliley
					Act, the California Financial Information Privacy Act, or the federal Fair Credit Reporting Act,
					such as consumer credit reports or information relating to your financing of a StaySaver Vacations™
					product or service, is not subject to the CCPA and this CCPA Notice.
				</p>
				<Label variant={'h3'}>Categories of Personal Information that We Collect, Use, and Disclose</Label>
				<p>
					The type of personal information we collect, use, and disclose will depend on your interaction or
					relationship with us. The chart below generally identifies the personal information we collect based
					on the categories of personal information set forth in the CCPA.
				</p>
				<table>
					{renderTableRow([
						'<b>Categories of personal information as set forth in the CCPA</b>',
						'<b>Personal information we collect</b>'
					])}
					{renderTableRow([
						'<b>Name, Contact Information and other Identifiers:</b>\n' +
							"Identifiers such as a real name, alias, address, unique personal identifier, online identifier, Internet Protocol (IP) address, email address, account name, social security number, driver's license number, passport number, or other similar identifiers.",
						'We may collect information such as your name, address, email address, telephone numbers, date of birth, member number, and IP address. '
					])}
					{renderTableRow([
						"<b>Customer Records:</b> Paper and electronic customer records containing personal information, such as name, signature, physical characteristics or description, address, telephone number, education, current employment, employment history, social security number, passport number, driver's license or state identification card number, nsurance policy number, bank account number, credit card number, debit card number, or any other financial or payment information, medical information, or health insurance information.",
						'Customer Records: Paper and electronic customer records containing personal information, such as name, signature, physical characteristics or description, address, telephone number, bank account number, credit card number, debit card number, or any other financial or payment information. We may collect information such as your name, address, email address, telephone numbers, member number, and credit or debit card information.'
					])}
					{renderTableRow([
						'<b>Protected Classifications:</b> Characteristics of protected classifications under California or federal law such as race, color, sex, age, religion, national origin, disability, citizenship status, and genetic information.',
						'We may collect information such as your gender or age. In more limited circumstances, we may collect disability information in an effort to provide you with appropriate facilities or services.'
					])}
					{renderTableRow([
						'<b>Purchase History and Tendencies:</b> Commercial information including records of personal property, products or services purchased, obtained, or considered, or other purchasing or use histories or tendencies.',
						'We may collect information such as the products or services you purchased or utilized.'
					])}
					{renderTableRow([
						'<b>Biometric Information:</b> Physiological, biological or behavioral characteristics that can be used alone or in combination with each other to establish individual identity, including DNA, imagery of the iris, retina, fingerprint, faceprint, hand, palm, vein patterns, and voice recordings, keystroke patterns or rhythms, gait patterns or rhythms, and sleep, health, or exercise data that contain identifying information.',
						'We may collect voice recordings when we monitor and record telephone calls.'
					])}
					{renderTableRow([
						"<b>Usage Data:</b> Internet or other electronic network activity information, including, but not limited to, browsing history, clickstream data, search history, and information regarding a resident's interaction with an internet website, application, or advertisement.",
						'We may collect this information as part of your interaction with our Website (as defined in our Privacy Notice) or mobile application, and through advertisements.'
					])}
					{renderTableRow([
						'<b>Geolocation Data:</b> Precise geographic location information about a particular individual or device.',
						'We may collect information such as your postal address, zip code, or the location associated with an IP address or particular device.'
					])}
					{renderTableRow([
						'<b>Audio, Video and other Electronic Data:</b> Audio, electronic, visual, thermal, olfactory, or similar information, such as, CCTV footage, photographs, and call recordings and other audio recording (e.g., recorded meetings and webinars).',
						'Audio, Video and other Electronic Data: We may collect voice recordings when we monitor and record telephone calls, photos or videos that are tagged or shared with us through social media posts, or audio, video, or images captured in security footage of our business locations.'
					])}
					{renderTableRow([
						'<b>Professional or employment-related information:</b> Employment history, qualifications, licensing, disciplinary record.',
						'We do not collect this information.'
					])}
					{renderTableRow([
						'<b>Education Information:</b> Information about education history or background that is not publicly available personally identifiable information as defined in the federal Family Educational Rights and Privacy Act (20 U.S.C. section 1232g, 34 C.F.R. Part 99).',
						'We do not collect this information.'
					])}
					{renderTableRow([
						"<b>Profiles and Inferences:</b> Inferences drawn from any of the information identified above to create a profile reflecting a resident's preferences, characteristics, psychological trends, predispositions, behavior, attitudes, intelligence, abilities, or aptitudes.",
						'We may collect or derive information such as your preferences, characteristics, predispositions, and behavior based on other information we have about you.'
					])}
				</table>
				<p>
					We collect these categories of personal information from the sources described in our Privacy Notice
					and for the purposes described in the “Information We Collect and Its Uses” section of our Privacy
					Notice. We disclose your personal information to third parties, such as our service providers, as
					described in the “Disclosure of Information” section of our Privacy Notice. We do not collect
					personal information directly from children under the age of eighteen (18), but may receive such
					information from parents and guardians when, for example, making resort, cruise, or other travel
					reservations.
				</p>
				<Label variant={'h3'}>Third-Party Cookies & Similar Technologies</Label>
				<p>
					We may also use standard internet technology, such as cookies, web beacons, pixels, and other
					similar technologies (collectively <b>“cookies”</b>) to track your use of our Website as defined in
					our Privacy Notice. We may include web beacons in promotional email messages or newsletters to
					determine whether messages have been opened and acted upon. The information we obtain in this manner
					enables us to customize the services we offer to deliver targeted advertisements and to measure the
					overall effectiveness of our online advertising, content, programming or other activities. See the
					“Cookies & Related Technologies” section of our Privacy Notice for more information. Data that is
					collected through network advertising or social media cookies may be disclosed by such network
					advertisers or social media to other network advertisers that allows those advertisers to also
					display ads to you. While there is currently no industry consensus, we do not consider these
					additional disclosures to be our sale of personal information under the CCPA. If you do not want
					information collected by cookies, however, please visit www.aboutads.info and
					www.networkadvertising.org to opt-out.
				</p>
				<Label variant={'h3'}>California Resident Rights</Label>
				<p>
					If you are a California resident, you have certain rights with respect to your personal information
					as set forth below.
				</p>
				<p>
					<u>Request to Delete:</u> You may request that we delete personal information we have collected
					about you, subject to certain exemptions provided by law.
				</p>
				<p>
					<u>Request to Know:</u> You may request, subject to certain exemptions, that we disclose to you the
					categories of personal information collected; the categories of sources of personal information; the
					business or commercial purposes for collecting and selling your personal information; the categories
					of third parties with whom we have shared your personal information; the categories of personal
					information that we have disclosed or shared with a third party for a business purpose; the
					categories of third parties to whom your personal information has been sold and the specific
					categories of personal information sold to each category of third party; and the specific pieces of
					personal information that we have collected about you in the prior 12 months.
				</p>
				<p>
					<u>Request to Opt-out of Our Sale of Your Personal Information:</u> We do not sell your personal
					information. [SPIRE TEAM – PLEASE CONFIRM]
				</p>
				<p>
					<u>Submitting Requests:</u> To make a Request to Delete or a Request to Know, please contact us at
					privacy@spireloyalty.com. Please include your full name, postal address, email address, and your
					member number (if applicable). If you designate an authorized agent to make a request on your
					behalf, we require you to provide a written and signed authorization of your agent's permission to
					exercise your rights on your behalf as provided for in this section. Please include your full name,
					postal address, email address, and your member number (if applicable) along with your agent's full
					name, postal address, email address, and relationship to you.
				</p>
				<p>
					If we are unable to verify your identity based on this information, we will take additional steps to
					verify your identity before responding to your request. We will respond to verifiable requests
					received from California residents or their authorized agents in accordance with the law, which
					provides certain exemptions for disclosure or deletion. For example, if you enroll in the Spire
					Loyalty Program, we may retain your personal information as permitted by law to maintain and service
					your membership and account.
				</p>
				<p>
					These rights do not apply to personal information we collect about job applicants, independent
					contractors, or our current or former full-time, part-time and temporary employees and other staff,
					or information we collect when we act as a service provider.
				</p>
				<p>
					<u>Non-Discrimination:</u> We are not permitted to nor do we discriminate against California
					residents who exercise their rights under the law.
				</p>
				<Label variant={'h3'}>Other California Privacy Rights</Label>
				<p>
					We do not permit personal information as defined by California's Shine the Light law that we share
					with third parties to be utilized for their marketing activities. If you are a customer who resides
					in the State of California, however, you have the right to request from us a list of third parties
					with whom we shared personal information about you for their own direct marketing purposes during
					the previous calendar year by contacting us at privacy@spireloyalty.com or by sending a letter to
					Spire Loyalty, 1 Town Center Rd #600, Boca Raton, FL 33486 . Privacy rights under Shine the Light
					and the CCPA are provided under different legal rules and must be exercised separately.
				</p>
				<p>
					At this time, we do not respond to browser “do not track” signals, as we await the work of
					interested stakeholders and others to develop standards for how such signals should be interpreted.
					Third parties, including our service providers, may collect information about your online activities
					over time and across different websites, including when you visit our Website.
				</p>
				<Label variant={'h3'}>Last Update</Label>
				<p>This CCPA Notice was last updated on June 8, 2021.</p>
				<Footer links={FooterLinks} />
			</div>
		</Page>
	);
};

export default PrivacyPolicyPage;
