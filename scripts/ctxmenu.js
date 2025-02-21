window.fileActions = {
	open: {
		icon: 'open_in_new',
		label: 'Open',
		action: (itemuid) => openfile(itemuid),
		condition: (file) => true,
	},
	delete: {
		icon: 'delete',
		label: 'Delete',
		action: (itemuid) => remfile(itemuid),
		condition: (file) => true,
	},
	rename: {
		icon: 'save_as',
		label: 'Rename',
		action: async (itemuid) => {
			let file = await getFileById(itemuid);
			file.fileName = await ask("New Name:", file.fileName);
			await updateFile(false, itemuid, file);
		},
		condition: () => true,
	},
	openLocation: {
		icon: 'files',
		label: 'Open file location',
		action: async (itemuid) => {
			let currentreqID = genUID();
			let appIdToOpen = fileTypeAssociations['file'][0] || null;
			openlaunchprotocol(appIdToOpen, { "opener": 'showFile', "id":itemuid }, currentreqID);
		},
		condition: () => true,
	},
	reinstall: {
		icon: 'download',
		label: 'Reinstall',
		action: (itemuid) => extractAndRegisterCapabilities(itemuid),
		condition: (file) => mtpetxt(file.fileName) === 'app',
	},
	setWallpaper: {
		icon: 'wallpaper',
		label: 'Set As Wallpaper',
		action: (itemuid) => makewall(itemuid),
		condition: (file) => getbaseflty(ptypext(file.fileName)) === 'image',
	},
	move: {
		icon: 'drive_file_move',
		label: 'Move',
		action: (itemuid) => movefile(itemuid),
		condition: (file) => true,
	},
	copyId: {
		icon: 'content_copy',
		label: 'Copy ID',
		action: (itemuid) => navigator.clipboard.writeText(itemuid),
		condition: (file) => true,
	},
	createShortcut: {
		icon: 'add',
		label: 'Shortcut',
		action: (itemuid) => addShortcut(itemuid),
		condition: (file) => true,
	},
};

async function getMenuItems(target) {
	if (target.classList.contains('app-shortcut') || target.classList.contains('file')) {
		const itemuid = target.getAttribute("unid");
		let fileNameRec = await getFileNameByID(itemuid);
		const file = { unid: itemuid, type: 'app', fileName: fileNameRec };
		return Object.values(window.fileActions)
			.filter(action => action.condition(file))
			.map(action => ({
				icon: action.icon,
				label: action.label,
				action: () => action.action(itemuid),
			}));
	}
	if (target.id === 'desktop') {
		return [
			{ icon: 'refresh', label: 'Refresh homescreen', action: () => novarefresh() },
			{ icon: 'power', label: 'Nova setup', action: () => launchbios() },
		];
	}
	return [
		{ label: 'Inspect', action: () => console.log('Inspect clicked') },
	];
}

var contextMenu;


function createContextMenu(event) {
	if (!contextMenu) {
		contextMenu = document.createElement('div');
		contextMenu.style.position = 'absolute';
		contextMenu.style.display = 'none';
		contextMenu.classList.add("contextmenu");
	}

	const dialog = event.target.closest('dialog');

	if (dialog && contextMenu.parentNode !== dialog) {
		dialog.appendChild(contextMenu);
	} else if (!dialog && contextMenu.parentNode !== document.body) {
		document.body.appendChild(contextMenu);
	}

	return contextMenu;
}


function createDropdownMenu(items) {
	const dropdownMenu = document.createElement('div');
	dropdownMenu.classList.add('contextmenu');
	dropdownMenu.style.position = 'absolute';
	dropdownMenu.style.display = 'none';
	dropdownMenu.style.zIndex = '1000';

	items.forEach(item => {
		const menuItem = document.createElement('div');
		menuItem.innerHTML = `<span class="material-symbols-rounded">${item.icon || ""}</span>
        <span>${item.label}</span>`;
		menuItem.classList.add('ctxmenuitem');
		menuItem.style.padding = '5px 10px';
		menuItem.style.cursor = 'pointer';
		menuItem.addEventListener('click', () => {
			item.action();
			dropdownMenu.style.display = 'none';
		});
		dropdownMenu.appendChild(menuItem);
	});

	return dropdownMenu;
}


function adjustPositionToFitViewport(x, y, menu, dialogRect = null) {
	menu.style.display = 'block';
	const menuRect = menu.getBoundingClientRect();
	menu.style.display = 'none';

	const viewportWidth = dialogRect ? dialogRect.width : window.innerWidth;
	const viewportHeight = dialogRect ? dialogRect.height : window.innerHeight;
	const bottomMargin = 55;

	x = Math.max(0, Math.min(x, viewportWidth - menuRect.width));
	y = Math.max(0, Math.min(y, viewportHeight - menuRect.height - bottomMargin));

	return { x, y };
}

