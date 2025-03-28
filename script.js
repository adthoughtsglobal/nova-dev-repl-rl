var batteryLevel, winds = {}, rp, flwint = true, contentpool = {}, memory = {}, _nowapp, fulsapp = false, nowappdo, appsHistory = [], nowwindow, appicns = {}, dev = true, appfound = 'files', fileslist = [], sessionSettings = {}, badlaunch = false, really = false, initmenuload = true, fileTypeAssociations = {}, Gtodo, notifLog = {}, initialization = false, onstartup = [], novaFeaturedImage = `Dev.png`, defAppsList = [
	"store",
	"files",
	"settings",
	"calculator",
	"text",
	"musicplr",
	"camera",
	"clock",
	"media",
	"gallery",
	"browser",
	"studio"
], timeFormat, timetypecondition = true, genTaskBar, genDesktop;

function setbgimagetourl(x) {
	const bgImage = document.getElementById('bgimage');
	if (!bgImage) return;

	bgImage.style.opacity = 0;
	const transitionDuration = parseFloat(getComputedStyle(bgImage).transitionDuration) * 1000 || 300;

	if (x.startsWith('data:')) {
		try {
			const byteString = atob(x.split(',')[1]);
			const mimeString = x.split(',')[0].split(':')[1].split(';')[0];
			const arrayBuffer = new Uint8Array(byteString.length);

			for (let i = 0; i < byteString.length; i++) {
				arrayBuffer[i] = byteString.charCodeAt(i);
			}

			const blob = new Blob([arrayBuffer], { type: mimeString });
			const blobUrl = URL.createObjectURL(blob);

			setTimeout(() => {
				bgImage.src = blobUrl;
				bgImage.onload = () => {
					bgImage.style.opacity = 1;
					setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
				};
			}, transitionDuration);
		} catch (e) {
			console.error("Failed to decode base64 string:", e);
		}
	} else {
		setTimeout(() => {
			bgImage.src = x;
			bgImage.onload = () => {
				bgImage.style.opacity = 1;
			};
		}, transitionDuration);
	}
}

Object.defineProperty(window, 'nowapp', {
	get() {
		return _nowapp;
	},
	set(value) {
		_nowapp = value;
	}
});

function loginscreenbackbtn() {
	document.getElementsByClassName("backbtnscont")[0].style.display = "none";
	document.getElementsByClassName("userselect")[0].style.flex = "1";
	document.getElementsByClassName("logincard")[0].style.flex = "0";
}

