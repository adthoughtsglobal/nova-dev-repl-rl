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
            openFile: wrapAsync(openfile)
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
            // getPerms: wrapAsync(getPerms)
        };
        this.sysUI = {
            confirm: wrapAsync(justConfirm),
            dropdown: wrapAsync(showDropdownModal),
            ask: wrapAsync(ask),
            say: wrapAsync(say),
            createWindow: wrapAsync(openwindow)
        };
        this.utility = {
            timeAgo,
            genUID,
            isBase64,
            isElement,
            decodeBase64Content,
            getTime: getfourthdimension,
            getBaseFileType: getbaseflty,
            getBaseName: basename,
            markdownToHTML,
            stringToPastelColor,
            stringToDarkPastelColor,
            toTitleCase,
            getRandomNothingQuote,
            debounce
        }
        this.system = {
            ercache,
            sysLog
        }
    }
}

const ntxWrapper = new NTXSession();
