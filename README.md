# androidmanifest

npm install androidmanifest --save

## Example

The following implements the AndroidManifest.xml changes described in [this blog post](http://www.andreas-schrade.de/2015/02/16/android-tutorial-how-to-create-a-kiosk-mode-in-android/) and is perfectly suited to being used in a Cordova project under `hooks/before_compile`

```
#!/usr/bin/env node

var _ = require('lodash');

var root = __dirname+'/../..';
var AndroidManifest = require('androidmanifest');
var manifestFilePath = root+'/platforms/android/AndroidManifest.xml'
var manifest = new AndroidManifest().readFile(manifestFilePath)

manifest.subclass('.AppContext')
.usesPermission('android.permission.RECEIVE_BOOT_COMPLETED')
.usesPermission('android.permission.WAKE_LOCK')
.usesPermission('android.permission.GET_TASKS')

manifest.receiver('.BootReceiver')
.empty()
.append('<intent-filter>')
.find('intent-filter')
.append('<action>')
.find('action')
.attr('android:name', 'android.intent.action.BOOT_COMPLETED')

manifest.service('.KioskService').attr('android:exported', 'false')

var mainActivity = manifest.activity('MainActivity')
.attr('android:screenOrientation', 'sensorLandscape')

var mainIntentFilter = mainActivity.find('> intent-filter');

_.each(['DEFAULT', 'LAUNCHER', 'HOME'], function(name) {
  var sel = 'application > activity > intent-filter';
  var name = 'android.intent.category.'+name;
  manifest.findOrCreateByAndroidName(mainIntentFilter, 'category', name)
});

manifest.writeFile(manifestFilePath);
```
