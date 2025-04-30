gid("mm").innerHTML = `<svg class="mmic" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="22.93098" height="43.31773" viewBox="0,0,22.93098,43.31773"><g transform="translate(-228.53451,-158.34114)"><g data-paper-data="{&quot;isPaintingLayer&quot;:true}" id='novaic' fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="0" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" style="mix-blend-mode: normal"><path d="M228.68924,195.01197l-0.15473,-36.67083l19.03116,29.04225l0.00895,-17.05191l3.55036,-5.02752l0.3405,36.35491c0,0 -18.13437,-29.80707 -18.13437,-29.23736c0,5.15736 -0.30946,16.4013 -0.30946,16.4013z"/></g></g></svg>`;

var defaultAppIcon = `<?xml version="1.0" encoding="UTF-8"?> <svg version="1.1" viewBox="0 0 76.805 112.36" xmlns="http://www.w3.org/2000/svg"> <g transform="translate(-201.6 -123.82)"> <g stroke-dasharray="" stroke-miterlimit="10" style="mix-blend-mode:normal" data-paper-data='{"isPaintingLayer":true}'> <path d="m201.6 236.18v-111.56h49.097l27.707 31.512v80.051z" fill="#3f7ef6" stroke-width="NaN"/> <path d="m250.82 155.02 0.12178-31.202 27.301 31.982z" fill="#054fff" stroke-width="0"/> <path d="m216.73 180.4h46.531" fill="none" stroke="#9dbaff" stroke-linecap="round" stroke-width="7.5"/> <path d="m216.73 194.37h36.44" fill="none" stroke="#9dbaff" stroke-linecap="round" stroke-width="7.5"/> <path d="m216.73 207.78h42.046" fill="none" stroke="#9dbaff" stroke-linecap="round" stroke-width="7.5"/> </g> </g> </svg>`;

var globalmimeDb = null;

function updateNavSize() {
	navheight = parseFloat(getComputedStyle(gid("novanav")).height);
	navheight = navheight + (0.3 * remToPx);
}


// more stuff
function isDark(hexColor) {
	// Remove '#' if present
	hexColor = hexColor.replace('#', '');

	// Convert hex to RGB
	var r = parseInt(hexColor.substring(0, 2), 16);
	var g = parseInt(hexColor.substring(2, 4), 16);
	var b = parseInt(hexColor.substring(4, 6), 16);

	// Calculate luminance
	var luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

	// Return true if luminance is less than or equal to 0.5 (considered dark), false otherwise
	return luminance <= 0.5;
}


function terminal() {
	gid("terminal").showModal()
}

function cuteee() {
	let stylelement = document.createElement('style')
	stylelement.innerHTML = `.windowheader {
	background-color: #121212;
	backdrop-filter: blur(5px) brightness(0.5);
	position: absolute;
	padding: 0.3rem 0.8rem;
	border-radius: 0px 0 0 15px;
	padding-bottom: 0.2rem;
	padding-right: 0.3rem;
	right: 0;
	cursor: drag;
	}
	
	.windowcontent iframe {
    border: none;
    width: 100%;
    height: calc(100% - 0px);
}

.windowcontent {
	box-sizing: border-box;
	height: calc(100% - 0px);
}
`
	document.body.appendChild(stylelement)
}

async function checkAndRunFromURL() {
	const params = new URLSearchParams(window.location.search);

	const run = params.get('run');

	if (run === 'erdbsfull') {
		let x = await justConfirm("Reset all your data?", "The link you opened NovaOS had a param to erase your device. Do this only if its instructed to do so by NovaOS developers.");
		if (x) {
			erdbsfull();
		}
	}

	const filePath = params.get('path');

	if (filePath) {
		console.log(`Opening NovaOS path: ${filePath}`);

		onstartup.push(async () => {
			let fileid = await getFileByPath(filePath);
			openfile(fileid.id);
		});
	}
}
const hardcodedMimeTypes = {
	'html': 'text/html',
	'app': 'text/html',
	'js': 'application/javascript',
	'css': 'text/css',
	'json': 'application/json',
	'jpg': 'image/jpeg',
	'jpeg': 'image/jpeg',
	'webp': 'image/webp',
	'webm': 'image/webm',
	'png': 'image/png',
	'gif': 'image/gif',
	'txt': 'text/plain',
	'pdf': 'application/pdf'
};

