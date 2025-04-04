class NTXSession {
    constructor() {
        const wrapAsync = (fn) =>
            typeof fn === "function" ? async (...args) => await fn(...args) : fn;

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
            launch: wrapAsync(openlaunchprotocol)
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
            getHandlers: function() {
                return fileTypeAssociations;
            }
        };
        this.sysUI = {
            confirm: wrapAsync(justConfirm),
            dropdown: wrapAsync(showDropdownModal),
            ask: wrapAsync(ask),
            say: wrapAsync(say),
            createWindow: wrapAsync(openwindow)
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
            mtpetxt:mtpetxt
        };
        this.system = {
            ercache: ercache,
            sysLog: sysLog
        };
    }
}

const ntxWrapper = new NTXSession();
