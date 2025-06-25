var dragging = false, remToPx = parseFloat(getComputedStyle(document.documentElement).fontSize), navheight;

var novadotcsscache, transactionLib = [], notificationContext = {};

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


function initializeWindowState(title, appid, params) {
    appsHistory.push(title);
    if (appsHistory.length > 5) {
        appsHistory = appsHistory.slice(-5);
    }

    sysLog(title, `at ${appid}${(params) ? " opened with " + Object.keys(params).length + " params." : ""}`);

    const winuid = genUID();
    if (!winds[winuid]) { winds[winuid] = {}; }
    winds[winuid].title = title;
    winds[winuid].appid = appid;

    return winuid;
}

function createWindowShell(winuid, appid) {
    const windowDiv = document.createElement("div");
    windowDiv.id = "window" + winuid;
    windowDiv.className = "window";
    windowDiv.setAttribute("data-winuid", winuid);
    windowDiv.setAttribute("data-appid", appid);
    windowDiv.style.position = "absolute";

    const windowHeader = document.createElement("div");
    windowHeader.id = "window" + winuid + "header";
    windowHeader.className = "windowheader ctxAvail";

    const windowContent = document.createElement("div");
    windowContent.className = "windowcontent";

    const windowLoader = document.createElement("div");
    windowLoader.className = "windowloader";
    const loaderSpinner = document.createElement("div");
    loaderSpinner.className = "loader33";
    windowLoader.appendChild(loaderSpinner);

    windowContent.appendChild(windowLoader);
    windowDiv.appendChild(windowHeader);
    windowDiv.appendChild(windowContent);

    return { windowDiv, windowHeader, windowContent, windowLoader, loaderSpinner };
}

function populateWindowHeader(header, title, ic, winuid) {
    const dataSpan = document.createElement("div");
    dataSpan.className = "windowdataspan";
    dataSpan.innerHTML = ic != null ? ic : "";

    const titleSpan = document.createElement("div");
    titleSpan.className = "title";
    titleSpan.id = "window" + winuid + "titlespan";
    titleSpan.innerHTML = toTitleCase(basename(title));

    dataSpan.appendChild(titleSpan);
    header.appendChild(dataSpan);
}

function createHeaderControls(winuid, windowDiv) {
    const controlsContainer = document.createElement("div");
    controlsContainer.className = "ibtnsside";

    const isMobile = matchMedia('(pointer: coarse)').matches;

    const createButton = (title, icon, ...classes) => {
        const button = document.createElement("button");
        button.setAttribute("title", title);
        const span = document.createElement("span");
        span.classList.add("material-symbols-rounded", ...classes);
        span.textContent = icon;
        button.appendChild(span);
        return button;
    };

    const closeButton = createButton("Close", "close", "wincl", "winclosebtn");
    closeButton.onclick = () => {
        clwin("window" + winuid);
        loadtaskspanel();
    };

    const minimizeButton = createButton("Minimize", "remove", "wincl", "flbtn");
    minimizeButton.onclick = () => {
        snappingconthide();
        minim(winuid);
    };

    controlsContainer.appendChild(closeButton);

    if (!isMobile) {
        const maximizeButton = createButton("Maximize", "open_in_full", "wincl", "flbtn");
        maximizeButton.querySelector('span').style.fontSize = '0.7rem';
        maximizeButton.onclick = () => {
            snappingconthide();
            flwin(windowDiv);
        };
        controlsContainer.appendChild(maximizeButton);
    }

    controlsContainer.appendChild(minimizeButton);
    return controlsContainer;
}

async function applyWindowAppearance(windowDiv, header, theme, aspectratio) {
    const isMobile = matchMedia('(pointer: coarse)').matches;
    const sizeStyles = !isMobile ? calculateWindowSize(aspectratio) : { left: '0', top: '0', width: 'calc(100% - 0px)', height: 'calc(100% - 58px)' };
    Object.assign(windowDiv.style, sizeStyles);

    let bgColor = await getSetting("WindowBgColor");
    windowDiv.style.background = bgColor || 'transparent';

    if (theme != null) {
        header.style.backgroundColor = theme;
        windowDiv.style.border = `1px solid ${theme}`;
        header.style.color = isDark(theme) ? "white" : "black";
    }
}
function attachDragHandler(windowDiv, header, winuid) {
    header.addEventListener("mousedown", () => {
        putwinontop('window' + winuid);
        winds[winuid].zIndex = windowDiv.style.zIndex;
    });

    dragElement(windowDiv);

    header.addEventListener("mouseup", (event) => {
        let target = event.target;
        while (target) {
            if (target.classList?.contains('wincl')) return;
            target = target.parentElement;
        }
        checksnapping(document.getElementById('window' + winuid), event, winuid);
        snappingconthide();
    });
}

