var batteryLevel, winds = {}, rp, flwint = true, memory, _nowapp, stx = gid("startuptx"), fulsapp = false, nowappdo, appsHistory = [], nowwindow, appicns = {}, dev = true, appfound = 'files', fileslist = [], qsetscache = {};
var really = false;
var novaFeaturedImage = `https://images.unsplash.com/photo-1716980197262-ce400709bf0d?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`;

gid("nowrunninapps").style.display = "none";

const rllog = console.log;

function qsetsRefresh() {
	try {
		qsetscache =  JSON.parse(localStorage.getItem("qsets"))
	} catch (error) {
		console.log("err:" + error)
	}
}

gid('seprw-openb').onclick = function() {
	gid('searchside').style.flexGrow = 1;
}

Object.defineProperty(window, 'nowapp', {
	get() {
		return _nowapp;
	},
	set(value) {
		_nowapp = value;
		dewallblur()
	}
});

// Check if the database 'trojencat' exists
getdb('trojencat', 'rom')
	.then(async (result) => {
		gid('startupterms').innerHTML += "<span>Checking database...</span>";
		try {
			if (result !== null) {
				memory = result;
				async function fetchDataAndUpdate() {
					let localupdatedataver = localStorage.getItem("updver");
					let fetchupdatedata = await fetch("versions.json");

					if (fetchupdatedata.ok) {
						let fetchupdatedataver = (await fetchupdatedata.json()).osver;

						if (localupdatedataver !== fetchupdatedataver) {
							if (await justConfirm("Update default apps?", "Your default apps are old. Update them to access new features and fixes.")) {
								await installdefaultapps();
							} else {
								say("You can always update app on settings app/Preferances")
							}
						}
					} else {
						console.error("Failed to fetch data from the server.");
					}
				}

				fetchDataAndUpdate();
			} else {
				await say(`<h2>Terms of service and License</h2><p>By using Nova OS, you agree to the <a href="https://github.com/adthoughtsglobal/Nova-OS/blob/main/Adthoughtsglobal%20Nova%20Terms%20of%20use">Adthoughtsglobal Nova Terms of Use</a>. <be><small>We do not collect your personal information. <br>Read the terms clearly before use.</small>`);


				gid("startup").showModal();
				stx.innerHTML = "Preparing memory"
				// If the 'rom' key doesn't exist, assign a random array to the 'memory' list
				memory = [
					// array with all folders
					{
						// folder
						"folderName": "Downloads",
						"content": [
							{
								"fileName": "Welcome",
								"uid": "sibq81",
								"type": "txt",
								"content": "Welcome to Nova OS! Thank you for using this OS, we believe that we have made this 'software' as the most efficient for your daily usage. If not, kindly reach us https://adthoughtsglobal.github.io and connect via the available options, we will respond you back! Enjoy!"
							},
							{
								"fileName": "Basic Help",
								"uid": "y67njs",
								"type": "txt",
								"content": "Please visit the Nova wiki page on GitHub to learn how to use Nova if you seem to struggle using it. You can find it at: https://github.com/adthoughtsglobal/Nova-OS/wiki/"
							}
						]
					},
					{
						"folderName": "Apps",
						"content": []
					},
					{
						"folderName": "Desktop",
						"content": []
					}
				];

				// Save the default array to the 'rom' key in the 'trojencat' database
				setdb('trojencat', 'rom', memory);
				initialiseOS()

			}



		} catch (error) {
			console.error('Error in database operations:', error);
		}


	})
	.then(() => {
		startup()
	})
	.catch((error) => {
		console.error('Error retrieving data from the database:', error);
	});

async function startup() {
	console.log("INITIAL SETUP");
	qsetsRefresh()
	await dod().then(() => {
		gid('startupterms').innerHTML += "<span>Setting up desktop...</span>";
		return updateTime();
	}).then(() => {
		gid('startupterms').innerHTML += "<span>Initialising clock...</span>";
		setInterval(updateTime, 1000);
		return checkdmode();
	}).then(() => {
		gid('startupterms').innerHTML += "<span>Setting themes...</span>";
		return genTaskBar();
	}).then(() => {
		gid('startupterms').innerHTML += "<span>Creating taskbar...</span>";

		closeElementedis()
	}).catch(err => {
		console.error("An error occurred during startup:", err);
	});
}

document.addEventListener("DOMContentLoaded", function() {
	console.log("DOMCL")
	var bgImage = document.getElementById("bgimage");

	bgImage.addEventListener("click", function() {
		console.log("BG CLICK");
		nowapp = '';
		document.title = "Nova OS";
		dewallblur();
	});
});

let timeFormat;
var condition = true;
try {
	let qsets = localStorage.getItem("qsets")
	if (localStorage.getItem("qsets")) {
		condition = JSON.parse(qsets).timefrmt == '24 Hour' ? false : true;
	}
} catch (error) {
	console.log("safe error: " + error)
}

