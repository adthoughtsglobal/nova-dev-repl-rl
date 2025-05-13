var dragging = false, remToPx = parseFloat(getComputedStyle(document.documentElement).fontSize), navheight;

var novadotcsscache;

async function openlaunchprotocol(appid, data, id, winuid) {
    sysLog("OLP", `Opening "${data}" in "${appid}" for ${winuid || id || 'operation'}`);
    let x = {
        "appid": appid,
        "data": data,
        "winuid": winuid
    };
    Gtodo = x;
    openfile(x.appid, { data: Gtodo });
}

let _olpResolverMap = new Map();

function OLPreturn(data, transferID) {
    if (_olpResolverMap.has(transferID)) {
        const { resolve, timeout } = _olpResolverMap.get(transferID);
        clearTimeout(timeout);
        resolve(data);
        _olpResolverMap.delete(transferID);
    }

    // legacy code
    if (iframeReferences[transferID]) {
        iframeReferences[transferID].postMessage({ returned: data, id: transferID, action: 'loadlocalfile' }, '*');
    }
}

async function useHandler(name, stufftodo) {
    let data = await getSetting('handlers');

    return new Promise((resolve, reject) => {
        const transferID = `${name}-${Date.now()}`;
        const timeout = setTimeout(() => {
            _olpResolverMap.delete(transferID);
            resolve(undefined);
        }, 600000);

        _olpResolverMap.set(transferID, { resolve, timeout });

        openfile(data[name], { data: stufftodo, trid: transferID });
    });
}


const iframeReferences = {};

async function openfile(x, stufftodo) {
    let unid = x;
    try {
        if (!unid) {
            console.error("No app id provided");
            return;
        }

        let mm = await getFileById(unid);
        // mm is the file
        if (!mm) {
            console.error("Error: File not found", unid);
            return;
        }
        // extract type from file extension
        mm.type = ptypext(mm.fileName);

        if (mm.type == "app") {
            // run the app if it is one
            await openapp(mm.fileName, unid, stufftodo);
        } else if (mm.type == "osl") {
            runAsOSL(mm.content)
        } else if (mm.type == "lnk") {
            let z = JSON.parse(decodeBase64Content(mm.content));
            openfile(z.open)
        } else {
            // Not a .lnk file or an .osl file nor an .app file.
            let appIdToOpen = null;
            const fileExtension = mm.fileName.substring(mm.fileName.lastIndexOf('.'));

            if (fileTypeAssociations[fileExtension] && fileTypeAssociations[fileExtension].length > 0) {
                appIdToOpen = fileTypeAssociations[fileExtension][0];
            } else if (fileTypeAssociations['all'] && fileTypeAssociations['all'].length > 0) {
                appIdToOpen = fileTypeAssociations['all'][0];
            }

            if (appIdToOpen) {
                openlaunchprotocol(appIdToOpen, unid);
            } else {
                say("No apps installed can read this file. <br><br>Reinstall apps or 'open with' supporting applications.", "failed")
            }

        }
    } catch (error) {
        console.error(":( Error:", error);
        say("<h1>Unable to open file</h1>File Error: " + error, "failed")
    }
}


function calculateWindowSize(aspectratio) {
    if (!aspectratio) aspectratio = "9/6";
    const [widthFactor, heightFactor] = aspectratio.split('/').map(Number);
    const aspectRatioValue = widthFactor / heightFactor;
    const maxVW = 90, maxVH = 90;

    const maxWidthPx = (window.innerWidth * maxVW) / 100;
    const maxHeightPx = (window.innerHeight * maxVH) / 100;
    let heightPx = (maxHeightPx / 100) * 70;
    let widthPx = heightPx * aspectRatioValue;

    if (widthPx > maxWidthPx) {
        widthPx = maxWidthPx;
        heightPx = widthPx / aspectRatioValue;
    }

    const widthVW = (widthPx / window.innerWidth) * 100;
    const heightVH = (heightPx / window.innerHeight) * 100;

    const offset = 5 * Object.keys(winds).length;
    const left = `calc(50vw - ${widthVW / 2}vw + ${offset}px)`;
    const top = `calc(50vh - ${heightVH / 2}vh + ${offset}px)`;

    return { left, top, width: `${widthVW}vw`, height: `${heightVH}vh` };
}

