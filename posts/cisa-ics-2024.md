---
title: CISA ICS CTF 2024
description: Possibly one of the messiest CTF writeups
date: 2024-09-01
scheduled: 2024-09-01
tags: ctf
layout: layouts/post.njk
image: https://cdn.pixabay.com/photo/2020/08/30/20/54/rice-field-5530707_1280.jpg
---

## Extend Your Stay - 1
crx files are chrome extensions that are basically just zip files. We can open it up, go to background.js and we'll see some code at the bottom:
```
// This will execute when the extension is first installed
chrome.runtime.onInstalled.addListener(() => {
    var val = "ZmxhZ3toeXAzcjN4dDNuZDNkfQ==";
    console.log("NO MORE RODENTS!!!!!!!!!!");
    console.log(atob(val));
});
```
val is a base64 encoded string that decodes to "flag{hyp3r3xt3nd3d}"


## Extend Your Stay - 2
This part is included in the obfuscated part since it is malicious, we dont actually have to deobfuscate we can just start base64 decoding random base64 strings until we find  aHR0cHM6Ly93d3cuZmVsbHN3YXJnby5jb20v == https://www.fellswargo.com/ which matches the challenge prompt


## Mission: Inconceivable - 1
https://postalpro.usps.com/ppro-tools/encoder-decoder
DAFFFDDFTTFATDTDFFDTDAFADAATFATDTADTAFFDDTDTTADFDTTFDDAFAFFAFTATT
Chicago


## Mission: Inconceivable - 2
"Using the information you know about the attackers, especially their culinary tastes, can you identify the BSSID (the access point's MAC address) for their hideout's WiFi network?"
8A:9C:67:46:08:B1
41.67711639,-107.9834137,Bringmetacosplease,0,20230701-00000,2023-07-01T14:00:00.000Z,2023-08-26T05:00:00.000Z,2023-08-26T05:00:00.000Z,8A:9C:67:46:08:B1,,infra,,2,0,?,?,?,False,11,,wpa2,US,WY,Carlton Road,,,




## Read Askew Manuscripts - 1
volatility.exe printkey -f memdump_fewer_images_test1.raw -K Software\ACME_XRay
ZmxhZ3tmMzNsMW5nX3YwbEB0MWwzfQ==
flag{f33l1ng_v0l@t1l3}

## Read Askew Manuscripts - 2
C:\Users\Cramik\Downloads\memdump.raw>volatility.exe notepad -f memdump_fewer_images_test1.raw
Volatility Foundation Volatility Framework 2.6
Process: 172
Text:
Dear friend,

Thank you for supporting this mission. Well, not like you really had a choice :)

Upload the patient's image using the link below. Do not upload any other patients. And do not get the wrong patient. I am out of patience.

https://www.ev1lf1lestorage.info/?directory=images&user=ominousnoteperson&passB64=aWxpa2V3cml0aW5nb21pbm91c25vdGVz&login=true

If necessary, you can use this flash drive to extract the image, but ONLY if the cloud storage doesn't work. And I know it works so don't pull any funny business.

Drop this flash drive at ///trips.pistons.huffs when you're done. If you see a man with an accordion, run.

See you never,

The Ominous Note Writer



P.S. If you get hungry on this mission, you're on your own. Bring a snack and just Eat It.

ilikewritingominousnotes



## Read Askew Manuscripts - 3
C:\Users\Cramik\Downloads\memdump.raw>volatility.exe iehistory -f memdump_fewer_images_test1.raw
Volatility Foundation Volatility Framework 2.6
**************************************************
Process: 1588 explorer.exe
Cache type "DEST" at 0x21b1e2d
Last modified: 2024-04-11 11:42:52 UTC+0000
Last accessed: 2024-04-11 17:42:54 UTC+0000
URL: Administrator@file:///E:/Phoenix_Wright.png
**************************************************
Process: 1588 explorer.exe
Cache type "DEST" at 0x21cea1d
Last modified: 2024-04-11 11:42:52 UTC+0000
Last accessed: 2024-04-11 17:42:54 UTC+0000
URL: Administrator@file:///E:/Phoenix_Wright.png



## Read Askew Manuscripts - 4
https://steemit.com/security/@nybble/forensic-extracting-files-from-mft-table-with-volatility-part-2-en

C:\Users\Cramik\Downloads\memdump.raw>volatility.exe filescan -f memdump_fewer_images_test1.raw | grep Phoenix
Volatility Foundation Volatility Framework 2.6
0x00000000096959b0      1      0 RW-rw- \Device\HarddiskVolume1\Documents and Settings\Administrator\Recent\Phoenix_Wright.lnk
0x0000000009769228      1      0 R--r-- \Device\DP(1)0-0+3\Phoenix_Wright.png
0x000000000978c820      1      0 R--r-- \Device\HarddiskVolume1\Documents and Settings\Administrator\Desktop\patient_images\Phoenix_Wright.png


C:\Users\Cramik\Downloads\memdump.raw>volatility.exe dumpfiles -Q 0x0000000009769228 -D files/ -u -n -f memdump_fewer_images_test1.raw
Volatility Foundation Volatility Framework 2.6
DataSectionObject 0x09769228   None   \Device\DP(1)0-0+3\Phoenix_Wright.png