function updateTime() {
	const now = new Date();
	let hours = now.getHours();


	if (condition) {
		// 12-hour format
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = (hours % 12) || 12;
		timeFormat = `${hours}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} ${ampm}`;
	} else {
		// 24-hour format
		timeFormat = `${hours.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
	}

	const date = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`;

	gid('time-display').innerText = timeFormat;
	gid('date-display').innerText = date;
}


const jsonToDataURI = json => `data:application/json,${encodeURIComponent(JSON.stringify(json))}`;

async function openn() {
	gid("appsindeck").innerHTML = `<span class="loader" id="appsloader"></span>`
	gid("strtsear").value = ""
	gid("strtappsugs").style.display = "none";

	let x = await getFileNamesByFolder("Apps");
	x.sort((a, b) => a.name.localeCompare(b.name));
	Promise.all(x.map(async (app) => {
		// Create a div element for the app shortcut
		var appShortcutDiv = document.createElement("div");
		appShortcutDiv.className = "app-shortcut tooltip";
		appShortcutDiv.setAttribute("onclick", "openapp('" + app.name + "', '" + app.id + "')");

		// Create a span element for the app icon
		var iconSpan = document.createElement("span");
		if (!appicns[app.name]) {


			// Fetch the content asynchronously using getFileById
			const content = await getFileById(app.id);

			// Unshrink the content
			const unshrunkContent = unshrinkbsf(content.content);

			// Create a temporary div to parse the content
			const tempElement = document.createElement('div');
			tempElement.innerHTML = unshrunkContent;

			// Get all meta tags
			const metaTags = tempElement.getElementsByTagName('meta');

			// Create an object to store meta tag data
			let metaTagData = null;

			// Iterate through meta tags and extract data
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
			appicns[app.name] = iconSpan.innerHTML

		} else {
			iconSpan.innerHTML = appicns[app.name]
		}

		// Create a span element for the app name
		var nameSpan = document.createElement("span");
		nameSpan.className = "appname";
		nameSpan.textContent = app.name;

		var tooltisp = document.createElement("span");
		tooltisp.className = "tooltiptext";
		tooltisp.textContent = app.name;

		// Append both spans to the app shortcut container
		appShortcutDiv.appendChild(iconSpan);
		appShortcutDiv.appendChild(nameSpan);
		appShortcutDiv.appendChild(tooltisp);

		gid("appsindeck").appendChild(appShortcutDiv);
	})).then(() => {

		// gid('appsloader').remove();
	}).catch((error) => {
		console.error('An error occurred:', error);
	});
	gid('appdmod').showModal()
}

async function loadrecentapps() {
	gid("serrecentapps").innerHTML = ``
	if (appsHistory.length < 1) {
		gid("partrecentapps").style.display = "none";
		return;
	} else {
		gid("partrecentapps").style.display = "block";
	}
	let x = await getFileNamesByFolder("Apps");
	x.reverse()
	Promise.all(x.map(async (app) => {
		if (!appsHistory.includes(app.name)) {
			return
		}
		// Create a div element for the app shortcut
		var appShortcutDiv = document.createElement("div");
		appShortcutDiv.className = "app-shortcut tooltip";
		appShortcutDiv.setAttribute("onclick", "openapp('" + app.name + "', '" + app.id + "')");
		// Create a span element for the app icon
		var iconSpan = document.createElement("span");
		if (!appicns[app.name]) {

			// Fetch the content asynchronously using getFileById
			const content = await getFileById(app.id);

			// Unshrink the content
			const unshrunkContent = unshrinkbsf(content.content);

			// Create a temporary div to parse the content
			const tempElement = document.createElement('div');
			tempElement.innerHTML = unshrunkContent;

			// Get all meta tags
			const metaTags = tempElement.getElementsByTagName('meta');

			// Create an object to store meta tag data
			let metaTagData = null;

			// Iterate through meta tags and extract data
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
			appicns[app.name] = iconSpan.innerHTML

		} else {
			iconSpan.innerHTML = appicns[app.name]
		}

		// Create a span element for the app name
		var nameSpan = document.createElement("span");
		nameSpan.className = "appname";
		nameSpan.textContent = app.name;

		var tooltisp = document.createElement("span");
		tooltisp.className = "tooltiptext";
		tooltisp.textContent = app.name;

		// Append both spans to the app shortcut container
		appShortcutDiv.appendChild(iconSpan);
		appShortcutDiv.appendChild(nameSpan);
		appShortcutDiv.appendChild(tooltisp);

		gid("serrecentapps").appendChild(appShortcutDiv);
	})).then(() => {

		// gid('appsloader').remove();
	}).catch((error) => {
		console.error('An error occurred:', error);
	});
}

function focusFirstElement() {
	var firstElement = document.querySelector('#appsindeck :first-child');
	if (firstElement) {
		firstElement.focus();
	}
}

function makedefic(str) {
	const vowelPattern = /[aeiouAEIOU\s]+/g;
	const consonantPattern = /[^aeiouAEIOU\s]+/g;

	const vowelMatches = str.match(vowelPattern);
	const consonantMatches = str.match(consonantPattern);

	if (consonantMatches && consonantMatches.length >= 2) {
		const firstTwoConsonants = consonantMatches.slice(0, 2);
		const capitalized = firstTwoConsonants.map((letter, index) => index === 0 ? letter.toUpperCase() : letter.toLowerCase());
		const result = capitalized.join('');
		return result.length > 2 ? result.slice(0, 2) : result;
	} else {
		const firstLetter = str.charAt(0).toUpperCase();
		const firstConsonantIndex = str.search(consonantPattern);
		if (firstConsonantIndex !== -1) {
			const firstConsonant = str.charAt(firstConsonantIndex).toLowerCase();
			const result = firstLetter + firstConsonant;
			return result.length > 2 ? result.slice(0, 2) : result;
		} else {
			return firstLetter;
		}
	}
}


function updateBattery() {
	navigator.getBattery().then(function(battery) {
		// Get the battery level
		batteryLevel = Math.floor(battery.level * 100);
		var isCharging = battery.charging;

		if (batteryLevel == 100 && isCharging || batteryLevel == 0 && isCharging) {
			document.getElementById("batterydisdiv").style.display = "none";
		} else {
			document.getElementById("batterydisdiv").style.display = "block";
		}
		// Determine the appropriate icon based on battery level
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

		// Check if the value has changed
		if (iconClass !== gid('battery-display').innerText) {
			// Update the display only if the value changes
			gid('battery-display').innerHTML = iconClass;
			gid('battery-p-display').innerHTML = batteryLevel + "%";
		}
	});
}
updateBattery();

navigator.getBattery().then(function(battery) {
	battery.addEventListener('levelchange', updateBattery);
});

function dragElement(elmnt) {
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
	if (gid(elmnt.id + "header")) {
		// if present, the header is where you move the DIV from:
		gid(elmnt.id + "header").onmousedown = dragMouseDown;
	} else {
		// otherwise, move the DIV from anywhere inside the DIV:
		elmnt.onmousedown = dragMouseDown;
	}

	function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;

		// calculate the new position
		let newTop = elmnt.offsetTop - pos2;
		let newLeft = elmnt.offsetLeft - pos1;

		// get the boundaries of the viewport
		let boundaryTop = 0;
		let boundaryLeft = 0;
		let boundaryBottom = window.innerHeight - elmnt.offsetHeight;
		let boundaryRight = window.innerWidth - elmnt.offsetWidth;

		// set the element's new position, ensuring it stays within the boundaries
		if (newTop < boundaryTop) {
			newTop = boundaryTop;
		}
		if (newTop > boundaryBottom) {
			newTop = boundaryBottom;
		}
		if (newLeft < boundaryLeft) {
			newLeft = boundaryLeft;
		}
		if (newLeft > boundaryRight) {
			newLeft = boundaryRight;
		}

		elmnt.style.top = newTop + "px";
		elmnt.style.left = newLeft + "px";
	}

	function closeDragElement() {
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

async function dod() {
		gid("desktop").innerHTML = ``;
		let y = await getFileNamesByFolder("Desktop")
		y.forEach(async function(app) {
			// Create a div element for the app shortcut
			var appShortcutDiv = document.createElement("div");
			appShortcutDiv.className = "app-shortcut";
			appShortcutDiv.setAttribute("onclick", "openfile(this)");
			appShortcutDiv.setAttribute("unid", app.id);


			// Create a span element for the app icon
			var iconSpan = document.createElement("span");

			// Fetch the content asynchronously using getFileById
			const content = await getFileById(app.id);

			// Unshrink the content
			const unshrunkContent = unshrinkbsf(content.content);

			// Create a temporary div to parse the content
			const tempElement = document.createElement('div');
			tempElement.innerHTML = unshrunkContent;

			// Get all meta tags
			const metaTags = tempElement.getElementsByTagName('meta');

			// Create an object to store meta tag data
			let metaTagData = null;

			// Iterate through meta tags and extract data
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

					iconSpan.innerHTML = `<span class="app-icon">` + makedefic(app.name) + `</span>`;
				}
			} else {
				iconSpan.innerHTML = `<span class="app-icon">` + makedefic(app.name) + `</span>`;
			}



			// Create a span element for the app name
			var nameSpan = document.createElement("span");
			nameSpan.className = "appname";
			nameSpan.textContent = app.name;

			// Append both spans to the app shortcut container
			appShortcutDiv.appendChild(iconSpan);
			appShortcutDiv.appendChild(nameSpan);

			gid("desktop").appendChild(appShortcutDiv);
		});
		let x = localStorage.getItem("qsets");
		try {
			x = await getFileById(JSON.parse(x).wall);
		} catch (error) {
			console.error(error)
			// reset wallpaper setting
			let qsets = JSON.parse(localStorage.getItem("qsets")) || {};
			delete qsets.wall;
			localStorage.setItem("qsets", JSON.stringify(qsets));
		}

		if (x) {
			let unshrinkbsfX = unshrinkbsf(x.content);
			document.getElementById('bgimage').style.backgroundImage = `url("` + unshrinkbsfX + `")`;
		} else {
			gid("bgimage").src = novaFeaturedImage;
			
		}
	document.getElementById("bgimage").onerror = function() {
			document.getElementById("bgimage").src= novaFeaturedImage;
		if (x) {
			let qsets = JSON.parse(localStorage.getItem("qsets")) || {};
			delete qsets.wall;
			localStorage.setItem("qsets", JSON.stringify(qsets));
		}
	};
}

