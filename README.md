# Storage for random notes on exploring JavaScript Runtimes

## Apple's JavaScriptCore
* Symlink jsc to your local bin for usage on the command line
```bash
sudo ln -s /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc /usr/local/bin
```  
* Run any JavaScript file using jsc, with the note that some features (in particular, browser features) are not present. E.g. console.log() -> use print() or debug() instead
```bash
jsc demo-js-file.js
```  
