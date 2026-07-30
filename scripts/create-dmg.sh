#!/bin/bash
set -e

# ---------- CONFIGURATION (change these to match your project) ----------
APP_NAME="YourAppName"          # name of your .app (without extension)
VERSION="${VERSION:-1.0.0}"     # version (can be passed from workflow)
APP_PATH="./${APP_NAME}.app"    # path to the built .app (make sure it exists)
DMG_NAME="${APP_NAME}-${VERSION}.dmg"
VOLUME_NAME="${APP_NAME}"
DMG_TMP="dmg_tmp"

# ---------- VERIFY THAT THE .app EXISTS ----------
if [ ! -d "$APP_PATH" ]; then
    echo "❌ Error: .app not found at $APP_PATH"
    exit 1
fi

# ---------- CREATE A TEMPORARY FOLDER ----------
rm -rf "$DMG_TMP"
mkdir -p "$DMG_TMP"

# Copy the .app and create a symlink to /Applications
cp -R "$APP_PATH" "$DMG_TMP/"
ln -s /Applications "$DMG_TMP/Applications"

# ---------- CREATE A WRITABLE TEMPORARY .DMG ----------
TEMP_DMG="temp.dmg"
hdiutil create -volname "$VOLUME_NAME" \
    -srcfolder "$DMG_TMP" \
    -ov -format UDRW \
    "$TEMP_DMG"

# ---------- MOUNT, CUSTOMIZE LOOK (optional) ----------
MOUNT_DIR=$(hdiutil attach -readwrite -noverify -noautoopen "$TEMP_DMG" | grep -E '^/dev/' | sed 1q | awk '{print $NF}')
sleep 2

# (Optional) Customize window appearance using AppleScript
# Uncomment and adjust coordinates if you want a polished look
# osascript <<EOF
# tell application "Finder"
#   tell disk "$VOLUME_NAME"
#     open
#     set current view of container window to icon view
#     set toolbar visible of container window to false
#     set statusbar visible of container window to false
#     set the bounds of container window to {400, 100, 900, 450}
#     set the position of every item to {100, 100}
#   end tell
# end tell
# EOF

sleep 2

# Detach the mounted volume
hdiutil detach "$MOUNT_DIR"
sleep 2

# ---------- CONVERT TO COMPRESSED FINAL .DMG ----------
hdiutil convert "$TEMP_DMG" -format UDZO -imagekey zlib-level=9 -o "$DMG_NAME"

# ---------- CLEAN UP ----------
rm -f "$TEMP_DMG"
rm -rf "$DMG_TMP"

echo "✅ DMG successfully created: $DMG_NAME"
