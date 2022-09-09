# Changelog

## [1.0.0]

Obsidian QuickShare and Noteshare.space are now out of beta 🚀 You can now find the plugin
in the Obsidian community plugin marketplace (see [instructions](https://noteshare.space/install)).
Check out the roadmap for upcoming features [here](https://noteshare.space/roadmap).

This release is further identical to version 0.4.1.

## [0.4.0]

- feat: New notes are now encrypted using the SubtleCrypto web standard for better security and performance.
## [0.3.0]

- The plugin now sends an anonymous user id and your plugin version to server. This will be used to track broad usage service utility trends (e.g. active users/week) and apply fair use limits per user. The user id is generated using a random number generator and reveals no identifiable information about the user.
## [0.2.0]

- Rebranded the plugin to QuickShare. I believe this better encapsulates what the plugin does, and is easier to say.

## [0.1.1]


- bug: 🐛 Fix the server URL not resetting to `https://noteshare.space` when enabling the "Use Noteshare.space" option in the plugin settings.

## [0.1.0]

### First version! 

- Added command: "Create share link"
- Added item to Options menu on Markdown panes:  "Create share link"
- Default note storage provider is set to [Noteshare.space](https://noteshare.space)
- Storage provider can be changed for users who want to host their own instance