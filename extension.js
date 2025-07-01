const { St, Clutter, Gio, GLib, Shell, Meta } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

class RandomBackground {
    constructor() {
        this._indicator = null;
        this._settings = null;
        this._timeoutId = null;
        this._shortcutId = null;
    }

    enable() {
        this._settings = ExtensionUtils.getSettings('org.gnome.shell.extensions.randombg');
        
        this._indicator = new PanelMenu.Button(0.0, 'Random Background', false);

        // Add an icon to the panel
        let icon = new St.Icon({ icon_name: 'preferences-desktop-wallpaper-symbolic', style_class: 'system-status-icon' });
        this._indicator.add_child(icon);

        // Create a menu
        let menu = new PopupMenu.PopupMenuItem('Change Background');
        menu.connect('activate', () => {
            this._changeBackground();
        });
        this._indicator.menu.addMenuItem(menu);

        Main.panel.addToStatusArea('random-background-indicator', this._indicator);
        
        // Setup shortcut
        this._setupShortcut();
        
        // Setup loop
        this._setupLoop();
        
        // Watch for settings changes
        this._settings.connect('changed::shortcut', () => this._setupShortcut());
        this._settings.connect('changed::enable-loop', () => this._setupLoop());
        this._settings.connect('changed::loop-seconds', () => this._setupLoop());
    }

    disable() {
        if (this._timeoutId) {
            GLib.source_remove(this._timeoutId);
            this._timeoutId = null;
        }
        
        if (this._shortcutId) {
            Main.wm.removeKeybinding('random-background-shortcut');
            this._shortcutId = null;
        }
        
        this._indicator.destroy();
        this._indicator = null;
        this._settings = null;
    }

    _setupShortcut() {
        if (this._shortcutId) {
            Main.wm.removeKeybinding('random-background-shortcut');
            this._shortcutId = null;
        }
        
        let shortcut = this._settings.get_string('shortcut');
        if (shortcut && shortcut.trim() !== '') {
            try {
                // Set the shortcut in the array format expected by GNOME
                this._settings.set_strv('random-background-shortcut', [shortcut]);
                
                Main.wm.addKeybinding(
                    'random-background-shortcut',
                    this._settings,
                    Meta.KeyBindingFlags.NONE,
                    Shell.ActionMode.ALL,
                    () => {
                        this._changeBackground();
                    }
                );
                this._shortcutId = 'random-background-shortcut';
                log('Random Background: Shortcut registered: ' + shortcut);
            } catch (e) {
                log('Random Background: Error setting up shortcut: ' + e);
            }
        }
    }
    
    _setupLoop() {
        if (this._timeoutId) {
            GLib.source_remove(this._timeoutId);
            this._timeoutId = null;
            log('Random Background: Loop stopped');
        }
        
        if (this._settings.get_boolean('enable-loop')) {
            let seconds = this._settings.get_int('loop-seconds');
            log('Random Background: Setting up loop with ' + seconds + ' seconds interval');
            
            this._timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, seconds, () => {
                log('Random Background: Loop triggered, changing background');
                this._changeBackground();
                return GLib.SOURCE_CONTINUE;
            });
            
            if (this._timeoutId) {
                log('Random Background: Loop started successfully');
            } else {
                log('Random Background: Failed to start loop');
            }
        } else {
            log('Random Background: Loop disabled');
        }
    }

    _changeBackground() {
        let folder = this._settings.get_string('folder');
        if (!folder || folder.trim() === '') {
            Main.notify('Random Background', 'Please set an image folder in the extension settings.');
            return;
        }
        
        try {
            let dir = Gio.File.new_for_path(folder);
            if (!dir.query_exists(null)) {
                Main.notify('Random Background', 'The specified folder does not exist.');
                return;
            }
            
            let enumerator = dir.enumerate_children(
                'standard::name,standard::type',
                Gio.FileQueryInfoFlags.NONE,
                null
            );
            
            let images = [];
            let info;
            
            while ((info = enumerator.next_file(null)) !== null) {
                let name = info.get_name().toLowerCase();
                if (name.endsWith('.jpg') || name.endsWith('.jpeg') || 
                    name.endsWith('.png') || name.endsWith('.bmp') || 
                    name.endsWith('.gif') || name.endsWith('.webp')) {
                    images.push(dir.get_child(info.get_name()).get_path());
                }
            }
            
            enumerator.close(null);
            
            if (images.length === 0) {
                Main.notify('Random Background', 'No image files found in the specified folder.');
                return;
            }
            
            // Select random image
            let randomIndex = Math.floor(Math.random() * images.length);
            let selectedImage = images[randomIndex];
            
            // Set background
            let backgroundSettings = new Gio.Settings({ schema: 'org.gnome.desktop.background' });
            // Properly encode the URI to handle spaces and special characters
            let imageFile = Gio.File.new_for_path(selectedImage);
            let imageUri = imageFile.get_uri();
            backgroundSettings.set_string('picture-uri', imageUri);
            backgroundSettings.set_string('picture-uri-dark', imageUri);
            
            log('Random Background: Changed to ' + selectedImage);
            
        } catch (e) {
            Main.notify('Random Background', 'Error changing background: ' + e.message);
            log('Random Background Error: ' + e);
        }
    }
}

function init() {
    return new RandomBackground();
}
