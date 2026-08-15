---
title: "Reverse Engineering Six Android Device Spoofing Apps"
description: Pulling apart DeviceEmulator, Geergit, Mantle, XPL-EX, androidfaker, and PrivacyKit to see how each one actually hooks the device identity APIs.
date: 2026-07-26
scheduled: 2026-07-26
tags: android, reverse-engineering, xposed
layout: layouts/post.njk
image: https://cdn.pixabay.com/photo/2020/08/30/20/54/rice-field-5530707_1280.jpg
---

There's a whole category of Xposed/LSPosed modules built around faking your Android device's identity — Android ID, IMEI, WiFi scan results, all of it — mostly aimed at app testing, ad-fraud evasion, or just not wanting to get device-fingerprinted. I'd seen a handful of these mentioned around but never actually looked at how they're implemented, so I pulled apart six of the more popular ones (DeviceEmulator, Geergit, Mantle, XPL-EX, androidfaker, and PrivacyKit) to see what's actually happening under the hood.

They all land on roughly the same idea — hook the APIs that leak device identity and hand back fake values — but the actual approaches range from "swap a static field" to a Room database with cloud sync and an LLM generating hooks on the fly. Here's what each one is doing.

### 1. DeviceEmulator v5.0.2

#### Architecture
* **Hooking Framework**: Xposed (`IXposedHookLoadPackage`)
* **Entry Point**: `dev.device.emulator.device_emulator.XposedInit.java`
* **Configuration**: `SharedPreferences`-based with per-feature toggles
* **Hook Organization**: 33+ dedicated hook classes in `hook/` package

#### Key Hooking Methods

##### Android ID Spoofing (`Hfe.java`)
Hooks `ContentProvider` queries directed at `GServices` to intercept queries for `android_id`.

```java
// Hooks ContentProvider query for GServices
// Intercepts content://com.google.android.gsf.gservices
// Replaces android_id when queried
if (lowerCase.startsWith("content://com.google.android.gsf.gservices")) {
    if (AbstractC0903e.s((Object[]) obj, "android_id")) {
        // Replace with hex string from config
        matrixCursor.addRow(new Object[]{"android_id", Long.valueOf(Long.parseLong(lowerCase2, 16))});
    }
}

```

##### MCC/MNC Spoofing (`Cmd.java`, `Lgi.java`)

```java
// Hook TelephonyManager getSimOperator
XposedHelpers.setIntField(methodHookParam.getResult(), "mcc", i);
XposedHelpers.setIntField(methodHookParam.getResult(), "mnc", i6);

// Hook PersistableBundle getString for "mccmnc"
if (str.equals("mccmnc")) {
    methodHookParam.setResult(E1.j(getValues()[0]).toArray(new String[0]));
}

```

##### WiFi Scan Result Spoofing (`Wuk.java`)

```java
// Hook WiFi scan results
for (ScanResult scanResult : (List) result) {
    scanResult.BSSID = E1.g();  // Spoofed MAC
    scanResult.SSID = strH;     // Spoofed SSID
    if (Build.VERSION.SDK_INT >= 33) {
        XposedHelpers.setObjectField(scanResult, "wifiSsid", wifiSsidFromBytes);
    }
}

```

##### Device ID via MediaDrm (`Dmi.java`)

```java
// Hook MediaDrm getPropertyString for "deviceUniqueId"
if (((String) obj).equals("deviceUniqueId")) {
    methodHookParam.setResult(hexStringToByteArray(getValues()[0]));
}

```

---

### 2. Geergit v2.7

#### Architecture

* **Hooking Framework**: Xposed (`IXposedHookLoadPackage` + `IXposedHookZygoteInit`)
* **Entry Point**: `com.pyshivam.geergit.xposed.Xposed.java`
* **Configuration**: Per-package `SharedPreferences` with MCC/MNC/operator config
* **Hook Organization**: Modular hook classes in `t0/` package

#### Key Hooking Methods

##### ContentProvider Hooking (`C1788OooO00o`)

```java
// Case 2: Hook query with Parcel manipulation
if (bArrMarshall.length == 84) {
    // Replace operator name in Parcel data
    byte[] bArrCopyOfRange = Arrays.copyOfRange(bytes, 2, bytes.length);
    // Find and replace in Parcel marshaled data
    iAUx = AbstractC1904OooOOOo.aUx(bArrMarshall2, bArrCopyOfRange, 0);
}

```

##### AccountManager Spoofing (`C1788OooO00o`)

```java
// Case 17: Return spoofed account
methodHookParam.setResult(new Account[]{
    new Account(this.Aux.aUX("account_name"), "com.google")
});

// Case 19: Replace account in map
map.put(new Account(this.Aux.aUX("account_name"), "com.google"), (Integer) it.next());

```

---

### 3. Mantle v2.5.1

#### Architecture