## Follow the Charts - 3
The malicious application is a notes to bash converter. The main function for decoding is "decodechart." Reversing is an option, but would be hard considering the amount of xors, bitwise operations, and subfuctions. Instead, we can use a sandbox like app.any.run just to see what commands it runs and we'll see "sh -c "#flag{W31C0Me_t0_tH3_JUn6L3} echo \"Finished updating clone hero charts :)\"""


## Introduction to Malcolm - 8
destination.port>60000 AND source.port>60000
include the network.community_id field on the left side

## Introduction to Malcolm - 9
communityId=="1:lkHwtdagxh1Nv9QKO2SuVdVkQ0I="


## Learning to DRIFT - 1

packet 6 PLC -> HMI NEW-CONNECTION-RESPONSE
000c = length
01 = message code (NEW-CONNECTION)
00 = respone code 
61cb506b8ff1b477 = Partial AES

The first encrypted command sent by the HMI in this capture is a Read-Sensor command. What was the responded current-value of that sensor (sensor id is 100)?

packet 8 HMI -> PLC READ-SENSOR-REQUEST
001a = length
a9de4b26a71f6989 = partial aes key
6d21595f8c02ffad25b55ed49a4a3d8e

Create a cyberchef recipe:
AES_Decrypt({'option':'Hex','string':'61cb506b8ff1b477a9de4b26a71f6989'},{'option':'Hex','string':''},'ECB','Hex','Raw',{'option':'Hex','string':''},{'option':'Hex','string':''})
To_Hex('Space',0)

Decrypt 6d21595f8c02ffad25b55ed49a4a3d8e


Output: 
03 - Message code (READ-SENSOR)
64 - Sensor ID

Packet 9 PLC -> HMI READ-SENSOR-RESPONSE
001a = length
9191c45d7fe2ddca = partial aes key
39f35ca00eb0ada6c29996f1bf9eb2e7


AES_Decrypt({'option':'Hex','string':'61cb506b8ff1b4779191c45d7fe2ddca'},{'option':'Hex','string':''},'ECB','Hex','Raw',{'option':'Hex','string':''},{'option':'Hex','string':''})
To_Hex('Space',0)
Decrypt 39f35ca00eb0ada6c29996f1bf9eb2e7

Output:
03 = message code
00 = response code
64 = sensor id
00 00 02 06 = value
0206 hex to decimal is 518


Bulk Recipe:
Drop_bytes(0,4,false)
Register('(^.{16})',true,false,false)
Drop_bytes(0,16,false)
AES_Decrypt({'option':'Hex','string':'9bc665880b5df8fc$R0'},{'option':'Hex','string':''},'ECB','Hex','Raw',{'option':'Hex','string':''},{'option':'Hex','string':''})
To_Hex('Space',0)



Sensor request: 001a0a6f538822259c7390a6e5d86712724891d7549593f8ff95
06 = message code
06 = count
64 65 66 67 68 69 = sensor ids

Sensor Response:
06 = message code
00 = response code
06 = sensor count
Sensor ranges:
64 00 00 01 e0 00 00 02 3a 00 00 01 c2 00 00 02 58 65 00 00 01 9a 00 00 01 ea 00 00 01 90 00 00 01 f4 66 00 00 00 41 00 00 00 4b 00 00 00 3c 00 00 00 50 67 00 00 00 41 00 00 00 4b 00 00 00 3c 00 00 00 50 68 00 00 00 41 00 00 00 4b 00 00 00 3c 00 00 00 50 69 00 00 00 41 00 00 00 4b 00 00 00 3c 00 00 00 50

Each sensor range is 17 bytes:
64000001e00000023a000001c200000258
650000019a000001ea00000190000001f4
66000000410000004b0000003c00000050
67000000410000004b0000003c00000050
68000000410000004b0000003c00000050
69000000410000004b0000003c00000050

Break up each sensor range to ID and ranges
64 = Sensor ID
000001e0 = WARNING-LOW
0000023a = WARNING-HIGH
000001c2 = ALERT-LOW
00000258 = ALERT-HIGH


Alarms (3rd TCP session):
001a8ddec2027f0172a440e2a3c789beff16e77009c9c5213c1f - GET-ALARM-REQUEST (0x07)

001a64314cb84d00addee6843f0381d1db25da6b2506dd76f524 - GET-ALARMS-RESPONSE

Decrypts to:
07 - Message code
00 - Response code
02 - Alarm Count
Alarm Data:
66 - Sensor ID
a0 - Alarm Code (WARNING: LOW)
0000003f - Value = 63

6b - Sensor ID
b1 - Alarm Code (ALERT: HIGH)
0000041a - Value = 1050



## A Timely Attack
```
import subprocess
import string
import time

# Base string to start with
test_string = ["0"]*8
best_char = ''
keyspace = string.digits+string.ascii_lowercase

for i in range(len(test_string)):
	max_time = -1
	second_best = -1
	best_char = ''
	
	for char in keyspace:
		test_string[i]=char
		
		start_time = time.time()

		for _ in range(1): subprocess.run(["./time_attack1", ''.join(test_string)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

		elapsed_time = time.time() - start_time
		print(f"{char} - {elapsed_time}")
		if elapsed_time > max_time:
			second_best = max_time
			max_time = elapsed_time
			best_char = char
	test_string[i]=best_char
	print(f"Found {best_char} {(max_time/second_best-1)} Current best string: {''.join(test_string)}, elapsed time: {max_time}")

# Final string after all iterations
print(f"Final string: {test_string}")
```
flag{1t_0Nly_T@k3s_4_l3ttlE_T!mE}