function closeElementedis() {
	var element = document.getElementById("edison");
	element.classList.add("closeEffect");
	setTimeout(function() {
		element.close()
	}, 1000);
}

function isElement(element) {
	return element instanceof Element || element instanceof HTMLDocument;
}

function clwin(x) {

	if (isElement(x)) {
		delete winds[x.getAttribute("data-winds")];
		x.remove();
		return;
	}
	document.getElementById(x).classList.add("transp3")

	setTimeout(() => {
		document.getElementById(x).classList.remove("transp3")
		document.getElementById(x).remove();
		nowapp = '';
		document.title = "Nova OS";
	}, 700);
}

function flwin(x) {
	x.parentElement.parentElement.parentElement.classList.add("transp2")
	if (x.innerHTML == "open_in_full") {
		let oke = x.parentElement.parentElement.parentElement;

		oke.style.left = "0";
		oke.style.top = "0";
		oke.style.width = "calc(100% - 0px)";
		oke.style.height = "calc(100% - 57px)";

		x.innerHTML = "close_fullscreen";
		fulsapp = true;
	} else {
		// minimise window
		let oke = x.parentElement.parentElement.parentElement;

		oke.style.left = "calc(50vw - 33.5vw)";
		oke.style.top = "calc(50vh - 35vh)";
		oke.style.width = "65vw";
		oke.style.height = "70vh";

		nowapp = ""
		dewallblur();
		x.innerHTML = "open_in_full"
		fulsapp = false;
	}
	setTimeout(() => {
		x.parentElement.parentElement.parentElement.classList.remove("transp2")

	}, 1000);
}

function getAppIcon(unshrunkContent, appname) {
	if (!appicns[appname]) {
		console.log("Fetching icon")
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
		if (typeof metaTagData === "string" && containsSmallSVGElement(metaTagData)) {
			appicns[appname] = metaTagData;
			return metaTagData;
		} else {
			return null;
		}

	} else {
		metaTagData = appicns[appname];
	}

}

function getAppTheme(unshrunkContent) {
	const tempElement = document.createElement('div');
	tempElement.innerHTML = unshrunkContent;
	const metaTags = tempElement.getElementsByTagName('meta');
	let metaTagData = null;
	Array.from(metaTags).forEach(tag => {
		const tagName = tag.getAttribute('name');
		const tagContent = tag.getAttribute('content');
		if (tagName === 'theme-color' && tagContent) {
			metaTagData = tagContent;
		}
	});

	return metaTagData;
}

