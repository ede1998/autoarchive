
browser.messageDisplayAction.onClicked.addListener(async tab => {
	console.log("Archiving current message.");
	const tabId = tab.id;
	const message = await browser.messageDisplay.getDisplayedMessage(tabId);
	console.log(message);
	const ident = "privat@erik-hennig.me/Archives/2021/internet/netflix";
	const { accountName, path } = split_ident(ident);
	const accountId = await getAccountId(accountName);
	console.log(accountId);
	await browser.messages.copy([message.id], { accountId: accountId, path: path});
});

async function getAccountId(name) {
	name = name ?? "";
	const accounts = await browser.accounts.list();
	return accounts.find(x => x.name === name)?.id;
}

function split_ident(ident) {
	ident = ident ?? "";
	const position = ident.indexOf('/');
	if (position === -1) {
		return null;
	}

	return {
		accountName: ident.substring(0, position),
		path: ident.substring(position)
	};
}