async function showloginmod() {
	if (badlaunch) { return }
	closeElementedis();
	document.getElementsByClassName("backbtnscont")[0].style.display = "none";
	function createUserDivs(users) {
		const usersChooser = document.getElementById('userschooser');
		usersChooser.innerHTML = '';
		const defaultIcon = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="66" height="61" viewBox="0,0,66.9,61.3"><g transform="translate(-206.80919,-152.00164)"><g fill="#ffffff" stroke="none" stroke-miterlimit="10"><path d="M206.80919,213.33676c0,0 3.22013,-18.32949 21.37703,-24.2487c3.5206,-1.14773 5.89388,2.28939 12.33195,2.29893c6.51034,0.00899 8.33976,-3.45507 11.71219,-2.35934c18.01675,5.85379 21.54426,24.30912 21.54426,24.30912z" stroke-width="none"/><path d="M222.47948,169.52215c0,-9.67631 7.8442,-17.52052 17.52052,-17.52052c9.67631,0 17.52052,7.8442 17.52052,17.52052c0,9.67631 -7.8442,17.52052 -17.52052,17.52052c-9.67631,0 -17.52052,-7.8442 -17.52052,-17.52052z" stroke-width="0"/></g></g></svg>`
		users.forEach(async (cacusername) => {
			const userDiv = document.createElement('div');
			userDiv.className = 'user';
			userDiv.tabIndex = 0;
			const selectUser = async function () {
				try {
					await cleanupram();
					CurrentUsername = cacusername;
					let isdefaultpass = false;
					try {
						isdefaultpass = await checkPassword('nova');
					} catch (err) {
						console.error("Password check failed:", err);
					}
					if (isdefaultpass) {
						gid('loginmod').close();
						gid('edison').showModal();
						startup();
					} else {
						console.log("Password check failed: ", isdefaultpass);
						document.getElementsByClassName("backbtnscont")[0].style.display = "flex";
						document.getElementsByClassName("userselect")[0].style.flex = "0";
						document.getElementsByClassName("logincard")[0].style.flex = "1";
						gid("loginform1").focus();
						gid('loginmod').showModal()
					}
				} catch (err) { }
			};

			userDiv.onclick = selectUser;
			userDiv.addEventListener("keydown", function (event) {
				if (event.key === "Enter") {
					selectUser();
				}
			});
			const img = document.createElement('span');
			img.className = 'icon';
			img.innerHTML = defaultIcon;
			const nameDiv = document.createElement('div');
			nameDiv.className = 'name';
			nameDiv.textContent = cacusername;
			userDiv.appendChild(img);
			userDiv.appendChild(nameDiv);
			usersChooser.appendChild(userDiv);
		});
	}
	let users = await getallusers();
	createUserDivs(users);
	if (users.length > 0) {
		document.querySelector('.user').focus();
	}
	const now = new Date();
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	document.getElementById('loginusselctime').textContent = `${hours}:${minutes}`;
	gid('loginmod').showModal();
	gid('loginform1').addEventListener("keydown", async function (event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			await checkifpassright();
		}
	});
}
function setsrtpprgbr(val) {
	let progressBar = document.getElementById('progress-bar');
	let width = val;
	progressBar.style.width = width + '%';
}
async function startup() {
	gid("edison").showModal();
	if (badlaunch) { return }
	lethalpasswordtimes = false;
	setsrtpprgbr(50);
	const start = performance.now();

	updateNavSize();

	let localupdatedataver = localStorage.getItem("updver");
	let localupdatedataverstring = parseFloat(localStorage.getItem("updver"));
	if (localupdatedataverstring <= 1.7 || !localupdatedataverstring) {
		console.log("Preparing NovaOS2 switch.");
		gid("versionswitcher")?.showModal();
		return;
	}

	await updateMemoryData().then(async () => {
		try {
			setsrtpprgbr(70);
			try {
				qsetsRefresh()
				timetypecondition = await getSetting("timefrmt") == '24 Hour' ? false : true;
			} catch { }
			gid('startupterms').innerHTML = "Initialising...";
			updateTime();
			setsrtpprgbr(80);
			await checkdmode();
			setsrtpprgbr(90);
			await genTaskBar();
			setsrtpprgbr(100);
			gid('startupterms').innerHTML = "Startup completed";
			closeElementedis();
			genDesktop();

			let fetchupdatedataver;
			async function fetchDataAndUpdate() {
				let fetchupdatedata = await fetch("versions.json");
				if (fetchupdatedata.ok) {
					fetchupdatedataver = (await fetchupdatedata.json()).osver;
					if (localupdatedataver !== fetchupdatedataver) {
						if (await justConfirm("Update default apps?", "Your default apps are old. Update them to access new features and fixes.")) {
							await installdefaultapps();
							startup();
						} else {
							say("You can always update app on settings app/Preferances")
						}
					}
				} else {
					console.error("Failed to fetch data from the server.");
				}
			}



			await fetchDataAndUpdate();
			removeInvalidMagicStrings();
			function startUpdateTime() {
				let now = new Date();
				let delay = (60 - now.getSeconds()) * 1000;
				setTimeout(function () {
					updateTime();
					setInterval(updateTime, 60000);
				}, delay);
			}
			startUpdateTime();
			async function loadFileTypeAssociations() {
				const associations = await getSetting('fileTypeAssociations');
				fileTypeAssociations = associations || {};

				cleanupInvalidAssociations();
			}
			await loadFileTypeAssociations();
			await ensureAllSettingsFilesExist();
			const end = performance.now();

			rllog(
				`You are using \n\n%cNovaOS%c\n%cNovaOS is the web system made for you.%c\n\nStartup: ${(end - start).toFixed(2)}ms\nUsername: ${CurrentUsername}\nCurrent: ${localupdatedataver}\n12hr Time format: ${timetypecondition}\nNewest: ${fetchupdatedataver}`,
				'color: white; background-color: #101010; font-size: 2rem; padding: 0.7rem 1rem; border-radius: 1rem;',
				'',
				'padding:5px 0; padding-top:1rem;',
				'color: lightgreen; font-size:70%;'
			);

			try {
				function runScriptsSequentially(scripts, delay) {
					scripts.forEach((script, index) => {
						setTimeout(script, index * delay);
					});
				}
				runScriptsSequentially(onstartup, 1000)
			} catch (e) { }
		} catch (err) { console.error("startup error:", err); }
	})
}
async function registerDecryptWorker() {
	if ('serviceWorker' in navigator && !decryptWorkerRegistered) {
		await navigator.serviceWorker.register('novaCrypt.js')
			.then(() => {
				sysLog("EncDec Thread", "is now running.");
				decryptWorkerRegistered = true
			})
			.catch(err => console.error('Service Worker registration failed:', err));
	}
}


function updateTime() {
	const now = new Date();
	let hours = now.getHours();
	if (timetypecondition) {
		// 12-hour format
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = (hours % 12) || 12;
		timeFormat = `${hours}:${now.getMinutes().toString().padStart(2, '0')} ${ampm}`;
	} else {
		// 24-hour format
		timeFormat = `${hours.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
	}
	const date = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;
	gid('time-display').innerText = timeFormat;
	gid('date-display').innerText = date;
}
const jsonToDataURI = json => `data:application/json,${encodeURIComponent(JSON.stringify(json))}`;
async function openn() {
	gid("strtsear").value = "";
	gid("strtappsugs").style.display = "none";
	let x = await getFileNamesByFolder("Apps/");
	x.sort((a, b) => a.name.localeCompare(b.name));

	if (x.length === 0 && initmenuload) {
		initmenuload = false;
		gid("appdmod").close();
		let choicetoreinst = await justConfirm(
			`Re-initialize OS?`,
			`Did the OS initialization fail? If yes, we can re-initialize your OS and install all the default apps. \n\nNovaOS did not find any apps while the initial load of Nova Menu. \n\nRe-initializing your OS may delete your data.`
		);
		if (choicetoreinst) {
			initialiseOS();
		}
		return;
	}

	initmenuload = false;

	let existingAppElements = [...gid("appsindeck").children];
	let existingAppIds = new Set(existingAppElements.map((child) => child.dataset.appId));
	let newAppIds = new Set(x.map((app) => app.id));

	existingAppElements.forEach((element) => {
		if (!newAppIds.has(element.dataset.appId)) {
			element.remove();
		}
	});

	Promise.all(
		x.map(async (app) => {
			if (existingAppIds.has(app.id)) return;

			var appShortcutDiv = document.createElement("div");
			appShortcutDiv.className = "app-shortcut ctxAvail tooltip sizableuielement";
			appShortcutDiv.setAttribute("unid", app.id || '');
			appShortcutDiv.dataset.appId = app.id;
			appShortcutDiv.addEventListener("click", () => openfile(app.id));

			var iconSpan = document.createElement("span");
			iconSpan.classList.add("appiconspan");
			iconSpan.innerHTML = "<span class='taskbarloader'></span>";
			getAppIcon(false, app.id).then((appIcon) => {
				iconSpan.innerHTML = appIcon;
			});

			function getapnme(x) {
				return x.split(".")[0];
			}

			var nameSpan = document.createElement("span");
			nameSpan.className = "appname";
			nameSpan.textContent = getapnme(app.name);

			appShortcutDiv.appendChild(iconSpan);
			appShortcutDiv.appendChild(nameSpan);

			gid("appsindeck").appendChild(appShortcutDiv);
		})
	)
		.then(() => { })
		.catch((error) => {
			console.error("An error occurred:", error);
		});

	if (gid("closeallwinsbtn").checked) {
		gid("closeallwinsbtn").checked = false;
	}

	if (!Object.keys(winds).length) {
		gid("closeallwinsbtn").checked = true;
		gid("closeallwinsbtn").setAttribute("disabled", true);
	} else {
		gid("closeallwinsbtn").setAttribute("disabled", false);
	}

	gid("appdmod").showModal();
}
async function loadrecentapps() {
	gid("serrecentapps").innerHTML = ``
	if (appsHistory.length < 1) {
		gid("partrecentapps").style.display = "none";
		gid("serrecentapps").innerHTML = `No recent apps`
		return;
	} else {
		gid("partrecentapps").style.display = "block";
	}
	let x = await getFileNamesByFolder("Apps");
	x.reverse();
	Promise.all(x.map(async (app) => {
		if (!appsHistory.includes(app.name)) {
			return
		}
		var appShortcutDiv = document.createElement("div");
		appShortcutDiv.className = "app-shortcut ctxAvail tooltip sizableuielement";
		appShortcutDiv.setAttribute("unid", app.id || '');
		appShortcutDiv.addEventListener("click", () => openapp(app.name, app.id));
		var iconSpan = document.createElement("span");
		iconSpan.classList.add("appiconspan");
		if (!appicns[app.id]) {
			const content = await getFileById(app.id);
			const unshrunkContent = decodeBase64Content(content.content);
			const tempElement = document.createElement('div');
			tempElement.innerHTML = unshrunkContent;
			const metaTags = tempElement.getElementsByTagName('meta');
			let metaTagData = null;
			Array.from(metaTags).forEach(tag => {
				const tagName = tag.getAttribute('name');
				const tagContent = tag.getAttribute('content');
				if (tagName === 'nova-icon' && tagContent) {
					metaTagData = tagContent;
				}
			});
			if (typeof metaTagData === "string") {
				if (containsSmallSVGElement(metaTagData)) {
					iconSpan.innerHTML = metaTagData;
				} else {
					iconSpan.innerHTML = defaultAppIcon;
				}
			} else {
				iconSpan.innerHTML = defaultAppIcon;
			}
			appicns[app.id] = iconSpan.innerHTML
		} else {
			iconSpan.innerHTML = appicns[app.id]
		}
		var nameSpan = document.createElement("span");
		nameSpan.className = "appname";
		nameSpan.textContent = basename(app.name);
		var tooltisp = document.createElement("span");
		tooltisp.className = "tooltiptext";
		tooltisp.textContent = basename(app.name);

		appShortcutDiv.appendChild(iconSpan);
		appShortcutDiv.appendChild(nameSpan);
		appShortcutDiv.appendChild(tooltisp);
		gid("serrecentapps").appendChild(appShortcutDiv);
	})).then(async () => {

		gid("novamenusearchinp").focus();
	}).catch((error) => {
		console.error('An error occurred:', error);
	});

}

function makedefic(str) {
	if (!str) {
		return 'app';
	}
	const words = str.split(/\s+/);
	const result = words.map(word => {
		const consonantPattern = /[^aeiouAEIOU\s]+/g;
		const consonantMatches = word.match(consonantPattern);
		if (consonantMatches && consonantMatches.length >= 2) {
			return consonantMatches.slice(0, 2).map((letter, index) => index === 0 ? letter : letter.toLowerCase()).join('');
		} else {
			const firstLetter = word.charAt(0);
			const firstConsonantIndex = word.search(consonantPattern);
			if (firstConsonantIndex !== -1) {
				return firstLetter + word.charAt(firstConsonantIndex).toLowerCase();
			}
			return firstLetter;
		}
	});
	return result.join('').slice(0, 3);
}
function updateBattery() {
	var batteryPromise;
	if ('getBattery' in navigator) {
		batteryPromise = navigator.getBattery();
	} else if ('battery' in navigator) {
		batteryPromise = Promise.resolve(navigator.battery);
	} else {
		console.log('No Battery API');
		gid("batterydisdiv").style.display = "none";
		return;
	}
	batteryPromise.then(function (battery) {
		var batteryLevel = Math.floor(battery.level * 100);
		var isCharging = battery.charging;
		if ((batteryLevel === 100 && isCharging) || (batteryLevel === 0 && isCharging)) {
			document.getElementById("batterydisdiv").style.display = "none";
		} else {
			document.getElementById("batterydisdiv").style.display = "block";
		}
		let iconClass;
		if (batteryLevel >= 75) {
			iconClass = 'battery_full';
		} else if (batteryLevel >= 25) {
			iconClass = 'battery_5_bar';
		} else if (batteryLevel >= 15) {
			iconClass = 'battery_2_bar';
		} else {
			iconClass = 'battery_alert';
		}
		var batteryDisplayElement = document.getElementById('battery-display');
		var batteryPDisplayElement = document.getElementById('battery-p-display');
		if (batteryDisplayElement && batteryPDisplayElement) {
			if (iconClass !== batteryDisplayElement.innerText) {
				batteryDisplayElement.innerHTML = iconClass;
				batteryPDisplayElement.innerHTML = batteryLevel + "%";
			}
		}
	}).catch(function (error) {
		console.log("Battery Error: " + error);
	});
}

function closeElementedis() {
	var element = document.getElementById("edison");
	element.classList.add("closeEffect");
	setTimeout(function () {
		element.close()
		element.classList.remove("closeEffect");
	}, 500);
}
function clwin(x) {
	snappingconthide();
	const el = isElement(x) ? x : document.getElementById(x);
	if (!el) return;

	const windKey = el.getAttribute("data-winuid");
	if (windKey) {
		console.log(windKey)
		URL.revokeObjectURL(winds[windKey].src)
		delete winds[windKey];
	}

	el.classList.add("transp3");
	setTimeout(() => {
		el.classList.remove("transp3");
		el.remove();
		loadtaskspanel()
	}, 700);
}

function getMetaTagContent(unshrunkContent, metaName, decode = false) {
	const content = decode ? decodeBase64Content(unshrunkContent) : unshrunkContent;
	const tempElement = document.createElement('div');
	tempElement.innerHTML = content;
	const metaTag = Array.from(tempElement.getElementsByTagName('meta')).find(tag =>
		tag.getAttribute('name') === metaName && tag.getAttribute('content')
	);
	return metaTag ? metaTag.getAttribute('content') : null;
}
function getAppTheme(unshrunkContent) {
	return getMetaTagContent(unshrunkContent, 'theme-color', true);
}
function getAppAspectRatio(unshrunkContent) {
	const content = decodeBase64Content(unshrunkContent);
	return content.includes("aspect-ratio") ? getMetaTagContent(content, 'aspect-ratio', false) : null;
}
async function getAppIcon(content, id, lazy = 0) {
	try {
		const withTimeout = (promise) =>
			Promise.race([promise, new Promise((_, reject) => setTimeout(() => reject(), 3000))]);
		if (!content) {
			const file = await withTimeout(getFileById(id));
			if (!file || !file.content) throw new Error("File content unavailable" + id);
			return await withTimeout(getAppIcon(file.content, id));
		}
		if (lazy) return appicns[id] || defaultAppIcon;
		if (appicns[id]) return appicns[id];
		const iconContent = await withTimeout(getMetaTagContent(content, 'nova-icon', true));
		if (iconContent && containsSmallSVGElement(iconContent)) {
			appicns[id] = iconContent;
			return iconContent;
		}
	} catch (err) {
		console.error(err);
	}
	let icondatatodo = await getFileNameByID(id) || id;
	return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="115.24806" height="130.92446" viewBox="0,0,115.24806,130.92446"><g transform="translate(-182.39149,-114.49081)"><g stroke="none" stroke-miterlimit="10"><path d="M182.39149,245.41527v-130.83054h70.53005l44.68697,44.95618v85.87436z" fill="` + stringToPastelColor(icondatatodo) + `" stroke-width="none"/><path d="M252.60365,158.84688v-44.35607l45.03589,44.35607z" style="opacity: 0.7" fill="#dadada" stroke-width="0"/><text transform="translate(189,229) scale(0.9,0.9)" font-size="3rem" xml:space="preserve" fill="#dadada" style="opacity: 0.7" stroke-width="1" font-family="monospace" font-weight="normal" text-anchor="start"><tspan x="0" dy="0" fill="black">${makedefic(icondatatodo)}</tspan></text></g></g></svg>`;
}
async function fetchData(url) {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const data = await response.text();
		return data;
	} catch (error) {
		console.error("Error fetching data:", error.message);
		const data = "App Launcher: CRITICAL ERROR<br><br><sup>" + error.message + "</sup>";
		return data;
	}
}
var content;
function putwinontop(x) {
	Object.keys(winds).forEach(wid => {
		winds[wid].zIndex = Number(gid(`window${wid}`).style.zIndex || 0);
	});

	if (Object.keys(winds).length > 1) {
		const windValues = Object.values(winds).map(wind => Number(wind.zIndex) || 0);
		const maxWindValue = Math.max(...windValues);
		document.getElementById(x).style.zIndex = maxWindValue + 1;
		normalizeZIndexes(x);
	} else {
		document.getElementById(x).style.zIndex = 0;
	}
}
function isWinOnTop(x) {
	const ourKey = x.replace(/^window/, '');
	const maxKey = Object.keys(winds).reduce((a, b) => (Number(winds[a].zIndex) > Number(winds[b].zIndex) ? a : b));

	return ourKey === maxKey;
}

function normalizeZIndexes(excludeWindowId = null) {
	const windValues = Object.entries(winds)
		.filter(([key]) => key !== excludeWindowId)
		.map(([_, wind]) => Number(wind.zIndex) || 0);

	const uniqueSorted = [...new Set(windValues)].sort((a, b) => a - b);
	if (uniqueSorted.length === uniqueSorted[uniqueSorted.length - 1]) return;

	const zIndexMap = uniqueSorted.reduce((map, value, index) => {
		map[value] = index;
		return map;
	}, {});

	winds = Object.keys(winds).reduce((normalizedWinds, key) => {
		normalizedWinds[key] = {
			...winds[key],
			zIndex: key === excludeWindowId
				? winds[key].zIndex
				: zIndexMap[Number(winds[key].zIndex) || 0],
		};
		return normalizedWinds;
	}, {});
}

function requestLocalFile() {
	var requestID = genUID()
	x = {
		"appname": "files",
		"type": "open",
		"identifier": requestID
	}
	localStorage.setItem("todo", JSON.stringify(x))
	openapp("files", 1)
}
function getMaxZIndex() {
	const elements = document.querySelectorAll('.window');
	let maxZIndex = 0;
	elements.forEach(element => {
		const zIndex = parseInt(window.getComputedStyle(element).zIndex);
		if (zIndex > maxZIndex) {
			maxZIndex = zIndex;
		}
	});
}
function folderExists(folderName) {
	const parts = folderName.replace(/\/$/, '').split('/');
	let current = memory.root;
	for (let part of parts) {
		part += '/';
		if (!current[part]) {
			return false;
		}
		current = current[part];
	}
	return true;
}
function isBase64(str) {
	try {
		function validateBase64(data) {
			const base64Pattern = /^[A-Za-z0-9+/=]+$/;
			if (!base64Pattern.test(data)) {
				return false;
			}
			const padding = data.length % 4;
			if (padding > 0) {
				data += '='.repeat(4 - padding);
			}
			atob(data);
			return true;
		}
		if (validateBase64(str)) {
			return true;
		}
		const base64Prefix = 'data:';
		const base64Delimiter = ';base64,';
		if (str.startsWith(base64Prefix)) {
			const delimiterIndex = str.indexOf(base64Delimiter);
			if (delimiterIndex !== -1) {
				const base64Data = str.substring(delimiterIndex + base64Delimiter.length);
				return validateBase64(base64Data);
			}
		}
		return false;
	} catch (err) {
		return false;
	}
}
async function extractAndRegisterCapabilities(appId, content) {
	try {
		if (!content) {
			content = await getFileById(appId);
			content = content.content;
		}
		if (isBase64(content)) {
			content = decodeBase64Content(content);
		}
		let parser = new DOMParser();
		let doc = parser.parseFromString(content, "text/html");
		let metaTag = doc.querySelector('meta[name="capabilities"]');
		if (metaTag) {
			let capabilities = metaTag.getAttribute("content").split(',');
			await registerApp(appId, capabilities);
		} else {
			console.log(`No capabilities: ${appId}`);
		}
	} catch (error) {
		console.error("Error extracting and registering capabilities:", error);
	}
}
async function registerApp(appId, capabilities) {
	for (let fileType of capabilities) {
		if (!fileTypeAssociations[fileType]) {
			fileTypeAssociations[fileType] = [];
		}
		if (!fileTypeAssociations[fileType].includes(appId)) {
			fileTypeAssociations[fileType].push(appId);
		}
	}
	await setSetting('fileTypeAssociations', fileTypeAssociations);
	notify(await getFileNameByID(appId) + " installed", "Registered " + capabilities.toString(), "NovaOS System")
}
async function cleanupInvalidAssociations() {
	const validAppIds = await getAllValidAppIds();
	let associationsChanged = false;

	for (let fileType in fileTypeAssociations) {
		const originalAssociations = fileTypeAssociations[fileType];
		fileTypeAssociations[fileType] = originalAssociations.filter(appId => validAppIds.includes(appId));

		if (fileTypeAssociations[fileType].length === 0) {
			delete fileTypeAssociations[fileType];
		}

		if (originalAssociations.length !== fileTypeAssociations[fileType].length) {
			associationsChanged = true;
		}
	}

	if (associationsChanged) {
		await setSetting('fileTypeAssociations', fileTypeAssociations);
	}
}
async function getAllValidAppIds() {
	const appsFolder = await getFileNamesByFolder('Apps/');
	return Object.keys(appsFolder || {}).map(appFileName => appsFolder[appFileName].id);
}
function makedialogclosable(ok) {
	const myDialog = gid(ok);
	document.addEventListener('click', (event) => {
		if (event.target === myDialog) {
			myDialog.classList.add("*closeEffect");
			setTimeout(
				myDialog.close()
				, 500);
		}
	});
}

function openModal(type, { title = '', message, options = null, status = null, preset = '' } = {}) {
	if (badlaunch) { return }
	return new Promise((resolve) => {
		const modal = document.querySelector("#NaviconfDia");
		const h1 = modal.querySelector('h1');
		const p = modal.querySelector('p');
		const dropdown = modal.querySelector('.dropdown');
		const inputField = modal.querySelector('.input-field');
		const yesButton = modal.querySelector('.yes-button');
		const noButton = modal.querySelector('.notbn');
		h1.textContent = title;
		p.innerHTML = message;
		dropdown.style.display = 'none';
		inputField.style.display = 'none';
		noButton.style.display = 'none';
		yesButton.textContent = 'OK';
		if (type === 'confirm') {
			noButton.style.display = 'inline-block';
			yesButton.textContent = 'Yes';
		} else if (type === 'dropdown') {
			dropdown.innerHTML = options.map(option => `<option value="${option}">${option}</option>`).join('');
			dropdown.style.display = 'block';
			noButton.style.display = 'inline-block';
		} else if (type === 'say' && status) {
			let ic = "warning";
			if (status === "success") ic = "check_circle";
			else if (status === "failed") ic = "dangerous";
			p.innerHTML = `<span class="material-symbols-rounded">${ic}</span> ${message}`;
		} else if (type === 'ask') {
			inputField.value = preset;
			inputField.style.display = 'block';
		}
		// Button actions
		yesButton.onclick = () => {
			modal.close();
			resolve(type === 'dropdown' ? dropdown.value : type === 'ask' ? inputField.value : true);
		};

		noButton.onclick = () => {
			modal.close();
			resolve(false);
		};

		modal.showModal();
	});
}
function justConfirm(title, message) {
	return openModal('confirm', { title, message });
}
function showDropdownModal(title, message, options) {
	return openModal('dropdown', { title, message, options });
}
function say(message, status = null) {
	return openModal('say', { message, status });
}
function ask(question, preset = '') {
	return openModal('ask', { message: question, preset });
}
async function loadtaskspanel() {
	let appbarelement = gid("nowrunninapps");
	let currentKeys = Array.from(appbarelement.querySelectorAll(".app-shortcut")).map(el => el.dataset.key);
	let validKeys = Object.entries(winds)
		.filter(([winID, data]) => gid("window" + winID) !== null);

	let newKeys = validKeys.map(([winID, data]) => data.title + winID);


	let keysToAdd = newKeys.filter(key => !currentKeys.includes(key));
	let keysToRemove = currentKeys.filter(key => !newKeys.includes(key));

	keysToRemove.forEach(key => {
		let element = appbarelement.querySelector(`[data-key='${key}']`);
		element.classList.add("closeEffect");
		setTimeout(function () {
			try {
				if (element) appbarelement.removeChild(element);

			} catch (e) { }
		}, 500);
	});

	keysToAdd.forEach(async key => {
		let app = key.slice(0, -12);
		let wid = key.slice(-12);

		let appShortcutDiv = document.createElement("biv");
		appShortcutDiv.className = "app-shortcut ctxAvail tooltip adock sizableuielement";
		appShortcutDiv.setAttribute("unid", key.id || '');
		appShortcutDiv.dataset.key = key;

		appShortcutDiv.addEventListener("click", function () {
			putwinontop('window' + wid);
			minim(0, wid);
		});

		let iconSpan = document.createElement("span");
		iconSpan.classList.add("appiconspan");
		iconSpan.innerHTML = appicns[app] || defaultAppIcon;

		let tooltisp = document.createElement("span");
		tooltisp.className = "tooltiptext";
		tooltisp.innerText = basename(app);

		appShortcutDiv.appendChild(iconSpan);
		appShortcutDiv.appendChild(tooltisp);
		appbarelement.appendChild(appShortcutDiv);
	});

	appbarelement.style.display = validKeys.length > 0 ? "flex" : "none";
}
var dev;
function shrinkbsf(str) {
	return str;
}
function unshrinkbsf(compressedStr) {
	return compressedStr;
}
async function makewall(deid) {
	let x = deid;
	if (x != undefined) {
		let unshrinkbsfX;
		if (x.startsWith("http")) {
			unshrinkbsfX = x;
		} else {
			unshrinkbsfX = await getFileById(x);
			unshrinkbsfX = unshrinkbsfX.content;
		}
		setbgimagetourl(unshrinkbsfX);
	}
	await setSetting("wall", deid);
}
async function initialiseOS() {
	if (badlaunch) { return }
	dbCache = null;
	cryptoKeyCache = null;
	await say(`
		<h2>Terms of service and License</h2>
		<p>By using Nova OS, you agree to the <a href="https://github.com/adthoughtsglobal/Nova-OS/blob/main/Adthoughtsglobal%20Nova%20Terms%20of%20use">Adthoughtsglobal Nova Terms of Use</a>. Read the terms before use. 
		<div style="background-color: #001b00; color: lightgreen; padding: 0.8rem; border: 1px solid #254625;font-size:inherit; border-radius: .5rem; margin: 0.8rem 0; display: flex;flex-direction:row; align-items: center; justify-content: flex-start;gap:0.5rem;">
			<span class="material-symbols-rounded">check</span>
			<div>We do not store or share your personal information.</div>
		</div>
		</p>
		<iframe src="https://adthoughtsglobal.github.io/termsofuse.html"></iframe>
	`);
	console.log("Setting Up NovaOS\n\nUsername: " + CurrentUsername + "\nWith: Sample preset\nUsing host: " + location.href)
	initialization = true
	memory = {
		"root": {
			"Downloads/": {
			},
			"Apps/": {},
			"Desktop/": {},
			"Dock/": {},
			"Media/": {}
		}
	};

	setdb().then(async function () {
		await saveMagicStringInLocalStorage(password);
		await ensureAllSettingsFilesExist()
			.then(async () => await installdefaultapps())
			.then(async () => getFileNamesByFolder("Apps"))
			.then(async (fileNames) => {
				if (defAppsList.length !== fileNames.length) {
					setTimeout(installdefaultapps(), 3000);
					gid('startupterms').innerText = "Fixing problems..."
					return;
				}
			})
			.catch(error => {
				console.error("Error during initialization:", error);
			})
			.then(async () => {
				await startup();
				await createFile('Downloads/', 'Welcome.txt', 'text', `Welcome to Nova OS! If you are having trouble, kindly tell us in our discord, https://discord.gg/atkqbwEQU8.

Learn how to do things in the NovaOS wiki pages, https://novaos.gitbook.io/main. 
Browse the most used features at https://novaos.gitbook.io/main/docs/features.

Support NovaOS at https://novaos.gitbook.io/main/how-to/support-novaos`)
				notify("Welcome to NovaOS, " + CurrentUsername + "!", "We really hope you would enjoy your NovaOS", "NovaOS")
				initialization = false;
			})
	})
}
async function installdefaultapps() {
	gid("edison").showModal();
	if (gid('startupterms')) {
		gid('startupterms').innerText = "Just a moment...";
	}
	gid("appdmod").close();
	const maxRetries = 2;
	async function updateApp(appName, attempt = 1) {
		try {
			const filePath = "appdata/" + appName + ".html";
			const response = await fetch(filePath);
			if (!response.ok) {
				throw new Error("Failed to fetch file for " + appName);
			}
			const fileContent = await response.text();
			await createFile("Apps/", toTitleCase(appName), "app", fileContent);
		} catch (error) {
			console.error("Error updating " + appName + ":", error.message);
			if (attempt < maxRetries) {
				await updateApp(appName, attempt + 1);
			} else {
				console.error("Max retries reached for " + appName + ". Skipping update.");
			}
		}
	}
	async function waitForNonNull() {
		let result = null;
		while (result === null) {
			result = await updateMemoryData();
			if (result === null) {
				gid('startupterms').innerText = "Waiting for DB to open..."
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
		}
		return result;
	}
	await waitForNonNull().then(async () => {
		// Update each app sequentially
		const hangMessages = ["Hang in tight...", "Almost there...", "Just a moment more...", "Patience, young grasshopper..."];
		for (let i = 0; i < defAppsList.length; i++) {
			const appUpdatePromise = await updateApp(defAppsList[i]);
			let delay = 0;
			const interval = setInterval(() => {
				if (delay >= 3000) {
					gid('startupterms').innerText = hangMessages[(delay / 2000) % hangMessages.length];
				}
				delay += 2000;
			}, 200);
			await Promise.race([appUpdatePromise, new Promise(res => setTimeout(res, 3000))]);
			clearInterval(interval);
			if (gid('startupterms')) {
				gid('startupterms').innerText = "Installing Apps";
			}
			setsrtpprgbr(Math.round((i + 1) / defAppsList.length * 100));
		}
		let fetchupdatedata = await fetch("versions.json");
		if (fetchupdatedata.ok) {
			let fetchupdatedataver = (await fetchupdatedata.json()).osver;
			localStorage.setItem("updver", fetchupdatedataver);
		} else {
			console.error("Failed to fetch data from the server.");
		}
		if (!initialization) {
			closeElementedis();
		}
	})
}
async function prepareArrayToSearch() {
	let arrayToSearch = [];
	function scanFolder(folderPath, folderContents) {
		for (let name in folderContents) {
			let fullPath = `${folderPath}${name}`;
			let item = folderContents[name];
			if (item.id) {
				if (mtpetxt(name) == "app") {
					name = basename(name)
				}
				arrayToSearch.push({ name, id: item.id, type: "file", path: folderPath });
			} else {
				arrayToSearch.push({ name: name, type: "folder", path: folderPath });
				scanFolder(fullPath, item);
			}
		}
	}
	for (const folder in memory["root"]) {
		scanFolder(folder, memory["root"][folder]);
	}
	fileslist = arrayToSearch;
}
async function strtappse(event) {
	if (fileslist.length === 0) {
		await prepareArrayToSearch();
	}
	const searchValue = gid("strtsear").value.toLowerCase().trim();
	if (searchValue === "") return;
	const abracadra = await getSetting("smartsearch");
	let maxSimilarity = 0.5;
	let appToOpen = null;
	let mostRelevantItem = null;
	const itemsWithSimilarity = [];
	fileslist.forEach(item => {
		const itemName = item.name.toLowerCase();
		if (item.type !== "folder") {
			let similarity = abracadra ? calculateSimilarity(itemName, searchValue) : 0;
			if (!abracadra && itemName.startsWith(searchValue)) {
				similarity = 1;
			}
			if (similarity > maxSimilarity) {
				maxSimilarity = similarity;
				appToOpen = item;
			}
			if (similarity >= 0.2) {
				itemsWithSimilarity.push({ item, similarity });
			}
		}
	});
	if (event.key === "Enter") {
		event.preventDefault();
		if (searchValue === "i love nova") {
			gid("searchwindow").close();
			notify("Aw i read what you just typed in,", "I love you too! :)", "Nova just replied you:");
			really = true;
			return;
		}
		if (appToOpen) {
			openfile(appToOpen.id);
		}
		return;
	}
	itemsWithSimilarity.sort((a, b) => b.similarity - a.similarity);
	const groupedResults = itemsWithSimilarity.reduce((acc, { item }) => {
		const path = item.path || '';
		if (!acc[path]) acc[path] = [];
		acc[path].push(item);
		return acc;
	}, {});

	gid("strtappsugs").innerHTML = "";
	let elements = 0;
	Object.keys(groupedResults).forEach(path => {
		const items = groupedResults[path];
		const pathElement = document.createElement("div");
		pathElement.innerHTML = `<strong>${path}</strong>`;
		gid("strtappsugs").appendChild(pathElement);
		items.forEach(item => {
			if (!mostRelevantItem) mostRelevantItem = item;
			const newElement = document.createElement("div");
			newElement.innerHTML = `<div>${appicns[item.id] != undefined ? appicns[item.id] : defaultAppIcon} ${item.name}</div><span class="material-symbols-rounded" onclick="openfile('${item.id}')">arrow_outward</span>`;
			gid("strtappsugs").appendChild(newElement);
			elements++;
		});
	});
	gid("strtappsugs").style.display = "block";
	if (mostRelevantItem) {
		gid("partrecentapps").style.display = "none";
		document.getElementsByClassName("previewsside")[0].style.display = "flex";
		gid("seapppreview").style.display = "block";
		gid('seprw-icon').innerHTML = appicns[mostRelevantItem.id] != undefined ? appicns[mostRelevantItem.id] : defaultAppIcon;
		gid('seprw-appname').innerText = mostRelevantItem.name;
		gid('seprw-openb').onclick = function () {
			openfile(mostRelevantItem.id);
		};

	} else {
		gid("partrecentapps").style.display = "block";
		gid("seapppreview").style.display = "none";
	}
	if (elements == 0) {
		gid("strtappsugs").innerHTML = `<p style="margin:1rem; opacity: 0.5;">No results</p>`
	}
}
function calculateSimilarity(string1, string2) {
	const m = string1.length;
	const n = string2.length;
	const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));
	for (let i = 0; i <= m; i++) {
		for (let j = 0; j <= n; j++) {
			if (i === 0) dp[i][j] = j;
			else if (j === 0) dp[i][j] = i;
			else if (string1[i - 1] === string2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
			else {
				const penalty = (i + j) / (m + n);
				dp[i][j] = 1 + Math.min(dp[i][j - 1], dp[i - 1][j], dp[i - 1][j - 1] + penalty);
			}
		}
	}
	return 1 - dp[m][n] / Math.max(m, n);
}
function containsSmallSVGElement(str) {
	var svgRegex = /^<svg\s*[^>]*>[\s\S]*<\/svg>$/i;
	return svgRegex.test(str) && str.length <= 5000;
}
let countdown, countdown2;
function startTimer(minutes) {
	document.getElementById("sleepbtns").style.display = "none";
	clearInterval(countdown);
	const now = Date.now();
	const then = now + minutes * 60 * 1000;
	displayTimeLeft(minutes * 60);
	countdown = setInterval(() => {
		const secondsLeft = Math.round((then - Date.now()) / 1000);
		if (secondsLeft <= 0) {
			clearInterval(countdown);
			document.getElementById('sleeptimer').textContent = '00:00';
			playBeeps();
			document.getElementById('sleepwindow').close()
			return;
		}
		displayTimeLeft(secondsLeft);
	}, 1000);
}
function playBeeps() {
	const context = new (window.AudioContext || window.webkitAudioContext)();
	const now = context.currentTime;
	const duration = 0.1;
	const fadeDuration = 0.02;
	const gap = 0.1;
	const pitch = 700;
	const rhythm = [
		[0, 0.2, 0.4, 0.6],
		[1.2, 1.4, 1.6, 1.8],
		[2.4, 2.6, 2.8, 3.0]
	];
	const getOffsetTime = (index, time) => now + time + index * (4 * (duration + gap));
	rhythm.forEach((set, index) => {
		set.forEach(time => {
			const offsetTime = getOffsetTime(index, time);
			const oscillator = context.createOscillator();
			const gainNode = context.createGain();
			oscillator.type = 'triangle';
			oscillator.frequency.setValueAtTime(pitch, offsetTime);
			gainNode.gain.setValueAtTime(0, offsetTime);
			gainNode.gain.linearRampToValueAtTime(1, offsetTime + fadeDuration); // Fade in
			gainNode.gain.linearRampToValueAtTime(0, offsetTime + duration - fadeDuration); // Fade out
			oscillator.connect(gainNode);
			gainNode.connect(context.destination);
			oscillator.start(offsetTime);
			oscillator.stop(offsetTime + duration);
		});
	});
}
async function setMessage() {
	const message = await ask('What should be the message?', 'Do not disturb...');
	document.getElementById('sleepmessage').innerHTML = message;
}