function adjustDropdownPositionRelativeToTrigger(triggerElement, dropdownMenu) {
	const triggerRect = triggerElement.getBoundingClientRect();
	const dialog = triggerElement.closest('dialog');
	const dialogRect = dialog ? dialog.getBoundingClientRect() : null;

	if (dialog && dropdownMenu.parentNode !== dialog) {
		dialog.appendChild(dropdownMenu);
	} else if (!dialog && dropdownMenu.parentNode !== document.body) {
		document.body.appendChild(dropdownMenu);
	}

	dropdownMenu.style.display = 'block';
	const menuRect = dropdownMenu.getBoundingClientRect();
	const firstItem = dropdownMenu.firstChild;
	const firstItemRect = firstItem ? firstItem.getBoundingClientRect() : { height: 0 };
	dropdownMenu.style.display = 'none';

	let initialLeft, initialTop;

	if (dialog) {
		if (triggerRect.right + menuRect.width <= dialogRect.right) {
			initialLeft = triggerRect.right - dialogRect.left;
		} else {
			initialLeft = triggerRect.left - dialogRect.left - menuRect.width;
		}
		initialTop = triggerRect.top - dialogRect.top;
	} else {
		if (triggerRect.right + menuRect.width <= window.innerWidth) {
			initialLeft = triggerRect.right;
		} else {
			initialLeft = triggerRect.left - menuRect.width;
		}
		initialTop = triggerRect.top;
	}

	const { x, y } = adjustPositionToFitViewport(initialLeft, initialTop, dropdownMenu, dialogRect);
	dropdownMenu.style.left = `${x}px`;
	dropdownMenu.style.top = `${y}px`;
	dropdownMenu.style.display = 'block';
}


document.addEventListener('contextmenu', async (event) => {
	event.preventDefault();

	contextMenu = createContextMenu(event);
	contextMenu.innerHTML = '';
	const targetElement = event.target.closest('.app-shortcut, .file, #desktop');
	const menuItems = await getMenuItems(targetElement);

	menuItems.slice(0, 4).forEach(item => {
		const menuItem = document.createElement('div');
		menuItem.innerHTML = `<span class="material-symbols-rounded">${item.icon || ""}</span>
        <span>${item.label}</span>`;
		menuItem.classList.add('ctxmenuitem');
		menuItem.style.padding = '5px 10px';
		menuItem.style.cursor = 'pointer';
		menuItem.addEventListener('click', () => {
			item.action();
			contextMenu.style.display = 'none';
		});
		contextMenu.appendChild(menuItem);
	});

	if (menuItems.length > 4) {
		const moreButton = document.createElement('div');
		moreButton.innerHTML = `<span class="material-symbols-rounded">more_vert</span>
        <span>More</span>`;
		moreButton.classList.add('ctxmenuitem');
		moreButton.style.padding = '5px 10px';
		moreButton.style.cursor = 'pointer';

		const dropdownMenu = createDropdownMenu(menuItems.slice(4));
		contextMenu.appendChild(moreButton);
		document.body.appendChild(dropdownMenu);

		moreButton.addEventListener('mouseenter', () => {
			adjustDropdownPositionRelativeToTrigger(moreButton, dropdownMenu);
		});

		moreButton.addEventListener('mouseleave', () => {
			dropdownMenu.style.display = 'none';
		});

		dropdownMenu.addEventListener('mouseenter', () => {
			dropdownMenu.style.display = 'block';
		});

		dropdownMenu.addEventListener('mouseleave', () => {
			dropdownMenu.style.display = 'none';
		});
	}

	const dialog = event.target.closest('dialog');
	const dialogRect = dialog ? dialog.getBoundingClientRect() : null;
	const cursorX = dialogRect ? event.clientX - dialogRect.left : event.clientX;
	const cursorY = dialogRect ? event.clientY - dialogRect.top : event.clientY;

	const { x, y } = adjustPositionToFitViewport(cursorX, cursorY, contextMenu, dialogRect);
	contextMenu.style.left = `${x}px`;
	contextMenu.style.top = `${y}px`;
	contextMenu.style.display = 'block';
});

document.addEventListener('click', () => {
	if (contextMenu) contextMenu.style.display = 'none';
	const dropdownMenus = document.querySelectorAll('.dropdown-menu');
	dropdownMenus.forEach(menu => menu.remove());
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && contextMenu) {
		contextMenu.style.display = 'none';
	}
});