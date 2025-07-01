const { Gtk, Gio } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function init() {}

function buildPrefsWidget() {
    let settings = ExtensionUtils.getSettings(
        'org.gnome.shell.extensions.randombg');

    let widget = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        margin_top: 10,
        margin_bottom: 10,
        margin_start: 10,
        margin_end: 10,
    });

    let title = new Gtk.Label({
        label: '<b>' + Me.metadata.name + ' Settings</b>',
        use_markup: true,
        halign: Gtk.Align.START
    });
    widget.append(title);

    // Folder setting
    let folderBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 10 });
    let folderLabel = new Gtk.Label({ label: 'Image Folder', halign: Gtk.Align.START });
    let folderEntry = new Gtk.Entry({ hexpand: true });
    folderBox.append(folderLabel);
    folderBox.append(folderEntry);
    widget.append(folderBox);

    // Shortcut setting
    let shortcutBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 10 });
    let shortcutLabel = new Gtk.Label({ label: 'Shortcut', halign: Gtk.Align.START });
    let shortcutEntry = new Gtk.Entry({ 
        hexpand: true, 
        placeholder_text: 'Click and press key combination'
    });
    
    // Make shortcut entry capture key combinations
    let controller = new Gtk.EventControllerKey();
    controller.connect('key-pressed', (widget, keyval, keycode, state) => {
        if (keyval === 65288) { // Backspace key
            shortcutEntry.set_text('');
            return true;
        }
        
        let mask = state & Gtk.accelerator_get_default_mod_mask();
        if (mask || (keyval !== 65307 && keyval !== 65289)) { // Not Escape or Tab
            let accelerator = Gtk.accelerator_name(keyval, mask);
            shortcutEntry.set_text(accelerator);
            return true;
        }
        
        return false;
    });
    
    shortcutEntry.add_controller(controller);
    shortcutBox.append(shortcutLabel);
    shortcutBox.append(shortcutEntry);
    widget.append(shortcutBox);

    // Enable loop toggle
    let enableLoopBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 10 });
    let enableLoopLabel = new Gtk.Label({ label: 'Enable Loop', halign: Gtk.Align.START });
    let enableLoopSwitch = new Gtk.Switch({ halign: Gtk.Align.END, hexpand: true });
    enableLoopBox.append(enableLoopLabel);
    enableLoopBox.append(enableLoopSwitch);
    widget.append(enableLoopBox);

    // Loop setting
    let loopBox = new Gtk.Box({ orientation: Gtk.Orientation.HORIZONTAL, margin_top: 10 });
    let loopLabel = new Gtk.Label({ label: 'Loop Interval (seconds)', halign: Gtk.Align.START });
    let loopSpin = new Gtk.SpinButton({
        adjustment: new Gtk.Adjustment({
            lower: 1,
            upper: 86400, // 24 hours in seconds
            step_increment: 1
        })
    });
    loopBox.append(loopLabel);
    loopBox.append(loopSpin);
    widget.append(loopBox);

    // Bind settings
    settings.bind('folder', folderEntry, 'text', Gio.SettingsBindFlags.DEFAULT);
    settings.bind('shortcut', shortcutEntry, 'text', Gio.SettingsBindFlags.DEFAULT);
    settings.bind('enable-loop', enableLoopSwitch, 'active', Gio.SettingsBindFlags.DEFAULT);
    settings.bind('loop-seconds', loopSpin, 'value', Gio.SettingsBindFlags.DEFAULT);

    return widget;
}
