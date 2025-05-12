class NTXSession {
    constructor() {
        const wrapAsync = (fn) =>
            typeof fn === "function"
                ? Object.assign(
                    async (...args) => await fn(...args),
                    { appIdSupport: fn.appIdSupport }
                )
                : fn;

        this.fileGet = {
            byId: wrapAsync(getFileById),
            nameById: wrapAsync(getFileNameByID),
            detailsById: wrapAsync(findFileDetails),
            byPath: wrapAsync(getFileByPath)
        };
        this.fileSet = {
            createFile: wrapAsync(createFile),
            updateFile: wrapAsync(updateFile),
            removeFile: wrapAsync(remfile),
            moveFile: wrapAsync(moveFileToFolder)
        };
        this.dir = {
            getFolderNames: wrapAsync(getFolderNames),
            remove: wrapAsync(remfolder),
            create: wrapAsync(createFolder)
        };
        this.olp = {
            openFile: wrapAsync(openfile),
            launch: wrapAsync(openlaunchprotocol),
            useHandler: wrapAsync(useHandler)
        };
        this.settings = {
            get: wrapAsync(getSetting),
            set: wrapAsync(setSetting),
            remove: wrapAsync(remSetting),
            resetAll: wrapAsync(resetAllSettings),
            ensurePreferencesFile: wrapAsync(ensureAllSettingsFilesExist)
        };
        this.accounts = {
            removeUser: wrapAsync(removeUser),
            removeInvalidMagicStrings: wrapAsync(removeInvalidMagicStrings),
            changePassword: wrapAsync(checkPassword),
            password: wrapAsync(password),
            getAllUsers: wrapAsync(getallusers),
            username: wrapAsync(CurrentUsername)
        };
        this.apps = {
            getIcon: wrapAsync(getAppIcon),
            // getPerms: wrapAsync(getPerms),
            getHandlers: handlers
        };
        this.sysUI = {
            confirm: wrapAsync(justConfirm),
            dropdown: wrapAsync(showDropdownModal),
            ask: wrapAsync(ask),
            say: wrapAsync(say),
            toast: wrapAsync(toast),
            createWindow: wrapAsync(openwindow),
            clwin: wrapAsync(clwin),
            notify: wrapAsync(notify),
            genDesktop: wrapAsync(genDesktop),
            genTaskBar: wrapAsync(genTaskBar),
            loadtaskspanel: wrapAsync(loadtaskspanel)
        };
        this.utility = {
            timeAgo: timeAgo,
            genUID: genUID,
            isBase64: isBase64,
            isElement: isElement,
            decodeBase64Content: decodeBase64Content,
            getTime: getfourthdimension,
            getBaseFileType: getbaseflty,
            getBaseName: basename,
            markdownToHTML: markdownToHTML,
            getMimeType: getMimeType,
            stringToPastelColor: stringToPastelColor,
            stringToDarkPastelColor: stringToDarkPastelColor,
            toTitleCase: toTitleCase,
            getRandomNothingQuote: getRandomNothingQuote,
            debounce: debounce,
            mtpetxt: mtpetxt,
            calculateSimilarity:calculateSimilarity
        };
        this.system = {
            ercache: ercache,
            cleanupInvalidAssociations: cleanupInvalidAssociations,
            sysLog: sysLog,
            password: password
        };
        this.specific = {
            useNovaOffline: useNovaOffline,
            removeSWs:removeSWs,
            installdefaultapps: installdefaultapps
        }
    }
}

const ntxWrapper = new NTXSession();
const namespaceDetails = {
        fileGet: { risk: 10, description: "to read file data" },
        fileSet: { risk: 40, description: "to modify and manage file data" },
        dir: { risk: 30, description: "to manipulate directories" },
        olp: { risk: 20, description: "to use open apps and use their features" },
        settings: { risk: 35, description: "to read and modify settings" },
        accounts: { risk: 50, description: "to manage user accounts" },
        apps: { risk: 25, description: "to know handlers and perms" },
        sysUI: { risk: 30, description: "to manipulate system UI" },
        utility: { risk: 20, description: "to use various utilities" },
        system: { risk: 80, description: "to interact with high risk system functions" },
        specific: { risk: 90, description: "to trigger specific risky system sequences" }
    };
function describeNamespaces(namespaceKey) {
    if (namespaceDetails[namespaceKey]) {
        return namespaceDetails[namespaceKey].description;
    }
    return null;
}