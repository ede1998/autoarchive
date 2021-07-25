browser.messageDisplayAction.onClicked.addListener(async tab => {
	console.log('Archiving current message.');
	const tabId = tab.id;
	const message = await browser.messageDisplay.getDisplayedMessage(tabId);
	console.log('Loaded message:', message);
	const rule = await findApplicableRule(message);
	if (rule == null) {
		console.log('Could not find an applicable rule');
		// This does not work but does bring up the console.
		alert('No matching rule for selected message');
		return;
	}

	console.log('Found applicable rule:', rule);
	const destination = await parseIdent(rule.path);
	console.log('Determined location to move to:', destination);
	await browser.messages.move([message.id], destination);
});

async function getAccountId(name) {
	name = name ?? '';
	const accounts = await browser.accounts.list();
	return accounts.find(x => x.name === name)?.id;
}

async function parseIdent(ident) {
	ident = ident ?? '';
	const position = ident.indexOf('/');
	if (position === -1) {
		return null;
	}

	let path = ident.substring(position);
	path = path.replace('${year}', new Date().getFullYear());

	const accountName = ident.substring(0, position);
	const accountId = await getAccountId(accountName);

	return { accountId, path };
}
	
async function findApplicableRule(message) {
	const storage = await browser.storage.local.get({ rules: [] });
	return storage?.rules?.find(rule => {
		let func = Function('message', rule.selector);
		return func(message);
	});
}
