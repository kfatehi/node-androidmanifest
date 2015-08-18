# androidmanifest

npm install androidmanifest --save

## Example

The following implements the AndroidManifest.xml changes described in [this blog post](http://www.andreas-schrade.de/2015/02/16/android-tutorial-how-to-create-a-kiosk-mode-in-android/) and is perfectly suited to being used in a Cordova project under `hooks/before_compile`

```
#!/usr/bin/env node

var AndroidManifest = require('androidmanifest');

var path = __dirname+'/../../platforms/android/AndroidManifest.xml'
var manifest = new AndroidManifest()

manifest
.readFile(path)
.subclass('.AppContext')
.usesPermission('android.permission.RECEIVE_BOOT_COMPLETED')
.usesPermission('android.permission.WAKE_LOCK')
.usesPermission('android.permission.GET_TASKS')

manifest.receiver('.BootReceiver').intentFilter('android.intent.action.BOOT_COMPLETED')

manifest.service('.KioskService').attr('android:exported', 'false')

manifest.writeFile(path);
```