function attachResizeHandlers(windowDiv) {
    const resizers = [
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
        const div = document.createElement("div");
        div.className = resizer.class;
        Object.assign(div.style, {
            position: "absolute",
            width: resizer.width,
            height: resizer.height,
            cursor: resizer.cursor,
            background: "transparent",
            top: resizer.top,
            bottom: resizer.bottom,
            left: resizer.left,
            right: resizer.right
        });
        windowDiv.appendChild(div);

        div.addEventListener("mousedown", (e) => {
            e.preventDefault();
            let startX = e.clientX, startY = e.clientY;
            let startWidth = windowDiv.offsetWidth, startHeight = windowDiv.offsetHeight;
            let startLeft = windowDiv.offsetLeft, startTop = windowDiv.offsetTop;

            const iframeOverlay = document.createElement('div');
            Object.assign(iframeOverlay.style, {
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                zIndex: 999, backgroundColor: 'transparent', cursor: resizer.cursor
            });
            document.body.appendChild(iframeOverlay);

            function resizeMove(ev) {
                let dx = ev.clientX - startX;
                let dy = ev.clientY - startY;

                if (resizer.class.includes("right")) {
                    let newWidth = startWidth + dx;
                    if (newWidth > 50) {
                        windowDiv.style.width = newWidth + "px";
                    }
                }

                if (resizer.class.includes("bottom")) {
                    let newHeight = startHeight + dy;
                    if (newHeight > 50) {
                        windowDiv.style.height = newHeight + "px";
                    }
                }

                if (resizer.class.includes("left")) {
                    let newWidth = startWidth - dx;
                    if (newWidth > 50) {
                        windowDiv.style.width = newWidth + "px";
                        windowDiv.style.left = startLeft + dx + "px";
                    }
                }

                if (resizer.class.includes("top")) {
                    let newHeight = startHeight - dy;
                    if (newHeight > 50) {
                        windowDiv.style.height = newHeight + "px";
                        windowDiv.style.top = startTop + dy + "px";
                    }
                }
            }


            function stopResize(event) {
                document.removeEventListener("mousemove", resizeMove);
                document.removeEventListener("mouseup", stopResize);
                snappingconthide();
                if (iframeOverlay) {
                    document.body.removeChild(iframeOverlay);
                }
                const mouseUpEvent = new MouseEvent('mouseup', { clientX: event.clientX, clientY: event.clientY });
                windowDiv.dispatchEvent(mouseUpEvent);
            }

            document.addEventListener("mousemove", resizeMove);
            document.addEventListener("mouseup", stopResize);
        });
    });
}
async function buildIframeApiBridge(appid, title, winuid, perms) {
    async function checkAndSetPermission(namespace) {
        if (!Array.isArray(perms)) {
            perms = [];
            await setSetting(appid, { perms }, "AppRegistry.json");
        }
        if (perms.includes(namespace)) return true;

        const confirmed = await justConfirm(
            `Allow ${namespace} permission?`,
            `${toTitleCase(basename(title))} asks permission to ${describeNamespaces(namespace)}. Allow it?`
        );
        if (confirmed) {
            perms.push(namespace);
            await setSetting(appid, { perms }, "AppRegistry.json");
            return true;
        }
        return false;
    }

    function sendLargeMessage(target, data, transactionId, chunkSize = 65536) {
        try {
            const json = JSON.stringify(data);
            const totalChunks = Math.ceil(json.length / chunkSize);
            for (let i = 0; i < totalChunks; i++) {
                const chunk = json.slice(i * chunkSize, (i + 1) * chunkSize);
                target.postMessage({
                    transactionId, chunk, chunkIndex: i, totalChunks, isJson: true, success: true
                }, '*');
            }
        } catch (error) {
            console.warn("Failed to send large message:", error);
        }
    }

    async function handleNtxSessionMessage(event) {
        console.log(event.data)
        const { action, params, transactionId } = event.data;
        const contextID = genUID();
        notificationContext[contextID] = {
            appID: appid,
            windowID: winuid
        };
        try {
            const [namespace, method] = action.split(".");
            if (ntxWrapper[namespace]?.[method]) {
                if (!await checkAndSetPermission(namespace)) return;

                const fn = ntxWrapper[namespace][method];
                const args = [...params];
                if (supportsXData(namespace, method)) args.push(contextID);

                const result = await fn(...args);
                sendLargeMessage(event.source, result, transactionId);
            } else {
                throw new Error(`Invalid NTX action: ${action}`);
            }
        } catch (error) {
            console.error("Error handling NTX message:", error);
            event.source.postMessage({ transactionId, error: error.message, success: false }, '*');
        } finally {
            delete transactionLib[transactionId];
        }
    }

    function handleMessage(event) {
        if (!event.data || event.data.iframeId !== winuid) return;

        if (event.data.data === "gfdone") {
            setTimeout(() => {
                const loader = document.querySelector(`#window${CSS.escape(winuid)} .windowloader`);
                if (loader) {
                    console.log("Loader found, removing it.");
                    loader.classList.add("transp5");
                    setTimeout(() => loader.remove(), 500);
                }
            }, 500)
        } else if (event.data.type === "iframeClick") {
            const targetWindow = document.querySelector(`[data-winuid="${winuid}"]`);
            putwinontop("window" + winuid);
            winds[winuid].zIndex = targetWindow.style.zIndex;
        } else if (event.data.transactionId && event.data.action) {
            handleNtxSessionMessage(event);
        } else if (event.data.isEventBus && event.data.type) {
            eventBusWorker.deliver(event.data);
        }
    }

    if (window._messageListeners?.[winuid]) {
        window.removeEventListener("message", window._messageListeners[winuid]);
    }
    window.addEventListener("message", handleMessage);
    if (!window._messageListeners) window._messageListeners = {};
    window._messageListeners[winuid] = handleMessage;
}


