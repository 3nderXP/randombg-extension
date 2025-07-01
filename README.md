
# RandomBG GNOME Shell Extension

RandomBG is a GNOME Shell extension for **automatic wallpaper switching** with customizable settings.  
Designed for **GNOME 43+**, it offers a clean interface to choose wallpaper folders, configure intervals, and toggle looping — all accessible via a tray icon and shortcut.

---

## Features

- 📁 Select a directory containing wallpapers  
- ⌨️ Configure a global shortcut to manually change wallpaper  
- 🔁 Toggle automatic wallpaper looping on/off  
- ⏱️ Set custom interval timing (in minutes) between wallpaper changes  
- 📌 Tray icon for quick access and status indication  

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/seuusuario/randombg-extension.git
   ```

2. Copy the extension folder to GNOME extensions directory with the correct name (must include the `@`):

   ```bash
   cp -r randombg-extension ~/.local/share/gnome-shell/extensions/randombg@adrian-cs.com
   ```

3. Enable the extension:

   ```bash
   gnome-extensions enable randombg@adrian-cs.com
   ```

4. Restart GNOME Shell (`Alt + F2`, then `r` + Enter on X11) or log out and log back in.

---

## Configuration

Configure your settings by opening **GNOME Settings** > **Extensions** > **RandomBG Preferences** or via the tray icon menu.

---

## Usage (TAD)

Here is a quick overview of how to use RandomBG:

| Action                        | Description                                   | How to Trigger                      |
|-------------------------------|-----------------------------------------------|-----------------------------------|
| Select wallpaper directory    | Choose the folder containing your images      | Preferences UI                    |
| Manual wallpaper change       | Change wallpaper immediately                    | Configured global shortcut        |
| Enable/disable auto-loop      | Toggle automatic wallpaper rotation             | Tray icon toggle or Preferences   |
| Set interval time             | Define minutes between automatic wallpaper change | Preferences UI                    |
| Tray icon access              | Quick toggle and status overview                | Click on the tray icon in the top bar |

---

## Extension Structure

```
randombg@adrian-cs.com/
├── extension.js      # Main extension code
├── prefs.js          # Preferences UI implementation
├── metadata.json     # Extension metadata and compatibility info
├── schemas/          # GSettings schemas
│   ├── org.gnome.shell.extensions.randombg.gschema.xml
│   └── gschemas.compiled
```

---

## Compatibility

- GNOME Shell 43 and above  
- Tested on Ubuntu-based distros and derivatives (including ZorinOS)

---

## License

[MIT License](LICENSE)

---

## Author

Ádrian Cavalcante Santos (3nderXP)  
[GitHub](https://github.com/3nderXP)

---

If you want help automating installation, CI/CD integration, or packaging for GNOME Extensions, just ask.