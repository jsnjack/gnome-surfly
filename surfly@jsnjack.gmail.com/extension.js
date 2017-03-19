/* exported init, enable, disable */

const ExtensionUtils = imports.misc.extensionUtils;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const Main = imports.ui.main;
const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;
const Soup = imports.gi.Soup;
const St = imports.gi.St;
const Tweener = imports.ui.tweener;

const Me = ExtensionUtils.getCurrentExtension();

const CLIPBOARD_TYPE = St.ClipboardType.CLIPBOARD;
const Clipboard = St.Clipboard.get_default();
const Convenience = Me.imports.convenience;


let popup, settings;

function _close_popup() {
    // Closes popup
    Tweener.addTween(
        popup,
        {
            opacity: 0,
            time: 2,
            transition: "easeOutQuad",
            onComplete: function () {
                Main.uiGroup.remove_actor(popup);
                popup = null;
            }
        }
    );
}

function _show_popup(message, style) {
    // Shows popup with the status information
    if (!popup) {
        popup = new St.Label({
            style_class: style, text: message
        });
        Main.uiGroup.add_actor(popup);
        popup.opacity = 255;

        let monitor = Main.layoutManager.primaryMonitor;

        popup.set_position(
            monitor.x + Math.floor(monitor.width / 2 - popup.width / 2),
            monitor.y + Math.floor(monitor.height / 2 - popup.height / 2)
        );
    } else {
        popup.set_style_class_name(style);
        popup.set_text(message);
    }
}

function _put_into_clipboard(message) {
    // Saves data in the user clipboard
    Clipboard.set_text(CLIPBOARD_TYPE, message);
}

function _create_session() {
    // Create a Surfly session with REST API call
    _show_popup("🌊", "wave");
    let session = new Soup.Session();
    let surfly_api_url = "https://api." + settings.get_string("server-name") + "/v2/sessions/?api_key=" + settings.get_string("api-key");
    let params = {
        url: settings.get_string("default-url")
    }
    let message = Soup.form_request_new_from_hash("POST", surfly_api_url, params);
    session.queue_message(message, function(session, message) {
        let data = {};
        if (message.status_code === 200) {
            let data = JSON.parse(message.response_body.data);
            _show_popup("🏄", "surfer");
            _put_into_clipboard(data.viewer_link);
            _close_popup();
            Gio.app_info_launch_default_for_uri(data.leader_link, null);
        } else {
            _show_popup(message.status_code + " " + message.reason_phrase, "text");
            _close_popup();
        }
        return data;
    });
}


function init() {
}

function enable() {
    settings = Convenience.getSettings("org.gnome.shell.extensions.surfly");
    Main.wm.addKeybinding(
        "create-session-keys",
        settings,
        Meta.KeyBindingFlags.NONE,
        Shell.ActionMode.NORMAL | Shell.ActionMode.MESSAGE_TRAY,
        Lang.bind(this, _create_session)
    );
}

function disable() {
    Main.wm.removeKeybinding("create-session");
}