* **Hooking Framework**: Xposed (`IXposedHookLoadPackage`)
* **Entry Point**: `com.mantle.xposed.XposedEntry.java`
* **Configuration**: Room database with `ProfileFS` data class
* **Cloud Sync**: Firestore integration for profile sync

#### Key Hooking Methods

##### Anti-Tamper Bypass

```java
// Hook self-package to disable anti-tamper
if (Intrinsics.il(lpparam.packageName, "com.mantle")) {
    XposedHelpers.setStaticLongField(
        XposedHelpers.findClass("com.mantle.security.AntiTamper", lpparam.classLoader),
        "_mantleModuleToken", 84942882360389L
    );
    
    XposedHelpers.findAndHookMethod(
        "com.mantle.xposed.ModuleStatusChecker", lpparam.classLoader,
        "isModuleActive", new Object[]{new Z01(8)}
    );
}

```

---

### 4. XPL-EX v1.4.3 (XPrivacyLua)

#### Architecture

* **Hooking Framework**: Xposed
* **Entry Point**: Manifest metadata (`xposedmodule`, `xposedscope`)
* **Configuration**: Database-driven with Lua scripting support
* **IPC**: VXP ContentProvider for cross-process communication

```xml
<meta-data android:name="xposedmodule" android:value="true"/>
<meta-data android:name="xposeddescription" android:value="@string/app_name"/>
<meta-data android:name="xposedminversion" android:value="82"/>
<meta-data android:name="xposedscope" android:resource="@array/scopes"/>

```

---

### 5. androidfaker

#### Architecture

* **Hooking Framework**: Xposed (`IXposedHookLoadPackage` + `IXposedHookZygoteInit`)
* **Entry Point**: `com.android1500.androidfaker.xposed.MainHook.java`
* **Hook Approach**: Direct `Build.class` static field modification

##### Build.class Static Field Spoofing (`x0/aux.java`)

```java
// Direct Build.class field modification
if (c.m9837do(String.class, Boolean.TYPE)) {
    XposedHelpers.setStaticBooleanField(Build.class, strM13780do, ((Boolean) string).booleanValue());
} else if (c.m9837do(String.class, Integer.TYPE)) {
    XposedHelpers.setStaticIntField(Build.class, strM13780do, ((Integer) string).intValue());
} else if (c.m9837do(String.class, Long.TYPE)) {
    XposedHelpers.setStaticLongField(Build.class, strM13780do, ((Long) string).longValue());
} else {
    XposedHelpers.setStaticObjectField(Build.class, strM13780do, string);
}

```

---

### 6. PrivacyKit v1.11

#### Architecture

* **Hooking Framework**: LSPosed (`libxposed.service`)
* **Entry Point**: `com.sal.privacykit.xposed.XposedServiceConnection.java`
* **Configuration**: Room database with Profile system, AI-powered hook generation

##### AI-Powered Hook Generation

```java
// Generates custom hooks based on observed evidence
public final Object generate(AiProvider provider, String apiKey, 
    JSONObject evidenceReport, String userIntent, long timeout) {
    
    Pair<List<Observation>, List<ManualFinding>> partition = partitionObservations(observations);
    String prompt = buildPrompt(packageName, userIntent, actionable);
    String raw = completion.complete(provider, apiKey, prompt, jsonMode, continuation);
    
    return new Result(extractRulesArray(raw), manualFindings, note);
}

```

---

### How they stack up

Laying the six out side by side, the range in sophistication is pretty wide for apps that are all nominally solving the same problem:

#### Hooking approach

| App | Hooking Method | Aggressiveness | Flexibility |
| --- | --- | --- | --- |
| DeviceEmulator | Result replacement | Medium | Medium |
| Geergit | Result replacement + Parcel manipulation | High | High |
| Mantle | ContentProvider export | Low | High |
| XPL-EX | Database-driven + Lua scripting | Variable | Very High |
| androidfaker | Static field modification | Very High | Low |
| PrivacyKit | AI-powered + Evidence-based | Low | Very High |

#### Feature matrix

| Feature | DeviceEmulator | Geergit | Mantle | XPL-EX | androidfaker | PrivacyKit |
| --- | --- | --- | --- | --- | --- | --- |
| Android ID | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| IMEI/IMSI | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| MCC/MNC | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| WiFi | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Bluetooth | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |
| GPS | ✗ | ✗ | ✓ | ✓ | ✗ | ✓ |
| KeyStore | ✗ | ✓ | ✗ | ✓ | ✗ | ✗ |

androidfaker's approach (directly overwriting `Build` class static fields) is the crudest of the six and it shows in the aggressiveness/flexibility tradeoff — it's the easiest to detect but also the easiest to reason about. PrivacyKit sits at the other end: an evidence-based system that feeds observed app behavior into an LLM to generate hooks on the fly is a lot more work to build, but it's also the only one of the six that isn't hardcoding a fixed set of fields up front. XPL-EX's Lua scripting sits in between — no AI involved, but the database-driven config still gives it more flexibility than any of the static hook lists.

---