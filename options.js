'use strict';

function saveOptions(e) {
	e.preventDefault();
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
	var allRules = browser.storage.local.get({ rules: [] });
	allRules.then(res => {
		console.log(res);
		res.rules.forEach(rule => createRuleInputs(rule.path, rule.selector));
	});
}

function getRules() {
	const rules = Array.from(document.querySelectorAll('#rules>div'), x => {
			const path = x.querySelector('.path')?.value;
			const selector = x.querySelector(".selector")?.value;
			return (path == null || selector == null)? null : {path, selector};
		})
		.filter(x => x !== null);

	console.log("Found " + rules.length + " rules.");

	return rules;
}

function createRuleInputs(path, selector) {
	console.log('Creating new rule');
	path = path ?? "";
	selector = selector ?? "";
	const inputs = `<div>
		    <label>Path</label>
		    <input type="text" class="path" value="${path}"/>
		    <label>Selector</label>
		    <input type="textbox" class="selector" value="${selector}" />
		    <input type="button" class="reset" value="-" />
		</div>`;
	let form = document.getElementById('rules');
	form.insertAdjacentHTML('beforeend', inputs);
	form.querySelectorAll('.reset').forEach(btn => btn.addEventListener('click', () => removeRuleInput(btn)));
}

function removeRuleInput(removeButton) {
	console.log('Removing rule.')
	removeButton.parentElement.remove();
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector('form').addEventListener('submit', saveOptions);
document.querySelector('#newrule').addEventListener('click', () => createRuleInputs());