function displayTimeLeft(seconds) {
	const minutes = Math.floor(seconds / 60);
	const remainderSeconds = seconds % 60;
	const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
	document.getElementById('sleeptimer').textContent = display;
}

function notify(title = "Notification", description = "There is a notification", appname = "unknown") {
	if (document.getElementById("notification").style.display == "block") {
		document.getElementById("notification").style.display = "none";
		setTimeout(notify(title, description, appname), 500)
	}
	var appnameb = document.getElementById('notifappName');
	var descb = document.getElementById('notifappDesc');
	var titleb = document.getElementById('notifTitle');
	if (appnameb && descb && titleb) {
		appnameb.innerText = appname;
		descb.innerText = description;
		titleb.innerText = title;
		const windValues = Object.values(winds).map(wind => Number(wind.zIndex) || 0);
		const maxWindValue = Math.max(...windValues);
		document.getElementById("notification").style.zIndex = maxWindValue + 1;
		document.getElementById("notification").style.display = "block";
		setTimeout(function () {
			document.getElementById("notification").style.display = "none";
		}, 5000);
	} else {
		console.error("One or more DOM elements not found.");
	}
	const notificationID = genUID();
	notifLog[notificationID] = { title, description, appname };

}
let toastInProgress = false;
let totalDuration = 0;
const minToastDuration = 3000;
const maxToastDuration = 5000;
let toastQueue = [];

