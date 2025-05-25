---
title: LayerOne CTF 2025
description: LayerOne CTF 2025
date: 2025-05-25
scheduled: 2025-05-25
tags: ctf
layout: layouts/post.njk
image: https://cdn.pixabay.com/photo/2020/08/30/20/54/rice-field-5530707_1280.jpg
---

## Out of Frame

Binary Eye handles this one very easily  
![61d4b2e616f86af4b632cec3e691f74a.png](../../img/61d4b2e616f86af4b632cec3e691f74a.png)

## Flag Hunting

Open in wireshark, sort by HTTP, see "flag.txt", copy text  
<<<<<<< Updated upstream
![150d1e335fa8f1059ad48c9da452a137.png](../../img/img/150d1e335fa8f1059ad48c9da452a137.png)
=======
![150d1e335fa8f1059ad48c9da452a137.png](../../img/150d1e335fa8f1059ad48c9da452a137.png)
>>>>>>> Stashed changes

## Secret File 1

```
┌──(cramik㉿Android)-[/mnt/c/users/cramik/downloads]
└─$ pdf2john secret.pdf
secret.pdf:$pdf$5*6*256*-4*1*16*e43d2d0f128345ae81f6c688ecac2b35*48*89a68ba2b7c26dbcfe3f952e53c835a6f92bbf6840229620adacc247fb295302cddc27aaa02dd18245323ab714c349c5*48*50ac35ca7f0844156dec1333a5ec762749f3d5daf7c0e12f21beb36a715687e71a24aeba62041b0345f1f0449dbc9a8b*32*108ab1c0bb3c5d999b04eacee2469554e35a616eaaef72ac869a2e4f8a1ef6bb*32*6460f87b24048e8dcfbfa5d6e7e7becb01ae3c80784cb8c66102fb011a969255
```

`C:\Users\Cramik\Desktop\SecTools\hashcat>hashcat -m 10700 secret.pdf.txt wordlists/rockyou.txt`

`$pdf$5*6*256*-4*1*16*e43d2d0f128345ae81f6c688ecac2b35*48*89a68ba2b7c26dbcfe3f952e53c835a6f92bbf6840229620adacc247fb295302cddc27aaa02dd18245323ab714c349c5*48*50ac35ca7f0844156dec1333a5ec762749f3d5daf7c0e12f21beb36a715687e71a24aeba62041b0345f1f0449dbc9a8b*32*108ab1c0bb3c5d999b04eacee2469554e35a616eaaef72ac869a2e4f8a1ef6bb*32*6460f87b24048e8dcfbfa5d6e7e7becb01ae3c80784cb8c66102fb011a969255:licenciada`

Open pdf, use password, copy invisible text  
<<<<<<< Updated upstream
![242231ab48109af05bc42873d86fd1c5.png](../../img/img/242231ab48109af05bc42873d86fd1c5.png)
=======
![242231ab48109af05bc42873d86fd1c5.png](../../img/242231ab48109af05bc42873d86fd1c5.png)
>>>>>>> Stashed changes

## Barbie's Cave Adventure

The image has a cave with a dancing man cipher on the wall, dcode has a translator for this cipher https://www.dcode.fr/dancing-men-cipher  
<<<<<<< Updated upstream
![8bf509e3ae1fede99cdc292091d08951.png](../../img/img/8bf509e3ae1fede99cdc292091d08951.png)
=======
![8bf509e3ae1fede99cdc292091d08951.png](../../img/8bf509e3ae1fede99cdc292091d08951.png)
>>>>>>> Stashed changes

## Piercing Secrets

Upload image to aperisolve, aperisolve did steghide and found Daggers.png  
<<<<<<< Updated upstream
![d17e41c3351c8642227e77d5c3289e36.png](../../img/img/d17e41c3351c8642227e77d5c3289e36.png)  
![cb770a2bbb3118c52080857ad29659cb.png](../../img/img/cb770a2bbb3118c52080857ad29659cb.png)
=======
![d17e41c3351c8642227e77d5c3289e36.png](../../img/d17e41c3351c8642227e77d5c3289e36.png)  
![cb770a2bbb3118c52080857ad29659cb.png](../../img/cb770a2bbb3118c52080857ad29659cb.png)
>>>>>>> Stashed changes