async function prepareIframeContent(cont, appid, winuid) {
    let contentString = isBase64(cont) ? decodeBase64Content(cont) : (cont || "<center><h1>Unavailable</h1>App Data cannot be read.</center>");

    let styleBlock = '';
    if (getMetaTagContent(contentString, 'nova-include')?.includes('nova.css')) {
        let updatedCss = novadotcsscache || '';
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

    if (getMetaTagContent(contentString, 'nova-include')?.includes('material-symbols-rounded')) {
        styleBlock += `<style>@font-face{font-family:'Material Symbols Rounded';font-style:normal;src:url(https://adthoughtsglobal.github.io/resources/MaterialSymbolsRounded.woff2) format('woff2');}.material-symbols-rounded{font-family:'Material Symbols Rounded';font-weight:normal;font-style:normal;font-size:24px;line-height:1;display:inline-block;white-space:nowrap;direction:ltr;-webkit-font-smoothing:antialiased;}</style>`;
    }

    const ctxScript = getMetaTagContent(contentString, 'nova-include')?.includes('contextMenu') ? await fetch('scripts/ctxmenu.js').then(res => res.text()) : '';

    const ntxScript = `<script defer>
document.addEventListener('mousedown', () => {
    window.parent.postMessage({ type: 'iframeClick', iframeId: '${winuid}' }, '*');
});

var myWindow = {};

window.addEventListener("message", async e => {
    if (e.data.type === "myWindow") {
        myWindow = {
            ...e.data.data,
            close: () => ntxSession.send("sysUI.clwin", myWindow.windowID),
            setTitle: (e) => ntxSession.send("sysUI.setTitle", myWindow.windowID, e)
        };
        try {
            await greenflag();
        } catch (t) {}
        window.parent.postMessage({ data: "gfdone", iframeId: myWindow.windowID }, "*");
    } else if (e.data?.type === "nova-style" && typeof e.data.css === "string") {
        let styleTag = document.getElementById("novacsstag");
        if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = "novacsstag";
            document.head.appendChild(styleTag);
        }
        styleTag.textContent = e.data.css;
    }
});

class NTXSession {
    constructor() {
        this.transactionIdCounter = 0;
        this.pendingRequests = {};
        this.listeners = {};
        const chunks = {};

        window.addEventListener("message", t => {
            const {
                transactionId: s,
                chunk: n,
                chunkIndex: i,
                totalChunks: o,
                isJson: a,
                success: d,
                error: r,
                type: c,
                payload: l
            } = t.data;

            if (s && typeof d === "boolean") {
                if (a && n !== undefined) {
                    if (!chunks[s]) {
                        chunks[s] = { chunks: [], received: 0, total: o };
                    }
                    chunks[s].chunks[i] = n;
                    chunks[s].received++;
                    if (chunks[s].received === o) {
                        const fullData = chunks[s].chunks.join("");
                        delete chunks[s];
                        const result = JSON.parse(fullData);
                        if (this.pendingRequests[s]) {
                            this.pendingRequests[s].resolve(result);
                            delete this.pendingRequests[s];
                        }
                    }
                } else {
                    if (this.pendingRequests[s]) {
                        d ? this.pendingRequests[s].resolve(t.data.result) : this.pendingRequests[s].reject(r);
                        delete this.pendingRequests[s];
                    }
                }
            } else if (c && l !== undefined && this.listeners[c]) {
                this.listeners[c].forEach(e => e(l));
            }
        });
    }

    generateTransactionId() {
        return \`txn_${Date.now()}_${this.transactionIdCounter++}\`;
    }

    send(action, ...params) {
        return new Promise((resolve, reject) => {
            const txnId = this.generateTransactionId();
            this.pendingRequests[txnId] = { resolve, reject };
            window.parent.postMessage({
                transactionId: txnId,
                action: action,
                params: params,
                iframeId: '${winuid}'
            }, "*");
        });
    }

    eventBus = {
        send: (type, detail) => {
            window.parent.postMessage({
                type: type,
                detail: detail,
                isEventBus: true,
                iframeId: '${winuid}'
            }, "*");
        },
        listen: (type, callback) => {
            if (!this.listeners[type]) {
                this.listeners[type] = [];
            }
            this.listeners[type].push(callback);
        }
    };
}

var ntxSession = new NTXSession();
</script>
`;

    const fullBlobHTML = `<!DOCTYPE html><html><head><meta charset="utf-8">${styleBlock}</head><body>${contentString}${ctxScript ? `<script>${ctxScript}</script>` : ''}${ntxScript}<script defer>window.parent.postMessage({type:"iframeReady",windowID:"${winuid}"}, "*");</script></body></html>`;

    return new Blob([fullBlobHTML], { type: 'text/html' });
}

async function loadIframe(windowContent, windowLoader, loaderSpinner, cont, appid, winuid, title, params) {
    const iconHtml = await getAppIcon(0, appid) || defaultAppIcon;
    loaderSpinner.insertAdjacentHTML('beforebegin', iconHtml);

    let registry = await getSetting(appid, "AppRegistry.json") || { perms: [] };
    const contentBlob = await prepareIframeContent(cont, appid, winuid);
    const blobURL = URL.createObjectURL(contentBlob);

    const iframe = document.createElement("iframe");
    if (!registry.perms?.includes("unsandboxed")) {
        iframe.setAttribute("sandbox", "allow-scripts allow-modals");
        iframe.setAttribute("allow", "camera; microphone");
    }
    iframe.src = blobURL;
    iframe.onload = async () => {
        const myWindowData = { appID: appid, windowID: winuid, eventBusURL, setTitle: "later", ...(params && { params }) };
        iframe.contentWindow.postMessage({ type: "myWindow", data: myWindowData }, "*");
        await buildIframeApiBridge(appid, title, winuid, registry.perms);

        eventBusWorkerE.addEventListener('message', (event) => {
            const { type, detail } = event.data;
            if (type) {
                iframe.contentWindow.postMessage({ type, payload: detail }, '*');
            }
        });
    };

    windowContent.appendChild(iframe);
    iframeReferences[winuid] = iframe.contentWindow;
    if (!winds[winuid]) winds[winuid] = {};
    winds[winuid].src = blobURL;
    winds[winuid].visualState = "free";
}

function finalizeWindow(windowDiv, winuid) {
    document.body.appendChild(windowDiv);

    const zIndexes = Object.values(winds).map(w => Number(w.zIndex) || 0);
    const maxZ = Math.max(0, ...zIndexes);
    windowDiv.style.zIndex = maxZ + 1;

    putwinontop('window' + winuid);
    loadtaskspanel();
}

async function openwindow(title, cont, ic, theme, aspectratio, appid, params) {
    const winuid = initializeWindowState(title, appid, params);

    const { windowDiv, windowHeader, windowContent, windowLoader, loaderSpinner } = createWindowShell(winuid, appid);

    populateWindowHeader(windowHeader, title, ic, winuid);
    const controls = createHeaderControls(winuid, windowDiv);
    windowHeader.appendChild(controls);

    await applyWindowAppearance(windowDiv, windowHeader, theme, aspectratio);

    windowDiv.onclick = () => { nowapp = title; };


    await loadIframe(windowContent, windowLoader, loaderSpinner, cont, appid, winuid, title, params);

    finalizeWindow(windowDiv, winuid);
    attachDragHandler(windowDiv, windowHeader, winuid);
    attachResizeHandlers(windowDiv);
}

function resetWindow(id) {
    const x = document.getElementById("window" + id);
    x.classList.add("snapping");

    const aspectRatio = x.getAttribute("data-aspectratio") || "9/6";
    const sizeStyles = calculateWindowSize(aspectRatio);

    Object.assign(x.style, sizeStyles);
    x.getElementsByClassName("flbtn")[0].innerHTML = "open_in_full";

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
    x.getElementsByClassName("flbtn")[0].innerHTML = "close_fullscreen";

    winds[id]["visualState"] = "fullscreen";

    setTimeout(() => {
        x.classList.remove("snapping");
    }, 1000);
}

function nudgeWindowIntoView(el) {
    const rect = el.getBoundingClientRect();
    const padding = 10;
    let left = el.offsetLeft;
    let top = el.offsetTop;

    let nudged = false;

    if (rect.right > window.innerWidth - padding) {
        left -= (rect.right - window.innerWidth + padding);
        nudged = true;
    }
    if (rect.left < padding) {
        left += (padding - rect.left);
        nudged = true;
    }
    if (rect.bottom > window.innerHeight - padding) {
        top -= (rect.bottom - window.innerHeight + padding);
        nudged = true;
    }
    if (rect.top < padding) {
        top += (padding - rect.top);
        nudged = true;
    }

    if (nudged) {
        el.classList.add("snapping");
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;

        setTimeout(() => {
            el.classList.remove("snapping");
        }, 500);
    }
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

    if (winds[winuid]["visualState"] == "fullscreen" || winds[winuid]["visualState"] == "snapped") {
        resetWindow(winuid);
        return;
    }

    if (logData.cursorY < VHInPixels || (logData.viewportHeight - logData.cursorY) < VHInPixels) {
        maximizeWindow(winuid);
    } else if (logData.cursorX < VWInPixels) {
        x.classList.add("snapping");
        x.style = `left: 0; top: 0; width: calc(50% - 0px); height: calc(100% - ${navheight}px);`;
        x.getElementsByClassName("flbtn")[0].innerHTML = "open_in_full";
        winds[winuid]["visualState"] = "snapped";
        setTimeout(() => {
            x.classList.remove("snapping");
        }, 1000);
    } else if ((logData.viewportWidth - logData.cursorX) < VWInPixels) {
        x.classList.add("snapping");
        x.style = `right: 0; top: 0; width: calc(50% - 0px); height: calc(100% - ${navheight}px);`;
        x.getElementsByClassName("flbtn")[0].innerHTML = "open_in_full";
        winds[winuid]["visualState"] = "snapped";
        setTimeout(() => {
            x.classList.remove("snapping");
        }, 1000);
    } else {
        nudgeWindowIntoView(x);

    }
}
function dragElement(elmnt) {
    var iframeOverlay = null;
    let grabOffsetX = 0;
    let grabOffsetY = 0;
    let holdStart = 0;
    const snappingIndicator = document.getElementById('snappingIndicator');
    const snappingDivs = Array.from(document.querySelectorAll('.snappingDiv'));
    console.log(elmnt.id)
    if (gid(elmnt.id + "header")) {
        console.log(gid(elmnt.id + "header"))
        gid(elmnt.id + "header").onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        if (isInsideIbtnsSide(e.target)) return;
        e.preventDefault();

        holdStart = Date.now();
        grabOffsetX = e.clientX - elmnt.getBoundingClientRect().left;
        grabOffsetY = e.clientY - elmnt.getBoundingClientRect().top;
        elmnt.style.position = 'absolute';

        iframeOverlay = document.createElement('div');
        iframeOverlay.style.position = 'fixed';
        iframeOverlay.style.top = 0;
        iframeOverlay.style.left = 0;
        iframeOverlay.style.width = '100vw';
        iframeOverlay.style.height = '100vh';
        iframeOverlay.style.zIndex = '9999';
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

        if (Date.now() - holdStart >= 500) {
            snappingIndicator.style.opacity = "0.8";
            snappingIndicator.style.display = "block";
        }

        snappingDivs.forEach(div => {
            const rect = div.getBoundingClientRect();
            const isHovered = e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom;
            div.style.opacity = isHovered ? 0.8 : 0.2;
        });
    }

    function closeDragElement(e) {
        document.onmouseup = null;
        document.onmousemove = null;

        if (iframeOverlay) {
            document.body.removeChild(iframeOverlay);
            iframeOverlay = null;
        }

        if (snappingIndicator) {
            snappingIndicator.style.display = "none";
        }

        snappingDivs.forEach(div => {
            div.style.opacity = 0.2;
        });

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

            openwindow(x, y, await getAppIcon(0, od) || defaultAppIcon, getAppTheme(y), getAppAspectRatio(y), od, Gtodo);

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