const snappingDivs = document.querySelectorAll('#snappingIndicator div');

function snappingconthide() {
    let snappingIndicator = document.getElementById('snappingIndicator');
    snappingIndicator.style.transition = "opacity 0.2s";
    snappingIndicator.style.opacity = "0";
    setTimeout(() => {
        snappingIndicator.style.display = "none";
    }, 200);
}


async function openwindow(title, cont, ic, theme, aspectratio, appid, params) {
    appsHistory.push(title);
    if (appsHistory.length > 5) {
        appsHistory = appsHistory.slice(-5);
    }

    sysLog(title, `at ${appid}${(params) ? " opened with " + Object.keys(params).length + " params." : ""}`);

    let winuid = genUID();
    if (!winds[winuid]) { winds[winuid] = {} };
    winds[winuid].title = title;
    winds[winuid].appid = appid;

    var windowDiv = document.createElement("div");
    windowDiv.id = "window" + winuid;
    windowDiv.setAttribute("data-winuid", winuid);
    windowDiv.setAttribute("data-appid", appid);
    windowDiv.style.position = "absolute";

    windowDiv.onclick = function () {
        nowapp = title;
    };

    document.body.appendChild(windowDiv);

    var iframeOverlay = null;

    var resizers = [
        { class: "resizer top-left", cursor: "nwse-resize", width: "10px", height: "10px", top: "-5px", left: "-5px" },
        { class: "resizer top-right", cursor: "nesw-resize", width: "10px", height: "10px", top: "-5px", right: "-5px" },
        { class: "resizer bottom-left", cursor: "nesw-resize", width: "10px", height: "10px", bottom: "-5px", left: "-5px" },
        { class: "resizer bottom-right", cursor: "nwse-resize", width: "10px", height: "10px", bottom: "-5px", right: "-5px" },
        { class: "resizer top", cursor: "ns-resize", width: "100%", height: "5px", top: "-5px" },
        { class: "resizer bottom", cursor: "ns-resize", width: "100%", height: "5px", bottom: "-5px" },
        { class: "resizer left", cursor: "ew-resize", width: "5px", height: "100%", left: "-5px" },
        { class: "resizer right", cursor: "ew-resize", width: "5px", height: "100%", right: "-5px" }
    ];

    resizers.forEach(resizer => {
        var div = document.createElement("div");
        div.className = resizer.class;
        div.style.position = "absolute";
        div.style.width = resizer.width;
        div.style.height = resizer.height;
        div.style.cursor = resizer.cursor;
        div.style.background = "transparent";

        if (resizer.top) div.style.top = resizer.top;
        if (resizer.bottom) div.style.bottom = resizer.bottom;
        if (resizer.left) div.style.left = resizer.left;
        if (resizer.right) div.style.right = resizer.right;

        windowDiv.appendChild(div);

        div.addEventListener("mousedown", function (e) {
            e.preventDefault();
            var startX = e.clientX, startY = e.clientY;
            var startWidth = windowDiv.offsetWidth, startHeight = windowDiv.offsetHeight;
            var startLeft = windowDiv.offsetLeft, startTop = windowDiv.offsetTop;

            iframeOverlay = document.createElement('div');
            iframeOverlay.style.position = 'absolute';
            iframeOverlay.style.top = 0;
            iframeOverlay.style.left = 0;
            iframeOverlay.style.width = '100%';
            iframeOverlay.style.height = '100%';
            iframeOverlay.style.zIndex = 999;
            iframeOverlay.style.backgroundColor = 'transparent';
            iframeOverlay.style.cursor = resizer.cursor;
            document.body.appendChild(iframeOverlay);

            function resizeMove(ev) {
                var dx = ev.clientX - startX;
                var dy = ev.clientY - startY;

                if (resizer.class.includes("right")) windowDiv.style.width = startWidth + dx + "px";
                if (resizer.class.includes("bottom")) windowDiv.style.height = startHeight + dy + "px";
                if (resizer.class.includes("left")) {
                    windowDiv.style.width = startWidth - dx + "px";
                    windowDiv.style.left = startLeft + dx + "px";
                }
                if (resizer.class.includes("top")) {
                    windowDiv.style.height = startHeight - dy + "px";
                    windowDiv.style.top = startTop + dy + "px";
                }
            }

            function stopResize(event) {
                document.removeEventListener("mousemove", resizeMove);
                document.removeEventListener("mouseup", stopResize);

                snappingconthide()
                if (iframeOverlay) {
                    document.body.removeChild(iframeOverlay);
                    iframeOverlay = null;
                }

                const mouseUpEvent = new MouseEvent('mouseup', {
                    clientX: event.clientX,
                    clientY: event.clientY,
                });
                windowDiv.dispatchEvent(mouseUpEvent);
            }

            document.addEventListener("mousemove", resizeMove);
            document.addEventListener("mouseup", stopResize);
        });
    });


    nowapp = title;
    windowDiv.classList += "window";

    const isitmob = matchMedia('(pointer: coarse)').matches;
    const sizeStyles = !isitmob ? calculateWindowSize(aspectratio) : { left: '0', top: '0', width: 'calc(100% - 0px)', height: 'calc(100% - 58px)' };

    Object.assign(windowDiv.style, sizeStyles);

    (async function () {
        let x = await getSetting("WindowBgColor");
        windowDiv.style.background = (x) ? x : 'transparent';
    })();

    var windowHeader = document.createElement("div");
    windowHeader.id = "window" + winuid + "header";
    windowHeader.classList += "windowheader ctxAvail";
    let windowdataspan = document.createElement("div");
    windowdataspan.classList += "windowdataspan";
    windowdataspan.innerHTML = ic != null ? ic : "";
    let windowtitlespan = document.createElement("div");
    windowtitlespan.classList.add("title")
    windowtitlespan.id = "window" + winuid + "titlespan";
    windowtitlespan.innerHTML += toTitleCase(basename(title));
    windowdataspan.appendChild(windowtitlespan);
    windowHeader.appendChild(windowdataspan);

    if (theme != null) {
        windowHeader.style.backgroundColor = theme;
        windowDiv.style.border = `1px solid ` + theme;
        if (isDark(theme)) {
            windowHeader.style.color = "white";
        } else {
            windowHeader.style.color = "black";
        }
    }
    windowHeader.setAttribute("title", title + winuid);
    windowHeader.addEventListener("mouseup", function (event) {
        let target = event.target;
        while (target) {
            if (target.classList && target.classList.contains('wincl')) {
                return;
            }
            target = target.parentElement;
        }
        checksnapping(document.getElementById('window' + winuid), event, winuid);
        snappingconthide();
    });

    windowHeader.addEventListener("mousedown", function (event) {
        putwinontop('window' + winuid);
        winds[winuid].zIndex = windowDiv.style.zIndex;

        let holdStart = Date.now();
        let offsetX = event.clientX - windowDiv.getBoundingClientRect().left;
        let offsetY = event.clientY - windowDiv.getBoundingClientRect().top;

        function onMouseMove(event) {
            if (Date.now() - holdStart >= 500) {
                snappingIndicator.style.opacity = "0.8";
                document.getElementById('snappingIndicator').style.display = "block";
            }

            windowDiv.style.left = event.clientX - offsetX + "px";
            windowDiv.style.top = event.clientY - offsetY + "px";

            snappingDivs.forEach(div => {
                const rect = div.getBoundingClientRect();
                const isHovered =
                    event.clientX >= rect.left &&
                    event.clientX <= rect.right &&
                    event.clientY >= rect.top &&
                    event.clientY <= rect.bottom;

                div.style.opacity = isHovered ? 0.8 : 0.2;
            });
        }

        document.addEventListener("mousemove", onMouseMove);

        document.addEventListener("mouseup", function () {
            document.removeEventListener("mousemove", onMouseMove);
        }, { once: true });
    });


    var ibtnsside = document.createElement("div");
    ibtnsside.classList += "ibtnsside";

    var minimbtn = document.createElement("button");
    minimbtn.setAttribute("title", "Minimize");
    var minimSpan = document.createElement("span");
    minimSpan.classList.add("material-symbols-rounded", "wincl", "flbtn");
    minimSpan.textContent = "remove";
    minimbtn.appendChild(minimSpan);
    minimbtn.onclick = function () {
        snappingconthide();
        minim(winuid);
    };

    var flButton = document.createElement("button");
    flButton.setAttribute("title", "Maximize");
    var flSpan = document.createElement("span");
    flSpan.classList.add("material-symbols-rounded", "wincl", "flbtn");
    flSpan.textContent = "open_in_full";
    flSpan.style = `font-size: 0.7rem !important;`;
    flButton.appendChild(flSpan);
    flButton.onclick = function () {
        snappingconthide();
        flwin(windowDiv);
    };

    var closeButton = document.createElement("button");
    closeButton.setAttribute("title", "Close");
    var closeSpan = document.createElement("span");
    closeSpan.classList.add("material-symbols-rounded", "wincl", "winclosebtn");
    closeSpan.textContent = "close";
    closeButton.appendChild(closeSpan);
    closeButton.onclick = function () {
        clwin("window" + winuid);
        loadtaskspanel();
    };

    ibtnsside.appendChild(closeButton);
    if (!isitmob) {
        ibtnsside.appendChild(flButton);
    }
    ibtnsside.appendChild(minimbtn);

    windowHeader.appendChild(ibtnsside);

    var windowContent = document.createElement("div");
    windowContent.classList += "windowcontent";

    var windowLoader = document.createElement("div");
    windowLoader.classList += "windowloader";
    var loaderdiv = document.createElement("div");
    loaderdiv.classList = "loader33";

    async function loadIframeContent(windowLoader, windowContent, iframe) {
        const content2 = cont;
        let contentString = isBase64(content2) ? decodeBase64Content(content2) : content2;

        if (content2 === undefined) {
            contentString = "<center><h1>Unavailable</h1>App Data cannot be read.</center>";
        }

        if (windowLoader) {
            windowLoader.innerHTML = appicns[appid] || defaultAppIcon;
            windowLoader.appendChild(loaderdiv);
        }

        const computedStyles = getComputedStyle(document.body);
        const variables = {
            '--font-size-small': computedStyles.getPropertyValue('--font-size-small'),
            '--font-size-normal': computedStyles.getPropertyValue('--font-size-normal'),
            '--font-size-big': computedStyles.getPropertyValue('--font-size-big'),
            '--colors-BG-normal': computedStyles.getPropertyValue('--colors-BG-normal'),
            '--colors-BG-sub': computedStyles.getPropertyValue('--colors-BG-sub'),
            '--colors-BG-section': computedStyles.getPropertyValue('--colors-BG-section'),
            '--colors-BG-highlighted': computedStyles.getPropertyValue('--colors-BG-highlighted'),
            '--colors-text-section': computedStyles.getPropertyValue('--colors-text-section'),
            '--colors-text-normal': computedStyles.getPropertyValue('--colors-text-normal'),
            '--colors-text-sub': computedStyles.getPropertyValue('--colors-text-sub'),
            '--colors-text-high': computedStyles.getPropertyValue('--colors-text-high'),
            '--sizing-border-radius': computedStyles.getPropertyValue('--sizing-border-radius'),
            '--sizing-normal': computedStyles.getPropertyValue('--sizing-normal'),
            '--sizing-nano': computedStyles.getPropertyValue('--sizing-nano'),
            '--vw': computedStyles.getPropertyValue('--vw'),
            '--vh': computedStyles.getPropertyValue('--vh'),
            '--font-size-default': computedStyles.getPropertyValue('--font-size-default')
        };

        let styleBlock = '';
        if (contentString.includes("nova-include") && getMetaTagContent(contentString, 'nova-include')?.includes('nova.css')) {
            let updatedCss = novadotcsscache;
            const novaCssTag = document.getElementById('novacsstag');
            if (novaCssTag) {
                const customCss = novaCssTag.textContent;
                const variableRegex = /--([\w-]+)\s*:\s*([^;]+);/g;
                let customVariables = {};
                let match;
                while ((match = variableRegex.exec(customCss)) !== null) {
                    customVariables[`--${match[1]}`] = match[2].trim();
                }
                updatedCss = novadotcsscache.replace(/:root\s*{([^}]*)}/, (match, declarations) => {
                    let updated = declarations.trim();
                    for (const [key, val] of Object.entries(customVariables)) {
                        const regex = new RegExp(`(${key}\\s*:\\s*).*?;`, 'g');
                        updated = updated.replace(regex, `$1${val};`);
                    }
                    return `:root { ${updated} }`;
                });
            }
            styleBlock += `<style>${updatedCss}</style>`;
        }


        if (contentString.includes("nova-include") && getMetaTagContent(contentString, 'nova-include')?.includes('material-symbols-rounded')) {
            styleBlock += `
    <style>
    @font-face {
        font-family: 'Material Symbols Rounded';
        font-style: normal;
        src: url("${location.href}libs/MaterialSymbolsRounded.woff2") format('woff2');
    }
    .material-symbols-rounded {
        font-family: 'Material Symbols Rounded';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        line-height: 1;
        display: inline-block;
        white-space: nowrap;
        direction: ltr;
        -webkit-font-smoothing: antialiased;
    }
    </style>`;
        }

        let ctxScript = '';
        if (contentString.includes("nova-include") && getMetaTagContent(contentString, 'nova-include')?.includes('contextMenu')) {
            ctxScript = await fetch('scripts/ctxmenu.js').then(res => res.text());
        }

        async function handleNtxSessionMessage(event) {
            const message = event.data;

            try {
                const [namespace, method] = message.action.split(".");

                if (ntxWrapper[namespace] && typeof ntxWrapper[namespace][method] === "function") {
                    async function checkAndSetPermission(appid, namespace, title) {
                        let registry = await getSetting(appid, "AppRegistry.json");
                        if (registry == null) {
                            registry = { perms: [] };
                        }

                        let perms = registry.perms;
                        if (!Array.isArray(perms)) {
                            registry.perms = [];
                            await setSetting(appid, registry, "AppRegistry.json");
                            return checkAndSetPermission(appid, namespace, title);
                        }

                        let condition = perms.includes(namespace);
                        if (!condition) {
                            let confirmperm = await justConfirm(
                                "Allow " + namespace + " permission?",
                                toTitleCase(basename(title)) + " asks permission to " + describeNamespaces(namespace) + ". Allow it?"
                            );
                            if (confirmperm) {
                                registry.perms.push(namespace);
                                await setSetting(appid, registry, "AppRegistry.json");
                                return true;
                            } else {
                                return false;
                            }
                        }
                        return true;
                    }
                    const hasPermission = await checkAndSetPermission(appid, namespace, title);
                    if (!hasPermission) return;

                    const fn = ntxWrapper[namespace][method];
                    const args = [...message.params];

                    if (fn.appIdSupport) {
                        args.push(appid);
                    }

                    const result = await fn(...args);

                    event.source.postMessage({
                        transactionId: message.transactionId,
                        result,
                        success: true
                    }, event.origin);
                } else {
                    throw new Error(`Invalid NTX action: ${message.action}`);
                }

            } catch (error) {
                console.error("Error handling NTX message:", error);

                event.source.postMessage({
                    transactionId: message.transactionId,
                    error: error.message,
                    success: false
                }, event.origin);
            }
        }

        const ntxScript = `
    <script defer>
    document.addEventListener('mousedown', function(event) {
        const winuid = myWindow.windowID;
        window.parent.postMessage({ type: 'iframeClick', iframeId: winuid }, '*');
    });

    var myWindow = {};

    window.addEventListener("message", async (event) => {
        if (event.data.type === "myWindow") {
            const data = event.data.data;

            myWindow = {
                ...data,
                close: () => {
                    ntxSession.send("sysUI.clwin", myWindow.windowID);
                },
                eventBusWorker: new Worker(data.eventBusURL)
            };

            let greenflagResult;
            try { greenflagResult = await greenflag() } catch (e) { }
            window.parent.postMessage({ data:"gfdone", iframeId: myWindow.windowID }, "*");
        }
    });

    class NTXSession {
        constructor() {
            this.transactionIdCounter = 0;
            this.pendingRequests = {};
            this.listeners = {};
            window.addEventListener("message", (event) => {
                if (event.data.transactionId && typeof event.data.success === "boolean") {
                    const { transactionId, result, error, success } = event.data;
                    if (this.pendingRequests[transactionId]) {
                        success
                            ? this.pendingRequests[transactionId].resolve(result)
                            : this.pendingRequests[transactionId].reject(error);
                        delete this.pendingRequests[transactionId];
                    }
                }

            });
        }

        generateTransactionId() {
            return \`txn_\${Date.now()}_\${this.transactionIdCounter++}\`;
        }

        send(action, ...params) {
            return new Promise((resolve, reject) => {
                const transactionId = this.generateTransactionId();
                this.pendingRequests[transactionId] = { resolve, reject };
                const winuid = "${winuid}";
                window.parent.postMessage({ transactionId, action, params, iframeId: winuid }, "*");
            });
        }

        eventBus = {
            send: (action, ...params) => {
                return new Promise((resolve, reject) => {
                    const transactionId = this.generateTransactionId();
                    this.pendingRequests[transactionId] = { resolve, reject };
                    window.parent.postMessage({ transactionId, action, params, iframeId: winuid }, "*");
                });
            },

            listen: (type, handler) => {
                if (!this.listeners[type]) {
                    this.listeners[type] = [];
                }
                this.listeners[type].push(handler);
            }
        };
    }

    var ntxSession = new NTXSession();
    </script>
`;

        const fullBlobHTML = `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    ${styleBlock}
    </head>
    <body>
    ${contentString}
    ${ctxScript ? `<script>${ctxScript}</script>` : ''}
    ${ntxScript}
    <script defer>
        window.parent.postMessage({
            type: "iframeReady",
            windowID: "${winuid}",
            element: "${windowDiv.id}",
            titleElement: "${windowtitlespan.id}"
        }, "*");
    </script>
    </body>
    </html>`;

        const blob = new Blob([fullBlobHTML], { type: 'text/html' });
        const blobURL = URL.createObjectURL(blob);

        iframe = document.createElement("iframe");
        // iframe.setAttribute("sandbox", "allow-scripts");
        iframe.src = blobURL;
        windowContent.appendChild(iframe);
        function attachWindowMessageListener(winuidfr) {
            if (!winuidfr) return;

            if (window._messageListeners?.[winuidfr]) {
                window.removeEventListener("message", window._messageListeners[winuidfr]);
            }

            function handleMessage(event) {
                if (!event.data || event.data.iframeId !== winuidfr) return;
                if (event.data.data == "gfdone") {
                    if (windowLoader) {
                        windowLoader.classList.add("transp5");
                        windowLoader.remove()
                    }
                }

                if (event.data.type === "iframeClick") {
                    putwinontop("window" + winuidfr);
                    winds[winuidfr].zIndex = document.querySelector(`[data-winuid="${winuidfr}"]`).style.zIndex;
                } else if (event.data.transactionId && event.data.action) {
                    handleNtxSessionMessage(event);
                }

            }

            window.addEventListener("message", handleMessage);

            if (!window._messageListeners) {
                window._messageListeners = {};
            }
            window._messageListeners[winuidfr] = handleMessage;
        }
        iframeReferences[winuid] = iframe.contentWindow;
        iframe.onload = async () => {
            const tmpmyWindowData = {
                appID: appid,
                windowID: winuid,
                eventBusURL,
                setTitle: "later",
                ...(params && { params })
            };

            iframe.contentWindow.postMessage({
                type: "myWindow",
                data: tmpmyWindowData
            }, "*");

            attachWindowMessageListener(winuid);

            eventBusWorkerE.addEventListener('message', (event) => {
                const { type, detail } = event.data;
                if (!type) return;

                iframe.contentWindow.postMessage({
                    type,
                    payload: detail
                }, '*');
            });

        };

        if (!winds[winuid]) winds[winuid] = {};
        winds[winuid]["src"] = blobURL;
        winds[winuid]["visualState"] = "free";
    }

    nowwindow = 'window' + winuid;
    windowDiv.appendChild(windowLoader);
    windowDiv.appendChild(windowHeader);
    windowDiv.appendChild(windowContent);

    document.body.appendChild(windowDiv);


    const windValues = Object.values(winds).map(wind => Number(wind.zIndex) || 0);
    const maxWindValue = Math.max(...windValues);
    windowDiv.style.zIndex = maxWindValue + 1;

    await loadIframeContent(windowLoader, windowContent);


    dragElement(windowDiv);
    putwinontop('window' + winuid);
    loadtaskspanel();
}
function resetWindow(id) {
    const x = document.getElementById("window" + id);
    x.classList.add("snapping");

    const aspectRatio = x.getAttribute("data-aspectratio") || "9/6";
    const sizeStyles = calculateWindowSize(aspectRatio);

    Object.assign(x.style, sizeStyles);
    x.getElementsByClassName("flbtn")[0].innerHTML = "open_in_full";
    fulsapp = false;

    winds[id]["visualState"] = "free";

    setTimeout(() => {
        x.classList.remove("snapping");
    }, 1000);
}