function toast(text, duration = 5000) {
	let displayDuration = Math.min(duration, maxToastDuration);

	if (toastInProgress) {
		toastQueue.push({ text, duration: displayDuration });
	} else {
		totalDuration = displayDuration;
		toastInProgress = true;
		displayToast(text, displayDuration);
	}
}

function displayToast(text, duration) {
	var titleb = document.getElementById('toastdivtext');
	if (titleb) {
		titleb.innerText = text;

		const windValues = Object.values(winds).map(wind => Number(wind.zIndex) || 0);
		const maxWindValue = Math.max(...windValues);
		document.getElementById("toastdiv").style.zIndex = maxWindValue + 1;
		document.getElementById("toastdiv").classList.add('notifpullanim');
		document.getElementById("toastdiv").style.display = "block";

		setTimeout(function () {
			document.getElementById("toastdiv").classList.remove('closeEffect');
		}, 200);

		document.getElementById("toastdiv").onclick = function () {
			document.getElementById("toastdiv").classList.add('closeEffect');
			document.getElementById("toastdiv").style.display = "none";
			toastInProgress = false;
			if (toastQueue.length > 0) {
				const nextToast = toastQueue.shift();
				displayToast(nextToast.text, nextToast.duration);
			}
		};

		setTimeout(function () {
			document.getElementById("toastdiv").classList.add('closeEffect');
			setTimeout(function () {
				document.getElementById("toastdiv").style.display = "none";
				toastInProgress = false;
				if (toastQueue.length > 0) {
					const nextToast = toastQueue.shift();
					displayToast(nextToast.text, nextToast.duration);
				}
			}, 200);
		}, duration);
	} else {
		console.error("DOM elements not found.");
	}
}

