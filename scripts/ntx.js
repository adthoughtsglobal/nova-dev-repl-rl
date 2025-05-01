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
        this.ctntMgr = ctntMgr;
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
            createWindow: wrapAsync(openwindow),
            clwin: wrapAsync(clwin),
            notify: wrapAsync(notify)
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
            mtpetxt: mtpetxt
        };
        this.system = {
            ercache: ercache,
            sysLog: sysLog
        };
    }
}

const ntxWrapper = new NTXSession();

function describeNamespaces(namespaceKey) {
    const descriptions = {
        fileGet: "to read file data",
        fileSet: "to modify and manage file data",
        dir: "to manipulate directories",
        olp: "to use handlers and open apps",
        ctntMgr: "to manage raw file contents",
        settings: "to read and modify settings",
        accounts: "to manage user accounts",
        apps: "to know handlers and perms",
        sysUI: "to manipulate system UI",
        utility: "to use various utilities",
        system: "to interact with high risk system functions"
    };

    return descriptions[namespaceKey] || "to " + namespaceKey;
}