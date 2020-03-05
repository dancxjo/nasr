const readkey = require('readkey');
const puppeteer = require('puppeteer');
const readline = require('readline-sync');

(async () => {
	const browser = await puppeteer.launch();

	const page = await browser.newPage();

	page.on('load', async () => {
		const title = await page.title();
		console.log(`Loaded ${title}`);
		readPage();
	});

	page.on('focus', async () => {});

	function exitTrap(str, key) {
		return str === 'q';
	}

	function exit() {
		browser.close().then(() => {
			console.log('Goodbye');
			process.exit();
		});
	}

	function goto() {
		//console.log('Web address');
		//const url = readline.question('URL?\n');
		return page
			.goto('https://www.google.com')
			.then(() => console.log('Loading google'))
			.catch((e) => console.log('Something went wrong going to that address', e.message));
	}

	async function readPage() {
		const el = await page.evaluateHandle(() => document.activeElement);
		// console.log(await el.getProperty('innerHTML'));
		const acc = await page.accessibility.snapshot({ root: el });
		if (acc) {
			console.log(acc.role, acc.name);
		} else {
			console.log(await page.title());
		}
	}

	async function tab() {
		await page.keyboard.press('Tab');
		await readPage();
	}

	const exitCommand = { fn: exitTrap, command: exit };

	readkey([
		exitCommand,
		{ fn: (str, key) => str === 'g', command: goto },
		{ fn: (str, key) => str === '\t', command: () => tab() }
	]);
})().catch(() => console.log('Something went wrong'));