function displayNotifications(x) {
	if (x == "clear") {
		notifLog = {};

	}
	const notifList = document.getElementById("notiflist");
	notifList.innerHTML = "";
	if (Object.values(notifLog).length == 0) {
		document.querySelector(".notiflist").style.display = "none";
	} else {
		document.querySelector(".notiflist").style.display = "flex";
	}
	Object.values(notifLog).forEach(({ title, description, appname }) => {
		const notifDiv = document.createElement("div");
		notifDiv.className = "notification";
		const titleDiv = document.createElement("div");
		titleDiv.className = "notifTitle";
		titleDiv.innerText = title;
		const descDiv = document.createElement("div");
		descDiv.className = "notifDesc";
		descDiv.innerText = description;
		const appNameDiv = document.createElement("div");
		appNameDiv.className = "notifAppName";
		appNameDiv.innerText = appname;
		notifDiv.appendChild(appNameDiv);
		notifDiv.appendChild(titleDiv);
		notifDiv.appendChild(descDiv);
		notifList.appendChild(notifDiv);
	});
}
function runAsOSL(content) {
	const encodedContent = encodeURIComponent(content).replace(/'/g, "%27").replace(/"/g, "%22");
	const cont = `<iframe class="oslframe" src="https://origin.mistium.com/Versions/originv5.5.4?embed=${encodedContent}"></iframe>
	<style>
		.oslframe {
			width: 100%;
			height: 100%;
			border: none;
		}
	</style>`;
	openwindow("Nova OSL Runner", cont);
}
function runAsWasm(content) {
	const wasmBytes = new Uint8Array(content);
	const div = document.createElement('div');
	const script = document.createElement('script');
	script.innerHTML = `
		function greenflag() {
			const memory = new WebAssembly.Memory({ initial: 1 });
			const imports = { env: { memory: memory } };

			const wasmCode = new Uint8Array([${Array.from(wasmBytes)}]);
			WebAssembly.instantiate(wasmCode, imports)
				.then(obj => {
					console.log(obj.instance.exports.memory);
					// Additional code to execute the WebAssembly module as needed
				})
				.catch(err => console.error(err));
		}
	`;
	div.appendChild(script);
	openwindow("Nova Wasm Runner", div.innerHTML);
}
async function realgenTaskBar() {
	gid("dock").style.display = "none";
	gid("novanav").style.display = "grid";
	var appbarelement = document.getElementById("dock")
	appbarelement.innerHTML = "<span class='taskbarloader' id='taskbarloaderprime'></span>";
	if (appbarelement) {
		try {
			let dropZone = appbarelement;
			dropZone.addEventListener('dragover', (event) => {
				event.preventDefault();
			});
			dropZone.addEventListener('drop', async (event) => {
				event.preventDefault();
				const unid = event.dataTransfer.getData("Text");
				await moveFileToFolder(unid, "Dock/");
				genTaskBar();
			});
			dropZone.addEventListener('dragend', (event) => {
				event.preventDefault();
			});
			let x = await getFileNamesByFolder("Dock");
			if (Array.isArray(x) && x.length === 0) {
				const y = await getFileNamesByFolder("Apps");
				x = (await Promise.all(
					('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) ?
						y.filter(item =>
							item.name === "Files.app"
						)
						:
						y.filter(item =>
							item.name === "Files.app" ||
							item.name === "Settings.app" ||
							item.name === "Store.app"
						)

				)).filter(Boolean);
			}
			x.forEach(async function (app, index) {
				index++
				var islnk = false;
				var appShortcutDiv = document.createElement("biv");
				appShortcutDiv.setAttribute("draggable", true);
				appShortcutDiv.setAttribute("ondragstart", "dragfl(event, this)");
				appShortcutDiv.setAttribute("unid", app.id || '');
				appShortcutDiv.className = "app-shortcut ctxAvail tooltip adock sizableuielement";

				let lnkappidcatched = app.id;
				if (mtpetxt(app.name) == "lnk") {
					// LNK file usage
					app = await getFileById(app.id)
					let z = JSON.parse(decodeBase64Content(app.content));
					app = await getFileById(z.open);
					if (!app) {
						await remfile(lnkappidcatched);
						say("LNK file removed as real file was deleted.");
						genTaskBar();
						return;
					}
					islnk = true;
				}
				appShortcutDiv.addEventListener("click", () => openfile(app.id));

				var iconSpan = document.createElement("span");
				iconSpan.classList.add("appiconspan");

				var tooltisp = document.createElement("span");
				tooltisp.className = "tooltiptext";
				tooltisp.innerHTML = islnk ? basename(app.name) + `*` : basename(app.name);
				appShortcutDiv.appendChild(iconSpan);
				appShortcutDiv.appendChild(tooltisp);
				appbarelement.appendChild(appShortcutDiv);

				await getAppIcon(0, app.id, 0)
					.then(icon => iconSpan.innerHTML = icon)
					.catch(error => console.error(error));
			});
			gid("dock").style.display = "flex";
		} catch (err) { }
		document.querySelector('#taskbarloaderprime').remove();
	}
}
async function realgenDesktop() {
	let x;
	try {
		gid("desktop").innerHTML = ``;
		let y = await getFileNamesByFolder("Desktop");
		let dropZone = document.getElementById("desktop");
		dropZone.addEventListener('dragover', (event) => {
			event.preventDefault();
		});
		dropZone.addEventListener('drop', async (event) => {
			event.preventDefault();
			const unid = event.dataTransfer.getData("Text");
			await moveFileToFolder(unid, "Desktop/");
			genDesktop()
		});
		dropZone.addEventListener('dragend', (event) => {
			event.preventDefault();
		});
		y.forEach(async function (app) {
			var appShortcutDiv = document.createElement("div");
			appShortcutDiv.className = "app-shortcut ctxAvail sizableuielement";
			appShortcutDiv.setAttribute("unid", app.id || '');
			app = await getFileById(app.id);
			let islnk = false;
			if (mtpetxt(app.fileName) == "lnk") {
				let z = JSON.parse(decodeBase64Content(app.content));
				app = await getFileById(z.open);
				islnk = true;
			}
			appShortcutDiv.setAttribute("draggable", true);
			appShortcutDiv.setAttribute("ondragstart", "dragfl(event, this)");
			appShortcutDiv.addEventListener("click", () => openfile(app.id));
			appShortcutDiv.setAttribute("unid", app.id);
			var iconSpan = document.createElement("span");

			iconSpan.classList.add("appiconspan");
			getAppIcon(app.content, app.id).then((icon) => {
				iconSpan.innerHTML = `${icon}`;
			})
			var nameSpan = document.createElement("span");
			nameSpan.className = "appname";
			nameSpan.textContent = islnk ? basename(app.fileName) + `*` : basename(app.fileName);
			appShortcutDiv.appendChild(iconSpan);
			appShortcutDiv.appendChild(nameSpan);
			gid("desktop").appendChild(appShortcutDiv);
		});
		x = await getSetting("wall");
		if (x != undefined && x != '' && x != ' ') {
			let unshrinkbsfX;
			if (x.startsWith("http")) {
				unshrinkbsfX = x;
			} else {
				unshrinkbsfX = await getFileById(x);
				unshrinkbsfX = unshrinkbsfX.content;
			}
			setbgimagetourl(unshrinkbsfX);
		}
		document.getElementById("bgimage").onerror = async function (event) {
			console.log("wallpaper error", event)
			setbgimagetourl(novaFeaturedImage);
			if (await getSetting("wall")) {
				remSetting("wall");
			}
		};
	} catch (error) {
		console.error(error)
	}

}

async function opensearchpanel(preset = "") {
	gid("seapppreview").style.display = "none";
	if (appsHistory.length > 0) {
		gid("partrecentapps").style.display = "block";
	} else {
		gid("partrecentapps").style.display = "none";
		document.querySelector(".previewsside").style.display = "none";
	}
	if (await getSetting("smartsearch")) {
		gid('searchiconthingy').style = `background: linear-gradient(-34deg, #79afff, #f66eff);opacity: 1; color: white;padding: 0.1rem 0.3rem; margin: 0.3rem; border-radius: 0.5rem;aspect-ratio: 1 / 1;display: grid;cursor: default; margin-right: 0.5rem;box-shadow: 0 0 6px inset #ffffff6b;`
	} else {
		gid('searchiconthingy').style = ``;
	}
	if (window.innerWidth > 500) {
		gid("strtsear").focus()
	}
	if (typeof preset === "string") {
		gid("strtsear").value = preset;
	}

	loadrecentapps();
	displayNotifications();
	gid('searchwindow').showModal();
	prepareArrayToSearch()
}
function mtpetxt(str) {
	if (!str) {
		return;
	}
	try {
		const parts = str.split('.');
		return parts.length > 1 ? parts.pop() : '';
	} catch (err) {
		console.error(err)
	}
}
function closeallwindows() {
	Object.keys(winds).forEach(key => {
		const taskId = key.slice(-12);
		clwin("window" + taskId);
	});
	gid("closeallwinsbtn").checked = true;
}
async function checkifpassright() {
	lethalpasswordtimes = true;
	var trypass = gid("loginform1").value;
	if (await checkPassword(trypass)) {
		gid('loginmod').close();
		password = trypass;
		lethalpasswordtimes = false;
		startup();
	} else {
		gid("loginform1").classList.add("thatsnotrightcls");
		setTimeout(function () {
			gid("loginform1").classList.remove("thatsnotrightcls");
		}, 1000)
	}
	gid("loginform1").value = '';
}
async function logoutofnova() {
	await cleanupram();
	await showloginmod();
	loginscreenbackbtn();
	console.log("logged out of " + CurrentUsername);
	CurrentUsername = null;
}
async function cleanupram() {
	closeallwindows();
	document.querySelectorAll('dialog[open].onramcloseable').forEach(dialog => dialog.close());
	memory = null;
	contentpool = null;
	CurrentUsername = null;
	password = 'nova';
	winds = {};
	MemoryTimeCache = null;
	lethalpasswordtimes = true;
	dbCache = null;
	cryptoKeyCache = null;
}
async function setandinitnewuser() {
	gid("edison").showModal()
	await cleanupram();
	CurrentUsername = await ask("Enter a username:", "");
	await initialiseOS();
	gid('loginmod').close();
}
async function novarefresh() {
	genDesktop();
	genTaskBar();
	cleanupInvalidAssociations();
	checkdmode();
	loadtaskspanel()
	loadrecentapps();
}
function launchbios() {
	document.getElementById('novasetupusernamedisplay').innerText = CurrentUsername;
	document.getElementById('bios').showModal();
}

document.addEventListener("DOMContentLoaded", async function () {
	sysLog("DOM", "Loaded");

	genTaskBar = debounce(realgenTaskBar, 500);
	genDesktop = debounce(realgenDesktop, 500);

	let localupdatedataver = parseFloat(localStorage.getItem("updver"));
	if (localupdatedataver <= 1.7) {
		console.log("Preparing NovaOS2 switch.");
		gid("versionswitcher")?.showModal();
		return;
	}
	const searchInput5342 = document.querySelector('#novamenusearchinp');
	let keyHeld = false;

	searchInput5342.addEventListener('keydown', () => {
		keyHeld = true;
	});

	searchInput5342.addEventListener('keyup', (e) => {
		if (keyHeld) {
			keyHeld = false;
			opensearchpanel(searchInput5342.value);
			gid('appdmod').close();
			searchInput5342.value = "";
		}
	});
	const scriptSources = [
		"scripts/html2canvas.js",
		"scripts/fflate.js",
		"scripts/kernel.js",
		"scripts/rotur.js",
		"scripts/ctxmenu.js",
		"scripts/edgecases.js",
		"scripts/ntx.js",
		"scripts/scripties.js"
	];

	const loadScripts = async () => {
		let prog = 10;
		setsrtpprgbr(prog);
		const increment = 40 / scriptSources.length;

		for (const src of scriptSources) {
			await new Promise((resolve, reject) => {
				const script = document.createElement('script');
				script.src = src;
				script.onload = resolve;
				script.onerror = reject;
				document.body.appendChild(script);
			});
			prog += increment;
			setsrtpprgbr(prog);
		}

		setsrtpprgbr(40);
	};

	await loadScripts();

	setbgimagetourl(novaFeaturedImage);

	gid("nowrunninapps").style.display = "none";
	gid('seprw-openb').onclick = function () {
		gid('searchside').style.flexGrow = 1;
	}

	function startfunctions() {
		registerDecryptWorker();
		try {
			updateBattery();
			navigator.getBattery().then(function (battery) {
				battery.addEventListener('levelchange', updateBattery);
			});
		} catch (e) { }

		makedialogclosable('appdmod');

		// hotkeys
		document.addEventListener('keydown', function (event) {
			if (event.ctrlKey && (event.key === 'f' || event.keyCode === 70)) {
				event.preventDefault();
				openapp('files', 1);
			}
			if (event.ctrlKey && (event.key === 's')) {
				event.preventDefault();
				openapp('settings', 1);
			}
		});
		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape') {
				var appdmod = document.getElementById('appdmod');
				if (appdmod && appdmod.open) {
					appdmod.close();
				}
			}
		});
		document.addEventListener('keydown', function (event) {
			if (event.ctrlKey && event.key === '/') {
				event.preventDefault();
				opensearchpanel();
			}
		});
		document.addEventListener('keydown', function (event) {
			if (event.ctrlKey && event.key === ' ') {
				event.preventDefault();
				openn();
			}
		});


		makedialogclosable('searchwindow');
		prepareArrayToSearch();

		onstartup.push(async () => {
			if (!location.href.startsWith('http://127.0.0.1') && location.origin != 'https://adthoughtsglobal.github.io') {
				say("You are on an <b style='color:red;'>unsafe</b> copy of NovaOS. Do not use this.", "failed");
			}
			edgecases();

			if (detectIE()) {
				issues = `<li><b>HTMLDialogElement Not supported: </b> We have taken some efforts to fix this for you.</li>
				<li><b>Internet explorer detected: </b> i dunno what to say ;-;</li>`;
				say(cantusetext + issues + caniuse2 + `<br><b>Anyway, it is so interesting why you still use explorer.</b>`, "failed");
				badlaunch = true;
			}
		});
	}

	await startfunctions();

	gid("versionswitcher")?.remove();
	gid("novanav").style.display = "none";
	async function waitForNonNull() {
		const startTime = Date.now();
		const maxWaitTime = 3000;
		while (Date.now() - startTime < maxWaitTime) {
			const result = await updateMemoryData();
			if (result !== null) {
				return result;
			}
			await new Promise(resolve => setTimeout(resolve, 100));
		}
		return null;
	}
	waitForNonNull().then(async (result) => {
		checkAndRunFromURL();
		gid('startupterms').innerHTML = "<span>Checking database...</span>";
		try {
			if (result || result == 3) {
				await showloginmod();
			} else {
				await cleanupram();
				CurrentUsername = 'Admin';
				await initialiseOS();
			}
		} catch (error) {
			console.error('Error in database operations:', error);
		}
	});

	var bgImage = document.getElementById("bgimage");
	bgImage.addEventListener("click", function () {
		nowapp = '';
	});
});