## Barbie's Mysterious Sound

There's a small bit of morse code in the middle of the audio, extract it with audacity.  
I had difficulties getting the normal "Morse Code Adaptive Audio Decoder" to work so I went with https://morsefm.com/  
<<<<<<< Updated upstream
![74f3e999420bae366a39164523ff3cdc.png](../../img/img/74f3e999420bae366a39164523ff3cdc.png)
=======
![74f3e999420bae366a39164523ff3cdc.png](../../img/74f3e999420bae366a39164523ff3cdc.png)
>>>>>>> Stashed changes

## Examsploit

Modify the correct count in the /api/submit_exam request  
<<<<<<< Updated upstream
![fe0867f6cdafe9c9827b7ef3424d3227.png](../../img/img/fe0867f6cdafe9c9827b7ef3424d3227.png)
=======
![fe0867f6cdafe9c9827b7ef3424d3227.png](../../img/fe0867f6cdafe9c9827b7ef3424d3227.png)
>>>>>>> Stashed changes

## Echoes Of Gunaa

AHA music chrome extension -> [https://www.aha-music.com/7c53e604a07b928a0db65fcb437ef406?title=Kanmani Anbodu Kadhalan (From "Guna")&artist=Kamal Haasan%2FVaali%2FS. Janaki%2FIlaiyaraaja](https://www.aha-music.com/7c53e604a07b928a0db65fcb437ef406?title=Kanmani%20Anbodu%20Kadhalan%20%28From%20%22Guna%22%29&artist=Kamal%20Haasan%2FVaali%2FS.%20Janaki%2FIlaiyaraaja) -> https://en.wikipedia.org/wiki/Kanmani_Anbodu_Kadhalan -> https://en.wikipedia.org/wiki/Guna_Caves -> flag{GunaCaves_10.21_77.46}

## Operation Silent Web

"Specter" "2216"  
https://www.instagram.com/specter_._2216  
"Shadows on Familiar Grounds"  
<<<<<<< Updated upstream
![b0840a6d241acab728c3e8301672e7ca.png](../../img/img/b0840a6d241acab728c3e8301672e7ca.png)

https://www.instagram.com/p/DI7R3wyTHjA/  
#PasswordHere  
![37eedcb4233abd4dbd9673bae9829821.png](../../img/img/37eedcb4233abd4dbd9673bae9829821.png)
=======
![b0840a6d241acab728c3e8301672e7ca.png](../../img/b0840a6d241acab728c3e8301672e7ca.png)

https://www.instagram.com/p/DI7R3wyTHjA/  
#PasswordHere  
![37eedcb4233abd4dbd9673bae9829821.png](../../img/37eedcb4233abd4dbd9673bae9829821.png)
>>>>>>> Stashed changes

"To unlock the secrets hidden in plain sight, shift your focus 22 steps back from where 'A' begins. A simple code, but only for those who can decode the past.

dpplo://sss.hejgazej.yki/ej/olaypan-odwzkso-1833x1363?qpi_okqnya=odwna&qpi_ywilwecj=odwna_rew&qpi_ykjpajp=lnkbeha&qpi_iazeqi=wjznkez_wll"

[https://cyberchef.io/#recipe=ROT13(true,true,false,-22)&input=ZHBwbG86Ly9zc3MuaGVqZ2F6ZWoueWtpL2VqL29sYXlwYW4tb2R3emtzby0xODMzeDEzNjM/cXBpX29rcW55YT1vZHduYSZxcGlfeXdpbHdlY2o9b2R3bmFfcmV3JnFwaV95a2pwYWpwPWxua2JlaGEmcXBpX2lhemVxaT13anpua2V6X3dsbA](https://cyberchef.io/#recipe=ROT13%28true,true,false,-22%29&input=ZHBwbG86Ly9zc3MuaGVqZ2F6ZWoueWtpL2VqL29sYXlwYW4tb2R3emtzby0xODMzeDEzNjM/cXBpX29rcW55YT1vZHduYSZxcGlfeXdpbHdlY2o9b2R3bmFfcmV3JnFwaV95a2pwYWpwPWxua2JlaGEmcXBpX2lhemVxaT13anpua2V6X3dsbA "https://cyberchef.io/#recipe=ROT13(true,true,false,-22)&input=ZHBwbG86Ly9zc3MuaGVqZ2F6ZWoueWtpL2VqL29sYXlwYW4tb2R3emtzby0xODMzeDEzNjM/cXBpX29rcW55YT1vZHduYSZxcGlfeXdpbHdlY2o9b2R3bmFfcmV3JnFwaV95a2pwYWpwPWxua2JlaGEmcXBpX2lhemVxaT13anpua2V6X3dsbA")

https://www.linkedin.com/in/specter-shadows-1833b1363?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app

<<<<<<< Updated upstream
![52373341c548c1cff683953718093243.png](../../img/img/52373341c548c1cff683953718093243.png)
=======
![52373341c548c1cff683953718093243.png](../../img/52373341c548c1cff683953718093243.png)
>>>>>>> Stashed changes

[https://cyberchef.io/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true)&input=Wm14aFozdG9hV2xmYVcxZmMzQmxZM1JsY2w5dWFXTmxYM1J2WDIxbFpYUmZlVzkxWDJGc2JIMD0](https://cyberchef.io/#recipe=From_Base64%28%27A-Za-z0-9%2B/%3D%27,true%29&input=Wm14aFozdG9hV2xmYVcxZmMzQmxZM1JsY2w5dWFXTmxYM1J2WDIxbFpYUmZlVzkxWDJGc2JIMD0 "https://cyberchef.io/#recipe=From_Base64('A-Za-z0-9%2B/%3D',true)&input=Wm14aFozdG9hV2xmYVcxZmMzQmxZM1JsY2w5dWFXTmxYM1J2WDIxbFpYUmZlVzkxWDJGc2JIMD0")

## Scan Me

https://www.aperisolve.com/62600eead024bbf1bf4c547d8feee020 + Binary Eye

## Locksmith

https://github.com/joswr1ght/PatternLockScripts  
python3 GenerateAndroidGestureRainbowTable.py  
python GestureKeyLookup.py gesture.key  
\[2, 1, 4, 3, 0, 7, 8, 5, 6\]  
flag{214307856}

## Barbie World Reversing

<<<<<<< Updated upstream
![121a1db805e8d06985c145b79811e422.png](../../img/img/121a1db805e8d06985c145b79811e422.png)  
![3f24f5fdaaebd9d93e1b2b41b4f5ecab.png](../../img/img/3f24f5fdaaebd9d93e1b2b41b4f5ecab.png)
=======
![121a1db805e8d06985c145b79811e422.png](../../img/121a1db805e8d06985c145b79811e422.png)  
![3f24f5fdaaebd9d93e1b2b41b4f5ecab.png](../../img/3f24f5fdaaebd9d93e1b2b41b4f5ecab.png)
>>>>>>> Stashed changes

## Binary Breach

Same thing?  
<<<<<<< Updated upstream
![ce67e95a788ce2d64b06c064049baa6d.png](../../img/img/ce67e95a788ce2d64b06c064049baa6d.png)  
![f603569dee7fb26d3167181333164c57.png](../../img/img/f603569dee7fb26d3167181333164c57.png)

## Nexus

![a8947ae0e62653571ae5c3f89b21e759.png](../../img/img/a8947ae0e62653571ae5c3f89b21e759.png)  
![a0972e9d7eb637e06cf8efcf92194748.png](../../img/img/a0972e9d7eb637e06cf8efcf92194748.png)  
![455ada53a7c6db4bb484f7864631a042.png](../../img/img/455ada53a7c6db4bb484f7864631a042.png)  
![be449e57971208dc9a650137902d3163.png](../../img/img/be449e57971208dc9a650137902d3163.png)
=======
![ce67e95a788ce2d64b06c064049baa6d.png](../../img/ce67e95a788ce2d64b06c064049baa6d.png)  
![f603569dee7fb26d3167181333164c57.png](../../img/f603569dee7fb26d3167181333164c57.png)

## Nexus

![a8947ae0e62653571ae5c3f89b21e759.png](../../img/a8947ae0e62653571ae5c3f89b21e759.png)  
![a0972e9d7eb637e06cf8efcf92194748.png](../../img/a0972e9d7eb637e06cf8efcf92194748.png)  
![455ada53a7c6db4bb484f7864631a042.png](../../img/455ada53a7c6db4bb484f7864631a042.png)  
![be449e57971208dc9a650137902d3163.png](../../img/be449e57971208dc9a650137902d3163.png)
>>>>>>> Stashed changes

## Barbie's Secret Slip 1

https://github.com/chiccoder342 -> https://github.com/chiccoder342/fashionbytes only one with commits -> test branch -> commits -> https://github.com/chiccoder342/fashionbytes/commit/b2f5228fe54eb3505e1dd3fe6892e62bdfd67ab9 -> AUTH_SECRET

## Barbie's Secret Slip 2

https://bsky.app/profile/chiccoder342.bsky.social/post/3lpwtyo52bt2s -> Base64 Decode  
https://sites.google.com/view/chiccodersite234/project-page

## Barbie's Secret Slip 3

https://web.archive.org/web/20241209164508/https://sites.google.com/view/chiccodersite234/project-page

## Polyglots! Five

There's VBScript in the code if you look hard enough. Copy that, and remove the if statement to print the flag  
Final Code:

```
Dim a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,z1,z2,z3,z4,x1,x2
a=Chr(73):b=Chr(110):c=Chr(112):d=Chr(117):e=Chr(116):f=Chr(66):g=Chr(111):h=Chr(120)
x1=a&b&c&d&e&f&g&h:x2=Eval(x1&"(" & Chr(34)&"Sing to me:"&Chr(34)&")")
z1="illusion":z2=Mid(z1,3,2):z3=0:z4=0:If x2="karaoke" Then z3=z3+999:w=False
If Len(z1)=8 And z2="lu" And z3=z4+1 Then w=True
u=Array(79,98,125,102,119,88,112,107,70,85,74,124,120,58,112,60,98,110,55,96,57,104,55,54,113,55,99,110,58,113,118,58,128)
p=Array(3,1,4,1,5,9,2,6):v=""
For i=0 To UBound(u):v=v&Chr(u(i)-p(i Mod 8)):Next:MsgBox v
If Not w Then MsgBox Chr(78)&Chr(111)&Chr(112)&Chr(101)&Chr(33)&Chr(32)&Chr(84)&Chr(114)&Chr(121)&Chr(32)&Chr(108)&Chr(111)&Chr(117)&Chr(100)&Chr(101)&Chr(114)&Chr(46):End If
```

## FixMe
PCRT solves this one https://github.com/sherlly/PCRT
python2 PCRT.py -i "chall.png" -o "chall_out.png"
Y to autofixing, N to fixing IDAT chunk data length. Repaired image looks like this
<<<<<<< Updated upstream
![339ce48e2ab42cd3ab0f1f67c709b5fa.png](../../img/img/339ce48e2ab42cd3ab0f1f67c709b5fa.png)

## Lawrence of Arabia
![26e690d232278cecb74642cd8d8fc226.png](../../img/img/26e690d232278cecb74642cd8d8fc226.png) 
![f0301e0039786f133d606cac2d3d6ab6.png](../../img/img/f0301e0039786f133d606cac2d3d6ab6.png) 
=======
![339ce48e2ab42cd3ab0f1f67c709b5fa.png](../../img/339ce48e2ab42cd3ab0f1f67c709b5fa.png)

## Lawrence of Arabia
![26e690d232278cecb74642cd8d8fc226.png](../../img/26e690d232278cecb74642cd8d8fc226.png) 
![f0301e0039786f133d606cac2d3d6ab6.png](../../img/f0301e0039786f133d606cac2d3d6ab6.png) 
>>>>>>> Stashed changes

## 5th Element
```
C:\Users\Cramik\Desktop\asimov>stegolsb wavsteg -r -i DancingDiva2.wav -o output -n 2 -b 100000
Files read                     in 0.02s
Recovered 100000 bytes         in 0.01s
Written output file            in 0.00s
```

<<<<<<< Updated upstream
![e8c68fda02468c9c653279cb35cbdc9c.png](../../img/img/e8c68fda02468c9c653279cb35cbdc9c.png)
![d24001b6c64bd59b8c0ad914774635a4.png](../../img/img/d24001b6c64bd59b8c0ad914774635a4.png)
=======
![e8c68fda02468c9c653279cb35cbdc9c.png](../../img/e8c68fda02468c9c653279cb35cbdc9c.png)
![d24001b6c64bd59b8c0ad914774635a4.png](../../img/d24001b6c64bd59b8c0ad914774635a4.png)
>>>>>>> Stashed changes

## XMI
```python
# Extract.py
import xmi

# Open the XMI file
xmi_obj = xmi.open_file("ARCHIVE.DATA (1).XMI")

# List files/members within the XMI
for f in xmi_obj.get_files():
    if xmi_obj.is_pds(f):
        for m in xmi_obj.get_members(f):
            print(f"{f}({m})")
    else:
        print(f)

# Extract all contents to a folder
xmi_obj.set_output_folder(".")
xmi_obj.extract_all()


```
Open the extracted zip, put FLAG file into hxd and switch to EBCDIC encoding in HXD (at the top)
<<<<<<< Updated upstream
![a916de101c3bed6b9bc225d6a6d30322.png](../../img/img/a916de101c3bed6b9bc225d6a6d30322.png)
=======
![a916de101c3bed6b9bc225d6a6d30322.png](../../img/a916de101c3bed6b9bc225d6a6d30322.png)
>>>>>>> Stashed changes

## Secret File 2
```
┌──(cramik㉿Android)-[/mnt/c/users/cramik/downloads]
└─$ zip2john Confidential.zip
ver 2.0 efh 5455 efh 7875 Confidential.zip/VeryVeryConfidential.png PKZIP Encr: TS_chk, cmplen=28002, decmplen=32661, crc=8947A8FD ts=11BC cs=11bc type=8
ver 1.0 efh 5455 efh 7875 ** 2b ** Confidential.zip/protected.zip PKZIP Encr: TS_chk, cmplen=374345, decmplen=374333, crc=79E8FA33 ts=1294 cs=1294 type=0
Confidential.zip:$pkzip$2*1*1*0*0*24*1294*{a bunch of junk}*$/pkzip$::Confidential.zip:VeryVeryConfidential.png, protected.zip:Confidential.zip
```

```
┌──(cramik㉿Android)-[/mnt/c/users/cramik/Desktop/SecTools/hashcat]
└─$ john --mask=?a?a?a layerone.txt
Using default input encoding: UTF-8
Loaded 1 password hash (PKZIP [32/64])
Will run 16 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
soc              (Confidential.zip)
1g 0:00:00:00 DONE (2025-05-25 12:27) 20.00g/s 2621Kp/s 2621Kc/s 2621KC/s +"2..ZBc
Use the "--show" option to display all of the cracked passwords reliably
Session completed.
```

zip2john protected.zip > protected.txt
```
┌──(cramik㉿Android)-[/mnt/c/users/cramik/Desktop]
└─$ john -1=?l?u --mask=?1?1?1ARE?d?d?d  protected.txt
Using default input encoding: UTF-8
Loaded 1 password hash (PKZIP [32/64])
Will run 16 OpenMP threads
Press 'q' or Ctrl-C to abort, almost any other key for status
catARE143        (protected.zip/Proof.png)
1g 0:00:00:04 DONE (2025-05-25 12:35) 0.2398g/s 12486Kp/s 12486Kc/s 12486KC/s kWoARE143..zikARE143
Use the "--show" option to display all of the cracked passwords reliably
Session completed.
```
The first layer file is a pdf with a lot of 30s, 31s, and 20s. I went through all the effort of decoding it just to get rickrolled
<<<<<<< Updated upstream
![6b7a39ab0a0ffdbc02c25e2d0e3babf2.png](../../img/img/6b7a39ab0a0ffdbc02c25e2d0e3babf2.png)
The real answer is easier
![f293d36e9642caa242e7d5f3019f1b2e.png](../../img/img/f293d36e9642caa242e7d5f3019f1b2e.png)
The second layer file is even easier
![758e3e4fab2210fb327487a0075a51cf.png](../../img/img/758e3e4fab2210fb327487a0075a51cf.png)
=======
![6b7a39ab0a0ffdbc02c25e2d0e3babf2.png](../../img/6b7a39ab0a0ffdbc02c25e2d0e3babf2.png)
The real answer is easier
![f293d36e9642caa242e7d5f3019f1b2e.png](../../img/f293d36e9642caa242e7d5f3019f1b2e.png)
The second layer file is even easier
![758e3e4fab2210fb327487a0075a51cf.png](../../img/758e3e4fab2210fb327487a0075a51cf.png)
>>>>>>> Stashed changes

flag{4r3_y0u_d15tracted_by_th3_r4bb1t_h0l3}


## Leaked Coordinates
This one was really annoying because they used like a weird wikipedia name for the museum instead of the german one and I swear the hint telling you that in the challenge wasnt there initially, but basically you can look at the image or exiftools the coords to find the local "berlinspymuseum" which is the password for the image in the archive, I used aperisolve for the steganography and found base64 in the lsb https://www.aperisolve.com/f339d31d61367434755be64a698551a3
<<<<<<< Updated upstream
![e45171389cd0a6fe410d7bfda1cd4e1b.png](../../img/img/e45171389cd0a6fe410d7bfda1cd4e1b.png)
![aa276cb1a575070d450d9e9b4ef9bd62.png](../../img/img/aa276cb1a575070d450d9e9b4ef9bd62.png)

## DISCORDant Glitches
![6088dac68361f5e9af0d3223a682b029.png](../../img/img/6088dac68361f5e9af0d3223a682b029.png)
![d76de3a583cdc7c2aa4dcb5957e5fb13.png](../../img/img/d76de3a583cdc7c2aa4dcb5957e5fb13.png)
=======
![e45171389cd0a6fe410d7bfda1cd4e1b.png](../../img/e45171389cd0a6fe410d7bfda1cd4e1b.png)
![aa276cb1a575070d450d9e9b4ef9bd62.png](../../img/aa276cb1a575070d450d9e9b4ef9bd62.png)

## DISCORDant Glitches
![6088dac68361f5e9af0d3223a682b029.png](../../img/6088dac68361f5e9af0d3223a682b029.png)
![d76de3a583cdc7c2aa4dcb5957e5fb13.png](../../img/d76de3a583cdc7c2aa4dcb5957e5fb13.png)
>>>>>>> Stashed changes

## Glitch Lotto
I avoided this one initially because I never looked at the js and was confused, but after looking at this js its pretty easy:
```
generateWinningNumber(new Date('June 30, 2025 05:00:00'))
# Submit a bid with that number
setTimeOverride(new Date('June 30, 2025 05:00:00'))
checkLotteryResult("yourusername")
```
<<<<<<< Updated upstream
![743c2694c1b515e66b73e5fe6eb05d0e.png](../../img/img/743c2694c1b515e66b73e5fe6eb05d0e.png)

## Domain of Lies
I didn't know what the hint meant but the odds of it being xor were high so I xor'd "flag" to the ciphertext to find the key started with Reyk = Reykjavik (Capital of Iceland)
![8a5cc400b7e7b72ec5aa1c573657ea5d.png](../../img/img/8a5cc400b7e7b72ec5aa1c573657ea5d.png)
![8cea320b4bd070a3349d54174d852876.png](../../img/img/8cea320b4bd070a3349d54174d852876.png)
=======
![743c2694c1b515e66b73e5fe6eb05d0e.png](../../img/743c2694c1b515e66b73e5fe6eb05d0e.png)

## Domain of Lies
I didn't know what the hint meant but the odds of it being xor were high so I xor'd "flag" to the ciphertext to find the key started with Reyk = Reykjavik (Capital of Iceland)
![8a5cc400b7e7b72ec5aa1c573657ea5d.png](../../img/8a5cc400b7e7b72ec5aa1c573657ea5d.png)
![8cea320b4bd070a3349d54174d852876.png](../../img/8cea320b4bd070a3349d54174d852876.png)
>>>>>>> Stashed changes
