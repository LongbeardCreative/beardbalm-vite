// Vars

const gaTrackingID = 'UA-169415947-2';
const privacyPolicyURL = '/privacy-policy/';
const cookiePolicyURL = '/cookie-policy/';

const wildcardDomain = location.hostname.includes('longbeardco.com') ? '.longbeardco.com' : '.' + location.hostname;
const blockingCookies = [
	{
		name: '_gid',
		domain: wildcardDomain,
	},
	{ 
		name: '_ga',
		domain: wildcardDomain,
	},
	{ 
		name: '_gat_gtag_' + gaTrackingID.replace(/-/g, '_'),
		domain: wildcardDomain, 	
	}
];

const blockingScripts = [
	{
		id: 'gtag-script',
		type: 'text/javascript',
		async: 'true',
		src: 'https://www.googletagmanager.com/gtag/js?id=' + gaTrackingID,
		text: '',
	},
	{
		id: 'google-analytics-script',
		type: 'text/javascript',
		async: '',
		src: '',
		text: 'window.dataLayer = window.dataLayer || [];\
			function gtag(){dataLayer.push(arguments);}\
			gtag("js", new Date());\
			gtag("config", "' + gaTrackingID + '");',
	}
]

// Initialize CookieConsent

window.addEventListener('load', function(){
	cookieconsent.initialise({
		// palette: {
		// 	popup: {
		// 		background: '#f3f3f3',
		// 		text: '#454545;'
		// 	},
		// 	button: {
		// 		background: '#9A6D32',
		// 		text: '#ffffff',
		// 	},
		// 	highlight: {
		// 		background: '#9A6D32',
		// 		text: '#ffffff',
		// 	}
		// },
		type: 'opt-in',
		revokable: true,
		showLink: false,
		content: {
			message: 'By using this website, you agree to our <a href="' + privacyPolicyURL + '" target="_blank">Privacy Policy</a> and <a href="' + cookiePolicyURL + '" target="_blank">Cookie Policy.</a>',
			dismiss: 'Accept',
			allow: 'Accept',
			deny: 'Reject',
		},
		onInitialise: function(status) {
			if (status === 'allow') loadScripts(blockingScripts);
		},
		onStatusChange: function (status, chosenBefore) {
			if (status === 'allow') loadScripts(blockingScripts);
			if (status === 'deny') removeCookies(blockingCookies, blockingScripts);
		},
		onRevokeChoice: function() {
			removeCookies(blockingCookies, blockingScripts);
		}
	})
});

function loadScripts(scripts) {
	scripts.map(function(script) {
		var s = document.createElement('script');
		s.type = 'text/javascript';
		if ( script.id ) s.id = script.id;
		if ( script.async ) s.async = script.async;
		if ( script.src ) s.src = script.src;

		if ( script.text ) {
			var text = script.text;
			var t = document.createTextNode(text);
			s.appendChild(t);
		}

		var x = document.getElementsByTagName('script')[0];
		x.parentNode.insertBefore(s, x);
	})
}

function removeCookies(cookies, scripts) {

	// Delete Cookies
	cookies.map(function(c) {
		const cookieName = c.name;
		const cookieDomain = c.domain ? c.domain : '';
		deleteCookie(cookieName, cookieDomain);
	})

	// Delete scripts
	scripts.map(function(script) {
		if ( script.id ) {
			var e = document.getElementById(script.id);
			if ( e ) e.parentNode.removeChild(e);
		}
	})
}

function deleteCookie(name,domain) {
	document.cookie = name + '=; domain=' + domain + ';expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

function revokeCC(e) {
	if ( e ) e.preventDefault();
	document.getElementsByClassName('cc-revoke')[0].click();
}