function maximizeWindow(id) {
    updateNavSize();
    const x = document.getElementById("window" + id);
    x.classList.add("snapping");
    x.style.width = "calc(100% - 0px)";
    x.style.height = "calc(100% - " + navheight + "px)";
    x.style.top = "0";
    x.style.left = "0";
    fulsapp = true;
    x.getElementsByClassName("flbtn")[0].innerHTML = "close_fullscreen";

    winds[id]["visualState"] = "fullscreen";

    setTimeout(() => {
        x.classList.remove("snapping");
    }, 1000);
}

async function checksnapping(x, event, winuid) {
    if (event.target.closest('.ibtnsside')) return;
    updateNavSize();
    const logData = {
        x: x,
        eventType: event.type,
        cursorX: event.clientX,
        cursorY: event.clientY,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        wsnappingSetting: await getSetting("wsnapping"),
        isFullScreen: fulsapp,
    };

    if (!logData.wsnappingSetting) return;

    const VWInPixels = (3 * logData.viewportWidth) / 100;
    const VHInPixels = (3 * logData.viewportHeight) / 100;
    const aspectRatioValue = 9 / 6;
    const maxWidthPx = (logData.viewportWidth * 100) / 100;
    const maxHeightPx = (logData.viewportHeight * 100) / 100;
    let heightPx = (maxHeightPx / 100) * 70;
    let widthPx = heightPx * aspectRatioValue;

    if (widthPx > maxWidthPx) {
        widthPx = maxWidthPx;
        heightPx = widthPx / aspectRatioValue;
    }

    const widthVW = (widthPx / logData.viewportWidth) * 100;
    const heightVH = (heightPx / logData.viewportHeight) * 100;

    logData.VWInPixels = VWInPixels;
    logData.VHInPixels = VHInPixels;
    logData.widthPx = widthPx;
    logData.heightPx = heightPx;
    logData.widthVW = widthVW;
    logData.heightVH = heightVH;

    if (fulsapp) {
        resetWindow(winuid);
        return;
    }

    if (logData.cursorY < VHInPixels || (logData.viewportHeight - logData.cursorY) < VHInPixels) {
        maximizeWindow(winuid);
    } else if (logData.cursorX < VWInPixels) {
        x.classList.add("snapping");
        x.style = `left: 0; top: 0; width: calc(50% - 0px); height: calc(100% - ${navheight}px);`;
        fulsapp = true;
        x.getElementsByClassName("flbtn")[0].innerHTML = "open_in_full";
        winds[winuid]["visualState"] = "snapped";
        setTimeout(() => {
            x.classList.remove("snapping");
        }, 1000);
    } else if ((logData.viewportWidth - logData.cursorX) < VWInPixels) {
        x.classList.add("snapping");
        x.style = `right: 0; top: 0; width: calc(50% - 0px); height: calc(100% - ${navheight}px);`;
        fulsapp = true;
        x.getElementsByClassName("flbtn")[0].innerHTML = "open_in_full";
        winds[winuid]["visualState"] = "snapped";
        setTimeout(() => {
            x.classList.remove("snapping");
        }, 1000);
    }
}
function dragElement(elmnt) {
    var iframeOverlay = null;
    let grabOffsetX = 0;
    let grabOffsetY = 0;

    if (gid(elmnt.id + "header")) {
        gid(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        if (isInsideIbtnsSide(e.target)) return;
        e.preventDefault();

        grabOffsetX = e.clientX - elmnt.getBoundingClientRect().left;
        grabOffsetY = e.clientY - elmnt.getBoundingClientRect().top;

        iframeOverlay = document.createElement('div');
        iframeOverlay.style.position = 'fixed';
        iframeOverlay.style.top = 0;
        iframeOverlay.style.left = 0;
        iframeOverlay.style.width = '100%';
        iframeOverlay.style.height = '100%';
        iframeOverlay.style.zIndex = 999;
        iframeOverlay.style.backgroundColor = 'transparent';
        iframeOverlay.style.cursor = 'grabbing';
        document.body.appendChild(iframeOverlay);

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const elementWidth = elmnt.offsetWidth;
        const elementHeight = elmnt.offsetHeight;

        let targetLeft = e.clientX - grabOffsetX;
        let targetTop = e.clientY - grabOffsetY;

        const repelZone = 100;
        const repelForce = 15;

        if (targetLeft < repelZone) {
            targetLeft += repelForce * ((repelZone - targetLeft) / repelZone);
        } else if (targetLeft + elementWidth > viewportWidth - repelZone) {
            const overlap = (targetLeft + elementWidth) - (viewportWidth - repelZone);
            targetLeft -= repelForce * (overlap / repelZone);
        }

        if (targetTop < repelZone) {
            targetTop += repelForce * ((repelZone - targetTop) / repelZone);
        } else if (targetTop + elementHeight > viewportHeight - repelZone) {
            const overlap = (targetTop + elementHeight) - (viewportHeight - repelZone);
            targetTop -= repelForce * (overlap / repelZone);
        }

        elmnt.style.position = 'absolute';
        elmnt.style.left = `${targetLeft}px`;
        elmnt.style.top = `${targetTop}px`;
    }

    function closeDragElement(e) {
        document.onmouseup = null;
        document.onmousemove = null;

        if (iframeOverlay) {
            document.body.removeChild(iframeOverlay);
            iframeOverlay = null;
        }

        if (gid(elmnt.id + "header")) {
            const mouseUpEvent = new MouseEvent('mouseup', {
                clientX: e.clientX,
                clientY: e.clientY,
            });
            gid(elmnt.id + "header").dispatchEvent(mouseUpEvent);
        }
    }

    function isInsideIbtnsSide(target) {
        while (target) {
            if (target.classList && target.classList.contains('ibtnsside')) {
                return true;
            }
            target = target.parentElement;
        }
        return false;
    }
}

async function openapp(x, od, customtodo) {
    // od is the app id, x is the app name
    if (gid('appdmod').open) {
        gid('appdmod').close()
    }
    if (gid('searchwindow').open) {
        gid('searchwindow').close()
    }

    const fetchDataAndSave = async (x) => {
        try {
            var y;
            if (od == 1) {
                y = await fetchData("appdata/" + x + ".html");
                if (y.startsWith("App Launcher: CRITICAL ERR")) {
                    y = null;
                    await normieprocess();
                    return;
                } else {
                    od = await createFile("Apps/", toTitleCase(x), "app", y);
                }
            } else {
                await normieprocess();
            }
            async function normieprocess() {
                y = await getFileById(od);
                y = y.content;
            }
            if (Gtodo == null && customtodo) {
                Gtodo = customtodo;
            }

            openwindow(x, y, appicns[od] || defaultAppIcon, getAppTheme(y), getAppAspectRatio(y), od, Gtodo);

            Gtodo = null;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    fetchDataAndSave(x);
}

function minim(winuid) {
    const x = gid('window' + winuid);

    if (winds[winuid]["visualState"] === "minimized") {
        x.style.display = "flex";
        winds[winuid]["visualState"] = "free";
    } else {
        if (isWinOnTop('window' + winuid)) {
            x.classList.add("transp4");
            winds[winuid]["visualState"] = "minimized";

            setTimeout(() => {
                x.classList.remove("transp4");
                x.style.display = "none";
                nowapp = '';
            }, 100);
        } else {
            putwinontop('window' + winuid);
        }
    }
}

function flwin(winElement) {
    winElement.classList.add("transp2");
    const winuid = winElement.getAttribute("data-winuid");
    const flbtn = winElement.getElementsByClassName("flbtn")[0];

    const isFree = winds[winuid]["visualState"] != "fullscreen";

    if (isFree) {
        maximizeWindow(winuid);
        flbtn.innerHTML = "close_fullscreen";
    } else {
        resetWindow(winuid);
        flbtn.innerHTML = "open_in_full";
    }

    setTimeout(() => {
        winElement.classList.remove("transp2");
    }, 1000);
}