async function openapp(x, od) {

	if (gid('appdmod').open) {
		gid('appdmod').close()
	}
	if (gid('searchwindow').open) {
		gid('searchwindow').close()
	}


	// opening an app
	const fetchDataAndSave = async (x) => {
		try {

			console.log("bob, " + y)
			var y;
			if (od != 1) {
				y = await getFileById(od)
				y = unshrinkbsf(y.content)
			} else {
				y = await fetchData("appdata/" + x + ".html");
				let m = await getFileNamesByFolder("Apps");
				await createFile("Apps", x, "app", y);
			}

			// Assuming you have a predefined function openwindow
			openwindow(x, y, getAppIcon(y, x), getAppTheme(y));
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	// Call fetchDataAndSave with the desired value of x
	fetchDataAndSave(x);
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
function openwindow(title, cont, ic, theme) {
	appsHistory.push(title)
	if (appsHistory.length > 5) {
		appsHistory = appsHistory.slice(-5);
	}

	if (winds.length > 3) {
		notify("Over 100 tabs is open.", "Even if your pc can handle it - this is cringe.")
	}

	content = cont
	if (content == undefined) {
		content = "<center><h1>Unavailable</h1>App Data cannot be read.</center>";
	}

	let winuid = genUID();
	winds[title + winuid] = 1;

	// Create the window element
	var windowDiv = document.createElement("div");
	windowDiv.id = "window" + winuid;
	windowDiv.setAttribute("data-winds", title + winuid);
	windowDiv.onclick = function() {
		nowapp = title;
		dewallblur();
	}
	nowapp = title;
	dewallblur();
	windowDiv.classList += "window";

	let isitmob = window.innerWidth <= 500;

	if (!isitmob) {
		windowDiv.style = 'left: calc(50vw - 33.5vw); top: calc(50vh - 35vh); width: 65vw; height: 70vh; z-index: 0;';

		// Get the computed style of the windowDiv
		let computedStyle = getComputedStyle(windowDiv);

		// Get the current positions calculated by the browser
		let currentLeft = parseFloat(computedStyle.left);
		let currentTop = parseFloat(computedStyle.top);

		// Update the positions
		let newLeft = `calc(50vw - 33.5vw + ${15 * Object.keys(winds).length}px)`;
		let newTop = `calc(50vh - 35vh + ${10 * Object.keys(winds).length}px)`;

		windowDiv.style.left = newLeft;
		windowDiv.style.top = newTop;

	} else {
		windowDiv.style.left = 0;
		windowDiv.style.top = 0;
		windowDiv.style.width = 'calc(100% - 0px)';
		windowDiv.style.height = 'calc(100% - 58px)';
	}

	// Create the window header
	var windowHeader = document.createElement("div");
	windowHeader.id = "window" + winuid + "header"
	windowHeader.classList += "windowheader";
	windowHeader.innerHTML = ic != null ? ic : "";
	windowHeader.innerHTML += toTitleCase(title)
	if (theme != null) {
		windowHeader.style.backgroundColor = theme;
		windowDiv.style.border = `1px solid ` + theme;
		if (isDark(theme)) {
			windowHeader.style.color = "white";
		} else {
			windowHeader.style.color = "black";
		}
	}
	windowHeader.setAttribute("title", title + winuid)
	windowHeader.addEventListener("mouseup", function(event) {
		checksnapping(windowDiv, event);
	});

	windowHeader.addEventListener("mousedown", function(event) {
		putwinontop('window' + winuid);
		winds[title + winuid] = windowDiv.style.zIndex;

	});

	var ibtnsside = document.createElement("div");
	ibtnsside.classList += "ibtnsside"

	var flButton = document.createElement("span");
	flButton.classList.add("material-symbols-rounded", "wincl", "flbtn");
	flButton.style = `    padding: 4px 5px;
    font-size: 8px !important;`;
	flButton.textContent = "open_in_full";
	flButton.onclick = function() {
		flwin(flButton);
	};

	// Create the close button in the header
	var closeButton = document.createElement("span");
	closeButton.classList.add("material-symbols-rounded", "wincl");
	closeButton.textContent = "close";
	closeButton.onclick = function() {
		setTimeout(function() {
			dewallblur();
		}, 500);
		clwin("window" + winuid);
		delete winds[title + winuid];
		loadtaskspanel()
	};

	// Append the close button to the header
	ibtnsside.appendChild(closeButton);
	if (!isitmob) { ibtnsside.appendChild(flButton); }

	windowHeader.appendChild(ibtnsside);

	var windowContent = document.createElement("div");
	windowContent.classList += "windowcontent";

	var windowLoader = document.createElement("div");
	windowLoader.innerHTML = `<span class="loader5653"></span>`
	windowLoader.classList += "windowloader";

	function loadIframeContent(windowLoader, windowContent, iframe) {
		var iframe = document.createElement("iframe");
		var contentString = content.toString();

		iframe.onload = function() {
			iframe.src = "about:blank";
			var doc = iframe.contentDocument || iframe.contentWindow.document;
			doc.innerHTML = null;
			doc.open();
			doc.write(contentString);
			doc.close();
			if (contentString.includes(`function greenflag()`)) {
				attemptGreenFlag(windowLoader, windowContent, iframe);
			} else {
				windowLoader.remove();
			}
		};
		windowContent.appendChild(iframe);
	}

	function attemptGreenFlag(windowLoader, windowContent, iframe) {
		try {
			iframe.contentWindow.myWindow = windowDiv;
			iframe.contentWindow.greenflag();
			windowLoader.style.display = "none";
			windowLoader.remove();
		} catch (error) {
			console.log(error)
			if (!String(error.message).includes('greenflag')) {
				windowLoader.style.display = "none";
				return;
			}

			setTimeout(function() {
				try {
					iframe.contentWindow.greenflag();
					windowLoader.remove();
				} catch (error) {
					if (!String(error.message).includes('greenflag')) {
						windowLoader.style.display = "none";
					}
					console.log('App failed to launch', error);
					windowLoader.innerHTML = "<h2>App Failed to launch</h2><p>Click to retry</p>";
					windowLoader.style.backgroundColor = "rgb(18 18 18)"
					windowLoader.onclick = function() {
						// Remove the previous iframe before retrying
						var oldIframe = document.querySelector("iframe");
						if (oldIframe) oldIframe.remove();
						loadIframeContent(windowLoader, windowContent);
					};
				}
			}, 500);
		}
	}

	nowwindow = 'window' + winuid;
	// Append the header and content to the window
	windowDiv.appendChild(windowHeader);
	windowDiv.appendChild(windowContent);
	windowDiv.appendChild(windowLoader);

	// Append the window to the document body
	document.body.appendChild(windowDiv);
	// Initial load
	loadIframeContent(windowLoader, windowContent);

	dragElement(windowDiv);
	putwinontop('window' + winuid);
	loadtaskspanel();
}

function putwinontop(x) {
	if (Object.keys(winds).length > 1) {
		// Convert the values of winds into an array of numbers
		const windValues = Object.values(winds).map(Number);

		// Calculate the maximum value from the array
		const maxWindValue = Math.max(...windValues);

		// Set the zIndex
		document.getElementById(x).style.zIndex = maxWindValue + 1;
	} else {
		document.getElementById(x).style.zIndex = 0;
	}
}

function toTitleCase(str) {
	rp = str
	return str.toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
		return match.toUpperCase();
	});
}

function openlaunchprotocol(x, y) {
	x = {
		"appname": x,
		"data": y
	}
	localStorage.setItem("todo", JSON.stringify(x))
	openapp(x.appname, 1)
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
	// Get the maximum z-index of all elements
	const elements = document.querySelectorAll('.window');
	let maxZIndex = 0;

	elements.forEach(element => {
		const zIndex = parseInt(window.getComputedStyle(element).zIndex);
		if (zIndex > maxZIndex) {
			maxZIndex = zIndex;
		}
	});
}

function genUID() {
	const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let randomString = '';
	for (let i = 0; i < 6; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		randomString += characters.charAt(randomIndex);
	}
	return randomString;
}

async function createFolder(folderName) {
	try {
		memory = await getdb('trojencat', 'rom');

		// Check if the folder already exists
		const folderIndex = memory.findIndex(folder => folder.folderName === folderName);

		if (folderIndex === -1) {
			// If the folder does not exist, create it
			memory.push({
				folderName,
				content: []
			});
			console.log(`We proudly proclaim that the folder "${folderName}" `);
			setdb('trojencat', 'rom', memory);
		} else {
			console.log(`Folder "${folderName}" says that im not dead! what de hail!`);
		}
	} catch (error) {
		console.error("Error creating folder:", error);
	}
}


async function createFile(folderName, fileName, type, content, metadata) {
	if (metadata === undefined) {
		metadata = { "via": "nope" };
	}
	let memory2 = await getdb('trojencat', 'rom');
	const folderIndex = memory2.findIndex(folder => folder.folderName === folderName);
	try {
		if (type === "app") {
			let appdataquacks = await getFileByPath(folderName + "/" + fileName);
			appdataquacks = appdataquacks[0];
			console.log("idk, Filesbepath:", fileName);

			if (appdataquacks != null) {
				const newData = {
					metadata: metadata,
					content: content,
					fileName: fileName,
					type: type
				};
				await updateFile("Apps", appdataquacks.id, newData);
				return;
			}
		}
		// Check if the folder exists
		if (folderIndex !== -1) {
			// Push the new file object to the folder's content array
			let uid = genUID();
			console.log("The preface of the constitution of the file says that it is " + metadata);
			metadata.datetime = getfourthdimension();
			metadata = JSON.stringify(metadata);

			memory2[folderIndex].content.push({
				fileName,
				uid,
				type,
				content,
				metadata
			});
			console.log(`File "${fileName}" created in folder "${folderName}" for some reason.`);
			setdb('trojencat', 'rom', memory2);
		} else {
			console.log("Creating a folder anyway...");
			await createFolder(folderName);
			// Recursively call createFile after creating the folder
			await createFile(folderName, fileName, type, content, metadata);
		}
	} catch (error) {
		console.error("Error fetching data:", error);
		return null;
	}
}

async function updateFile(folderName, fileId, newData) {
	memory = await getdb('trojencat', 'rom');
	let folderIndex = memory.findIndex(folder => folder.folderName === folderName);

	try {
		if (folderIndex === -1) {
			console.log(`Folder "${folderName}" isnt born yet. guess what...`);
			await createFolder(folderName);
			memory = await getdb('trojencat', 'rom');
			folderIndex = memory.findIndex(folder => folder.folderName === folderName);
		}

		const fileIndex = memory[folderIndex].content.findIndex(file => file.uid === fileId);

		if (fileIndex !== -1) {
			// Update the file with the new data
			let fileToUpdate = memory[folderIndex].content[fileIndex];
			fileToUpdate.metadata = newData.metadata !== undefined ? JSON.stringify(newData.metadata) : fileToUpdate.metadata;
			fileToUpdate.content = newData.content !== undefined ? newData.content : fileToUpdate.content;
			fileToUpdate.fileName = newData.fileName !== undefined ? newData.fileName : fileToUpdate.fileName;
			fileToUpdate.type = newData.type !== undefined ? newData.type : fileToUpdate.type;

			// Update the file in memory
			memory[folderIndex].content[fileIndex] = fileToUpdate;
			setdb('trojencat', 'rom', memory);
			console.log(`File "${fileToUpdate.fileName}" is no more the old file.`);
		} else {
			console.log(`File with ID "${fileId}" is missing lol,  "${folderName}". Gonna make a new one now...`);
			await createFile(folderName, fileId, newData.type, newData.content, newData.metadata);
		}
	} catch (error) {
		console.error("Error updating file:", error);
	}
}

async function getFileById(x) {
	try {
		memory = await getdb('trojencat', 'rom');
		for (const folder of memory) {
			for (const item of folder.content) {
				if (item.uid === x) {
					return item;
				}
			}
		}
		return null;
	} catch (error) {
		console.error("Error fetching data:", error);
		return null;
	}
}
function makedialogclosable(ok) {
	const myDialog = gid(ok);

	document.addEventListener('click', (event) => {
		if (event.target === myDialog) {
			myDialog.close();
		}
	});
}
makedialogclosable('appdmod')

async function getFileNamesByFolder(folderName) {
	try {
		memory = await getdb('trojencat', 'rom');
		const filesInFolder = [];

		for (const folder of memory) {
			if (folder.folderName === folderName) {
				for (const item of folder.content) {
					filesInFolder.push({ id: item.uid, name: item.fileName });
				}
				break;
			}
		}

		return filesInFolder;
	} catch (error) {
		console.error("Error fetching data:", error);
		return null;
	}
}

function justConfirm(title, message, modal) {
	return new Promise((resolve) => {
		if (!modal) {
			modal = document.createElement('dialog');
			modal.classList.add('modal');
			modal.id = "NaviconfDia";
		}

		const modalContent = document.createElement('div');
		modalContent.classList.add('modal-content');
		const bigtitle = document.createElement('h1');
		bigtitle.textContent = title;
		modalContent.appendChild(bigtitle);

		const promptMessage = document.createElement('p');
		promptMessage.innerHTML = message;
		modalContent.appendChild(promptMessage);

		let buttonContainer = modal.querySelector('.button-container');
		if (!buttonContainer) {
			buttonContainer = document.createElement('div');
			buttonContainer.classList.add('button-container');
			buttonContainer.style.display = 'flex';
			modalContent.appendChild(buttonContainer);
		} else {
			buttonContainer.innerHTML = ''; // Clear existing buttons
		}

		const yesButton = document.createElement('button');
		yesButton.textContent = 'Yes';
		yesButton.addEventListener('click', () => {
			modal.close();
			resolve(true);
		});
		buttonContainer.appendChild(yesButton);

		const noButton = document.createElement('button');
		noButton.textContent = 'No';
		noButton.classList += "notbn"
		noButton.addEventListener('click', () => {
			modal.close();
			resolve(false);
		});
		buttonContainer.appendChild(noButton);

		modal.appendChild(modalContent);
		if (!modal.open) {
			document.body.appendChild(modal);
		}
		modal.showModal();
	});
}


function say(message, status) {
	return new Promise((resolve) => {
		const modal = document.createElement('dialog');
		modal.classList.add('modal');

		const modalContent = document.createElement('div');
		modalContent.classList.add('modal-content');

		const promptMessage = document.createElement('p');
		let ic = "warning"
		if (status == "success") {
			ic = "check_circle"
		} else if (status == "warning") {
			ic = "warning"
		} else if (status == "failed") {
			ic = "dangerous"
		}

		ic = `<span class="material-symbols-rounded">` + ic + `</span>`

		promptMessage.innerHTML = ic + message;
		modalContent.appendChild(promptMessage);

		const okButton = document.createElement('button');
		okButton.textContent = 'OK';
		okButton.addEventListener('click', () => {
			modal.close();
			resolve(true);
		});
		modalContent.appendChild(okButton);

		modal.appendChild(modalContent);
		document.body.appendChild(modal);

		modal.showModal();
	});
}

function loadtaskspanel() {

	document.title = "Nova OS > " + nowapp;
	let appbarelement = gid("nowrunninapps")

	appbarelement.innerHTML = ""
	let x = Object.keys(winds).map(key => key.slice(0, -6));
	let wid = Object.keys(winds).map(key => key.slice(-6));

	console.log(x);
	if (x.length == 0) {
		appbarelement.style.display = "none"
	} else {
		appbarelement.style.display = "flex"
	}
	x.forEach(async function(app, index) {
		console.log("she's here: " + app)
		// Create a div element for the app shortcut
		var appShortcutDiv = document.createElement("biv");
		appShortcutDiv.className = "app-shortcut tooltip adock";

		appShortcutDiv.addEventListener("click", function() {
			putwinontop('window' + wid[index]);
			console.log(gid("window" + wid[index]))
			winds[app + wid[index]] = Number(gid("window" + wid[index]).style.zIndex);
		})

		// Create a span element for the app icon
		var iconSpan = document.createElement("span");
		iconSpan.innerHTML = (appicns[app]) ? appicns[app] : defaultAppIcon;

		var tooltisp = document.createElement("span");
		tooltisp.className = "tooltiptext";
		tooltisp.innerHTML = app;

		// Append both spans to the app shortcut container
		appShortcutDiv.appendChild(iconSpan);
		appShortcutDiv.appendChild(tooltisp);

		appbarelement.appendChild(appShortcutDiv);
	})

}

function ask(question, preset) {
	return new Promise((resolve) => {
		const modal = document.createElement('dialog');
		modal.classList.add('modal');

		const modalContent = document.createElement('div');
		modalContent.classList.add('modal-content');

		const promptMessage = document.createElement('p');
		promptMessage.innerHTML = question;
		modalContent.appendChild(promptMessage);

		const inputField = document.createElement('input');
		inputField.setAttribute('type', 'text');
		inputField.value = preset;
		modalContent.appendChild(inputField);

		const okButton = document.createElement('button');
		okButton.textContent = 'OK';
		okButton.addEventListener('click', () => {
			modal.close();
			resolve(inputField.value);
		});
		modalContent.appendChild(okButton);

		modal.appendChild(modalContent);
		document.body.appendChild(modal);

		modal.showModal();
	});
}

var dev;

// Compression
function shrinkbsf(str) {

	const compressed = pako.deflate(str, { to: 'string' });
	return compressed;
}

// Decompression
function unshrinkbsf(compressedStr) {
	try {
		return pako.inflate(compressedStr, { to: 'string' });
	} catch (error) {
		return compressedStr;
	}
}

async function makewall(deid) {
	console.log("the wallpaper lol: " + deid)
	let x = await getFileById(deid);
	x = x.content
	x = unshrinkbsf(x)
	let y = JSON.parse(localStorage.getItem("qsets"))
	y.wall = deid;
	localStorage.setItem("qsets", JSON.stringify(y))
	document.getElementById('bgimage').style.backgroundImage = `url("` + x + `")`;
}

async function remfile(ID) {
	try {
		memory = await getdb('trojencat', 'rom');

		// Iterate through folders to find the file with the specified ID
		for (let folder of memory) {
			let fileIndex = folder.content.findIndex(file => file.uid === ID);

			if (fileIndex !== -1) {
				// Remove the file from the folder's content array
				let removedFile = folder.content.splice(fileIndex, 1)[0];
				console.log(`its an error bro: 0004`);
				await setdb('trojencat', 'rom', memory);

				// Check if the file was successfully removed
				if (!folder.content.includes(removedFile)) {
					console.log("The file have been eliminated.");
				} else {
					console.log("The file resisted elimination somehow.");
				}

				return;
			}
		}

		// If the loop completes without finding the file
		console.error(`File with ID "${ID}" not found.`);
	} catch (error) {
		console.error("Error fetching or updating data:", error);
	}
}

async function remfolder(folderName) {
    try {
        // Fetch the current state of the database
        let memory = await getdb('trojencat', 'rom');

        // Find the index of the folder with the specified name
        const folderIndex = memory.findIndex(folder => folder.folderName === folderName);

        if (folderIndex !== -1) {
            // Remove the folder from the array
            memory.splice(folderIndex, 1);

            // Update the database with the new state
            await setdb('trojencat', 'rom', memory);

            // Check if the folder was successfully removed
            if (!memory.some(folder => folder.folderName === folderName)) {
                console.log("The folder has been eliminated.");
            } else {
                console.log("The folder resisted elimination somehow.");
            }
        } else {
            // If the folder with the specified name is not found
            console.error(`Folder with name "${folderName}" not found.`);
        }
    } catch (error) {
        console.error("Error fetching or updating data:", error);
    }
}

var defAppsList = [
	"camera",
	"clock",
	"files",
	"media",
	"settings",
	"store",
	"text",
	"studio",
	"gallery",
	"wiki",
	"browser",
	"calculator"
];

async function initialiseOS() {
	let x = {
		"focusMode": false,
		"darkMode": false,
		"wsnapping": true,
		"CamImgFormat": "PNG",
		"defFileLayout": "List",
		"timefrmt": "12 Hour",
		"defSearchEngine": "NWP"
	}
	let qsets = JSON.stringify(x);
	localStorage.setItem("qsets", qsets);
	await installdefaultapps().then(async () => {
		let x = await getFileNamesByFolder("Apps")
		if (defAppsList.length != x.length) {
			stx.innerHTML = "Nova is updating..."
			await installdefaultapps().then(() => {
				startup();
			})
		} else {
			startup();
		}
	});
}

async function installdefaultapps() {
	gid("startup").showModal();

	const maxRetries = 3;

	async function updateApp(appName, attempt = 1) {
		try {

			const filePath = "appdata/" + appName + ".html";
			const response = await fetch(filePath);
			if (!response.ok) {
				throw new Error("Failed to fetch file for " + appName);
			}
			const fileContent = await response.text();

			createFile("Apps", appName, "app", fileContent);
			console.log(appName + " has been updated to genZ.");
		} catch (error) {
			console.error("Error updating " + appName + ":", error.message);
			if (attempt < maxRetries) {
				console.log("Retrying update for " + appName + " (attempt " + (attempt + 1) + ")");
				await updateApp(appName, attempt + 1);
			} else {
				console.error("Max retries reached for " + appName + ". Skipping update.");
			}
		}

	}

	// Update each app sequentially
	for (let i = 0; i < defAppsList.length; i++) {
		await updateApp(defAppsList[i]);
		stx.innerHTML = "Installing " + defAppsList[i] + " (" + Math.round((i + 1) / defAppsList.length * 100) + "%)";
	}
	let fetchupdatedata = await fetch("versions.json");

	if (fetchupdatedata.ok) {
		let fetchupdatedataver = (await fetchupdatedata.json()).osver;
		localStorage.setItem("updver", fetchupdatedataver);
	} else {
		console.error("Failed to fetch data from the server.");
	}
	gid("startup").close();
}

async function getFileByPath(filePath) {
	try {
		// Split the filePath into folderName and fileName
		const [folderName, fileName] = filePath.split('/');

		// Fetch data from database
		memory = await getdb('trojencat', 'rom');
		const matchingFiles = [];

		// Iterate through memory to find the specified folder
		for (const folder of memory) {
			if (folder.folderName === folderName) {
				// Iterate through content of the folder to find files with specified name
				for (const item of folder.content) {
					if (item.fileName === fileName) {
						// If found, add the file object to the array
						matchingFiles.push({ id: item.uid, name: item.fileName });
					}
				}
				// No need to break here, as there might be multiple folders with the same name
			}
		}
		// Return the array of matching files
		return matchingFiles;
	} catch (error) {
		console.error("Error fetching data:", error);
		return null;
	}
}


function getfourthdimension() {
	const currentDate = new Date();
	return {
		year: currentDate.getFullYear(),
		month: currentDate.getMonth() + 1,
		day: currentDate.getDate(),
		hour: currentDate.getHours(),
		minute: currentDate.getMinutes(),
		second: currentDate.getSeconds()
	};
}

async function prepareArrayToSearch() {
    let arrayToSearch = [];
    const folderstosearch = await getFolderNames();
    
    for (const [index, item] of folderstosearch.entries()) {
        const x = await getFileNamesByFolder(item);
        arrayToSearch = arrayToSearch.concat(x);
    }
    
    fileslist = arrayToSearch;
}

// Function to handle the search logic
async function strtappse(event) {
    if (fileslist.length === 0) {
        await prepareArrayToSearch();
    }
    
    const searchValue = gid("strtsear").value.toLowerCase();
    if (searchValue.length == 0) {
        return;
    }

    const abracadra = qsetscache.smartsearch;
	console.log(abracadra)
    
    if (event.key === "Enter") {
        event.preventDefault();
        if (searchValue == "i love nova") {
            gid("searchwindow").close();
            notify("hmm", "you're really goofy...", "Nova just replied you:");
            really = true;
        }

        let maxSimilarity = 0.5;
        let appToOpen = null;

        fileslist.forEach(item => {
            const itemName = item.name.toLowerCase();
            if (!abracadra) {
                if (itemName.startsWith(searchValue)) {
                    appToOpen = item;
                    return false;
                }
            } else {
                const similarity = calculateSimilarity(itemName, searchValue);
                if (similarity > maxSimilarity) {
                    maxSimilarity = similarity;
                    appToOpen = item;
                }
            }
        });

        if (appToOpen) {
            openfile(appToOpen.id);
        }
        return;
    }

    gid("strtappsugs").innerHTML = "";
    let elements = 0;
    const itemsWithSimilarity = [];

    fileslist.forEach(item => {
        const itemName = item.name.toLowerCase();
        if (!abracadra) {
            if (itemName.startsWith(searchValue)) {
                itemsWithSimilarity.push({ item, similarity: 1 });
            }
        } else {
            const similarity = calculateSimilarity(itemName, searchValue);
            if (similarity >= 0.2) {
                itemsWithSimilarity.push({ item, similarity });
            }
        }
    });

    itemsWithSimilarity.sort((a, b) => b.similarity - a.similarity);

    let mostRelevantItem;
    itemsWithSimilarity.forEach((entry, index) => {
        const { item } = entry;

        if (index === 0) {
            mostRelevantItem = item;
        }

        const newElement = document.createElement("div");
        newElement.innerHTML = "<div>" + ((appicns[item.name] != undefined) ? appicns[item.name] : defaultAppIcon) + " " + item.name + "</div>" + `<span class="material-icons" onclick="openapp('${item.name}', '${item.id}')">arrow_outward</span>`;
        gid("strtappsugs").appendChild(newElement);
        elements++;
    });

    if (elements > 0) {
        const appfound = mostRelevantItem;
        gid('seprw-icon').innerHTML = (appicns[appfound.name] != undefined) ? appicns[appfound.name] : defaultAppIcon;
        gid('seprw-appname').innerText = appfound.name;
        gid('seprw-openb').onclick = function() {
            openfile(appfound.id);
        };
    }

    gid("strtappsugs").style.display = elements > 0 ? "block" : "none";
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

async function getFolderNames() {
	try {
		memory = await getdb('trojencat', 'rom');
		const folderNames = [];

		for (const folder of memory) {
			folderNames.push(folder.folderName);
		}

		return folderNames;
	} catch (error) {
		console.error("Error fetching data:", error);
		return null;
	}
}

function containsSmallSVGElement(str) {
	var svgRegex = /^<svg\s*[^>]*>[\s\S]*<\/svg>$/i;
	return svgRegex.test(str) && str.length <= 5000;
}

document.onclick = hideMenu;
document.oncontextmenu = rightClick;

function hideMenu() {
	gid("contextMenu").style.display = "none"
}

async function moveFileToFolder(flid, dest) {
	console.log("Moving file id: " + flid + " to folder: " + dest);

	let fileToMove = await getFileById(flid);
	console.log("Got them: " + JSON.stringify(fileToMove));

	await createFile(dest, fileToMove.fileName, fileToMove.type, fileToMove.content, fileToMove.metadata);
	console.log("File born in folder: " + dest);

	console.log("Eliminating file: " + flid);
	await remfile(flid);
	console.log("File eleminated successfully");
}

async function remfile(ID) {
	try {
		memory = await getdb('trojencat', 'rom');

		for (let folder of memory) {
			let fileIndex = folder.content.findIndex(file => file.uid === ID);

			if (fileIndex !== -1) {
				let removedFile = folder.content.splice(fileIndex, 1)[0];
				console.log(`0004`);
				await setdb('trojencat', 'rom', memory);

				if (!folder.content.includes(removedFile)) {
					console.log("File successfully eleminated.");
				} else {
					console.log("File proved resistance.");
				}
				return;
			}
		}

		// If the loop completes without finding the file
		console.error(`File with ID "${ID}" not found.`);
	} catch (error) {
		console.error("Safe Error fetching or updating data:", error);
	}
}

function rightClick(e) {
	e.preventDefault();

	console.log(e.target.closest('.hitbox'));

	if (gid(
		"contextMenu").style.display == "block")
		hideMenu();
	else {
		var menu = document
			.getElementById("contextMenu")

		menu.style.display = 'block';
		menu.style.left = e.pageX + "px";
		menu.style.top = e.pageY + "px";
	}
}

var dash = gid("dashboard");

function dashtoggle() {

	if (dash.open) {
		dash.close();
	} else {
		dash.showModal();
	}
}

document.addEventListener('click', (event) => {
	if (event.target === dash) {
		dash.close();
	}
});


async function openfile(x, rt) {
	try {
		let unid;
		if (x instanceof Element || (x.nodeType && x.nodeType === 1)) {
			unid = x.getAttribute("unid");
		} else {
			unid = x;
		}

		if (!unid) {
			console.error("Error: 'unid' attribute not found");
			return;
		}

		let mm = await getFileById(unid);
		if (!mm) {
			console.error("Error: File not found");
			return;
		}

		let realtype = mm.type;
		if (mm.type == "app") {
			await openapp(mm.fileName, unid);
		} else if (mm.type.startsWith("image") || mm.type.startsWith("audio") || mm.type.startsWith("video")) {
			openlaunchprotocol("media", { "lclfile": unid });
		} else {
			if ((realtype == "app" || realtype.startsWith("image") || realtype.startsWith("video") || realtype.startsWith("audio")) && !rt) {

				// if it's compressed
				openlaunchprotocol("text", { "lclfile": unid, "shrinkray": true });
			} else if (mm.type.startsWith("text/html")) {
				openlaunchprotocol("studio", { "lclfile": unid });
			} else if (mm.type.startsWith("osl")) {
				runAsOSL(mm.content)
			} else if (mm.type.startsWith("lnk")) {
				console.log("lnk")
				let z = JSON.parse(mm.content);
				openfile(z.open)
			} else if (mm.type.startsWith("wasm")) {
				runAsWasm(mm.content)
			} else {
				openlaunchprotocol("text", { "lclfile": unid });
			}
		}
	} catch (error) {
		console.error(":( Error:", error);
		say("<h1>Unable to open file</h1>File Error: " + error, "failed")
	}
}

function dewallblur() {
	let f = localStorage.getItem("qsets");
	if (f) {
		f = JSON.parse(f); // Assuming it's JSON data
		if (f.focusMode) { } else {
			gid("bgimage").style.filter = "blur(0px)";
			return;
		}
	} else {
		// qsets is not defined in localStorage
		return;
	}
	console.log("dewallblur: " + nowapp)
	if (nowapp != "" && nowapp != undefined) {
		gid("bgimage").style.filter = "blur(5px)";
	} else {
		gid("bgimage").style.filter = "blur(0px)";
	}
}

function checksnapping(x, event) {
	let f = localStorage.getItem("qsets");
	if (f) {
		f = JSON.parse(f); // Assuming it's JSON data
		if (!f.wsnapping) {
			return;
		}
	}
	var cursorX = event.clientX;
	var cursorY = event.clientY;

	var viewportWidthInPixels = window.innerWidth;
	var viewportHeightInPixels = window.innerHeight;

	var VWInPixels = (3 * viewportWidthInPixels) / 100;
	var VHInPixels = (3 * viewportHeightInPixels) / 100;

	if (fulsapp) {
		x.classList.add("transp2");
		x.getElementsByClassName("flbtn")[0].innerHTML = "open_in_full";
		x.style = 'left: calc(50vw - 33.5vw); top: calc(50vh - 35vh); width: 65vw; height: 70vh; z-index: 0;';
		fulsapp = false;
		setTimeout(() => {
			x.classList.remove("transp2");
		}, 1000);
	}

	if (cursorY < VHInPixels || (viewportHeightInPixels - cursorY) < VHInPixels) {
		x.classList.add("transp2");
		x.style = "left: 3px; top: 3px; width: calc(100% - 7px); height: calc(100% - 63px);";
		fulsapp = true;
		x.getElementsByClassName("flbtn")[0].innerHTML = "close_fullscreen";
		setTimeout(() => {
			x.classList.remove("transp2");
		}, 1000);
	}

	// left
	if (cursorX < VWInPixels) {
		x.classList.add("transp2");
		x.style = "left: 3px; top: 3px; width: calc(50% - 5px); height: calc(100% - 63px);";
		fulsapp = true;
		x.getElementsByClassName("flbtn")[0].innerHTML = "open_in_full";
		setTimeout(() => {
			x.classList.remove("transp2");
		}, 1000);
	}

	// right
	if ((viewportWidthInPixels - cursorX) < VWInPixels) {
		x.classList.add("transp2");
		x.style = "right: 3px; top: 3px; width: calc(50% - 5px); height: calc(100% - 63px);";
		fulsapp = true;
		x.getElementsByClassName("flbtn")[0].innerHTML = "open_in_full";
		setTimeout(() => {
			x.classList.remove("transp2");
		}, 1000);
	}
}

let countdown, countdown2;
var sleepQuotes = [
	"A quick nap is all you need.",
	"Sweet dreams",
	"Just let it dissolve.",
	"You are empty",
	"Nothing disturbs you",
	"Stay Calm",
	"Breath In",
	"Breath out",
	"Slowly relax your body"
]

function startTimer(minutes) {
	document.getElementById("sleepbtns").style.display = "none";
	clearInterval(countdown);
	clearInterval(countdown2);
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
	countdown2 = setInterval(() => {
		const randomIndex = Math.floor(Math.random() * sleepQuotes.length);

		gid("sleepquote").innerHTML = sleepQuotes[randomIndex];
	}, 3000);
}

function playBeeps() {
	const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

	for (let i = 0; i < 6; i++) {
		const oscillator = audioCtx.createOscillator();
		oscillator.type = 'sine';
		oscillator.frequency.value = 1000;
		oscillator.connect(audioCtx.destination);

		setTimeout(() => {
			oscillator.start();
			setTimeout(() => oscillator.stop(), 100);
		}, i * 200);
	}
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


function notify(title, description, appname) {
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
		const windValues = Object.values(winds).map(Number);

		// Calculate the maximum value from the array
		const maxWindValue = Math.max(...windValues);

		// Set the zIndex
		document.getElementById("notification").style.zIndex = maxWindValue + 1;
		document.getElementById("notification").style.display = "block";
		setTimeout(function() {
			document.getElementById("notification").style.display = "none";
		}, 5000);
	} else {
		console.error("One or more DOM elements not found.");
	}
}

function runAsOSL(content) {
	const encodedContent = encodeURIComponent(content).replace(/'/g, "%27").replace(/"/g, "%22");
	const cont = `<iframe class="oslframe" src="https://origin.mistium.com/Versions/originv4.9.2.html?embed=${encodedContent}"></iframe>
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
	console.log("2321: " + div.innerHTML);
	openwindow("Nova Wasm Runner", div.innerHTML);
}


// hotkeys
document.addEventListener('keydown', function(event) {
	if (event.ctrlKey && (event.key === 'f' || event.keyCode === 70)) {
		event.preventDefault();
		openapp('files', 1);
	}
});


document.addEventListener('keydown', function(event) {
	if (event.key === 'Escape') {
		var appdmod = document.getElementById('appdmod');
		if (appdmod && appdmod.open) {
			appdmod.close();
		}
	}
});

document.addEventListener('keydown', function(event) {
	if (event.shiftKey && event.key === 'Tab') {
		event.preventDefault();
		openn();
	}
});


async function genTaskBar() {
	var appbarelement = document.getElementById("dock")
	appbarelement.innerHTML = ""
	if (appbarelement) {
		let x = await getFileNamesByFolder("Dock");
		console.log(x)
		if (x.length == 0) {
			let y = await getFileNamesByFolder("Apps");

			x = await Promise.all(y.map(async (item) => {
				if (item.name === "files" || item.name === "settings" || item.name === "store") {
					console.log(`Found ${item.name}`);
					return item;
				}
			}));

			x = x.filter(item => item);
		}
		console.log(x)
		x.forEach(async function(app) {
			var islnk = false;
			// Create a div element for the app shortcut
			var appShortcutDiv = document.createElement("biv");
			appShortcutDiv.className = "app-shortcut tooltip adock";
			app = await getFileById(app.id)

			if (app.type == "lnk") {
				let z = JSON.parse(app.content);
				 console.log("oogabooga", z)
				app = await getFileById(z.open)
				islnk = true;
			}

			console.log("after: " + app.uid);
			appShortcutDiv.setAttribute("onclick", "openfile('" + app.uid + "')");
			// Create a span element for the app icon
			var iconSpan = document.createElement("span");

			// Fetch the content asynchronously using getFileById
			const content = app;

			// Unshrink the content
			const unshrunkContent = unshrinkbsf(content.content);

			// Create a temporary div to parse the content
			const tempElement = document.createElement('div');
			tempElement.innerHTML = unshrunkContent;

			// Get all meta tags
			const metaTags = tempElement.getElementsByTagName('meta');

			// Create an object to store meta tag data
			let metaTagData = null;

			// Iterate through meta tags and extract data
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


			var tooltisp = document.createElement("span");
			tooltisp.className = "tooltiptext";
			tooltisp.innerHTML = islnk ? app.fileName + `*` : app.fileName;

			// Append both spans to the app shortcut container
			appShortcutDiv.appendChild(iconSpan);
			appShortcutDiv.appendChild(tooltisp);

			appbarelement.appendChild(appShortcutDiv);
		})
	}
}

makedialogclosable('searchwindow');
prepareArrayToSearch()
function opensearchpanel() {
	gid('searchwindow').showModal() 
	if (qsetscache.smartsearch) {
		gid('searchiconthingy').style = `background: linear-gradient(-34deg, #79afff, #f66eff);opacity: 1; color: white;padding: 0.1rem 0.3rem; margin: 0.3rem; border-radius: 0.5rem;aspect-ratio: 1 / 1;display: grid;cursor: default; margin-right: 0.5rem;box-shadow: 0 0 6px inset #ffffff6b;`
	} else {
		gid('searchiconthingy').style = ``;
	}
	if (window.innerWidth > 500) {
		gid("strtsear").focus()
	}
	loadrecentapps()
}