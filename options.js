'use strict';

function saveOptions() {
	const rules = getRules();
	if (rules == null) {
		console.log("Could not fetch rules from form");
		return;
	}
	browser.storage.local.set({
		rules: rules
	}, () => console.log('saved'));
}

function restoreOptions() {
	const allRules = browser.storage.local.get({ rules: [] });
	allRules.then(res => {
		console.log(res);
		res.rules.forEach(rule => createRuleInputs(rule.path, rule.selector));
	});
}

function getRules() {
	const rules = Array.from(document.querySelectorAll('#rules>div'), x => {
		const path = x.querySelector('.path')?.value;
		const selector = x.querySelector(".selector")?.value;
		return (!path || !selector)? null : {path, selector};
	}).filter(x => x !== null);

	console.log("Found " + rules.length + " rules.");

	return rules;
}

function createRuleInputs(path, selector) {
	console.log('Creating new rule');
	path = escapeAttribute(path ?? "");
	selector = escapeAttribute(selector ?? "");
	const inputs = `<div class="rule">
		    <input type="text" class="path" value="${path}" placeholder="path"/>
		    <input type="text" class="selector" value="${selector}" placeholder="JS selector function" />
		    <input type="button" class="reset" value="-" />
		</div>`;
	let form = document.getElementById('rules');
	form.insertAdjacentHTML('beforeend', inputs);
	form.querySelectorAll('.reset').forEach(btn => btn.addEventListener('click', () => removeRuleInput(btn)));
}

function escapeAttribute(text) {
	return text.replaceAll('"', '&quot;');
}

function removeRuleInput(removeButton) {
	console.log('Removing rule.')
	removeButton.parentElement.remove();
}

function importFromFile(e) {
	console.log('Importing with event:', e);
	if (e?.target?.files.length !== 1) {
		console.log('invalid number of files selected.');
		return;
	}

	const file = e.target.files[0];
	file.text().then(data => {
		const rules = JSON.parse(data);
		if (!Array.isArray(rules)) {
			console.log('Top level JSON object must be an array');
			return;
		}
		const cleanedRules = rules
			.filter(rule => {
				if (typeof rule?.path === 'string' && typeof rule?.selector === 'string') {
					return true;
				}
				console.log('Ignoring incorrectly typed rule:', rule);
				return false;
			})
			.map(rule => { return { path: rule.path, selector: rule.selector }; });
		browser.storage.local.set({ rules: cleanedRules }, () => console.log('saved'));
	});
}

function exportToFile() {
	console.log('Exporting all rules.');
	const allRules = browser.storage.local.get({ rules: [] });
	allRules.then(res => {
		const rules = JSON.stringify(res.rules, null, 4);
		showExportBox(rules);
	});

}

function showExportBox(text) {
	console.log('Showing textarea to allow copying configuration:', text);
	// does not work in thunderbird for some reason
	//console.log('Offering', filename, 'for download with content:', text);
	// const link = `<a href="data:application/json;charset=utf-8,${encodeURIComponent(text)}" download="${filename}">HERE</a>`;
	const boxElement = document.getElementById('exportdata');
	boxElement.value = text;
	boxElement.hidden = false;
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('#save').addEventListener('click', saveOptions);
document.querySelector('#newrule').addEventListener('click', () => createRuleInputs());
document.querySelector('#import').addEventListener('change', importFromFile);
document.querySelector('#export').addEventListener('click', exportToFile);