async function getMimeType(extension) {
	if (globalmimeDb == null) {
		const mimeDbUrl = 'https://cdn.jsdelivr.net/npm/mime-db@1.52.0/db.json';
		try {
			const responseformimedb = await fetch(mimeDbUrl);
			if (!responseformimedb.ok) throw new Error('Network response was not ok');
			globalmimeDb = await responseformimedb.json();
		} catch (error) {
			return hardcodedMimeTypes[extension] || 'application/octet-stream';
		}
	}
	for (const [key, value] of Object.entries(globalmimeDb)) {
		if (value.extensions && value.extensions.includes(extension)) {
			return key;
		}
	}
	return 'application/octet-stream';
}

function useNovaOffline() {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('sw.js', { scope: '/' })
			.then((registration) => {
				console.log('Service Worker registered with scope:', registration.scope);
			})
			.catch((error) => {
				console.log('Service Worker registration failed:', error);
			});
	}
}

function getReadableTimestamp() {
	const now = new Date();
	const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
	const date = now.toLocaleDateString();
	return `${time} ${date}`;
}

const draggableTimeDiv = document.getElementById('draggable-time');
draggableTimeDiv.addEventListener('dragstart', (e) => {
	e.dataTransfer.setData('text/plain', getReadableTimestamp());
});

async function qsetsRefresh() {
	return await updateMemoryData();
}

async function setuprotur() {
    roturExtension = new RoturExtension();
	if (roturExtension.is_connected) {
		return true;
	}
	await roturExtension.connectToServer({ DESIGNATION: "nva", SYSTEM: "novaOS", VERSION: "2" });
}

async function logoutofrtr() {
	remSetting("roturLink");
	await roturExtension.logout();
	roturExtension.disconnect();
}

// themes
async function checkdmode() {
    if (!novadotcsscache) {
        const response = await fetch('nova.css');
        novadotcsscache = await response.text();
    }
 
	if (CurrentUsername ){
    const themeColors = await getSetting("themeColors") || {};
    applyTheme(themeColors, document);
	}
}

function applyThemeNonVisual(data, doc) {
    applyTheme(data.colors, doc);

    if (data.wallpaper) {
        window.top.makewall(data.wallpaper);
    }

    window.top.setSetting("themeColors", data.colors);
}const appliedThemeVars = new Set();
let themeStyleTag = null;

function applyTheme(colors, doc) {
	console.log(colors)
    if (!themeStyleTag) {
        themeStyleTag = document.createElement('style');
        themeStyleTag.id = "novacsstag";
    }

    if (!document.getElementById("novacsstag")) {
        document.head.appendChild(themeStyleTag);
    }

    if (doc && doc !== document && !doc.getElementById("novacsstag")) {
        doc.head.appendChild(themeStyleTag.cloneNode(true));
    }

    const cssVars = Object.fromEntries(
        [...novadotcsscache.matchAll(/(--[\w-]+):\s*([^;]+)/g)]
            .map(([_, key, value]) => [key, value.trim()])
    );

    const textColor = colors["--colors-text-normal"] ?? cssVars["--colors-text-normal"];
    const textSelectors = [
        "--colors-text-section",
        "--colors-text-sub"
    ];

    let cssText = '';

    for (const variableName in cssVars) {
        let colorValue = colors[variableName] ?? cssVars[variableName];
        if (textSelectors.includes(variableName)) {
            colorValue = textColor;
        }
        cssText += `${variableName}: ${colorValue};\n`;
        appliedThemeVars.add(variableName);
    }

    themeStyleTag.textContent = `:root { ${cssText} }`;

    if (doc && doc !== document) {
        const docStyle = doc.getElementById("novacsstag");
        if (docStyle) docStyle.textContent = themeStyleTag.textContent;
    }
}

function removeTheme() {
    if (themeStyleTag) {
        themeStyleTag.remove();
        themeStyleTag = null;
    }

    appliedThemeVars.clear();
}
