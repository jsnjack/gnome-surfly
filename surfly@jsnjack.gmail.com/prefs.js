/* exported init, buildPrefsWidget */

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const Gtk = imports.gi.Gtk;

let settings;
let server_name_entry, api_key_entry, default_url_entry;

function _save() {
    settings.set_string("server-name", server_name_entry.get_text());
    settings.set_string("api-key", api_key_entry.get_text());
    settings.set_string("default-url", default_url_entry.get_text());
}

function init() {
    Convenience.initTranslations('time-tracker');
    settings = Convenience.getSettings("org.gnome.shell.extensions.surfly");
}

function buildPrefsWidget() {

    let widget = new Gtk.Box({
            orientation: Gtk.Orientation.VERTICAL,
            border_width: 10
    });

    let server_name_box, api_key_box, default_url_box;

    server_name_box = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL});
    let server_name_label = new Gtk.Label({label: "Server name:      ", margin_right: 10});
    server_name_entry = new Gtk.Entry({
        text: settings.get_string("server-name")
    });
    server_name_box.pack_start(server_name_label, true, true, 3)
    server_name_box.pack_start(server_name_entry, true, true, 3)

    api_key_box = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL});
    let api_key_label = new Gtk.Label({label: "API key:               ", margin_right: 10});
    api_key_entry = new Gtk.Entry({
        text: settings.get_string("api-key")
    });
    api_key_box.pack_start(api_key_label, true, true, 3)
    api_key_box.pack_start(api_key_entry, true, true, 3)

    default_url_box = new Gtk.Box({orientation: Gtk.Orientation.HORIZONTAL});
    let default_url_label = new Gtk.Label({label: "Default start URL:", margin_right: 10});
    default_url_entry = new Gtk.Entry({
        text: settings.get_string("default-url")
    });
    default_url_box.pack_start(default_url_label, true, true, 3)
    default_url_box.pack_start(default_url_entry, true, true, 3)

    let save_button = Gtk.Button.new_with_label("Save");
    save_button.connect('button-press-event', _save);

    widget.pack_start(server_name_box, false, false, 3);
    widget.pack_start(api_key_box, false, false, 3);
    widget.pack_start(default_url_box, false, false, 3);
    widget.pack_start(save_button, false, false, 3);

    widget.show_all();
    return widget;
}
