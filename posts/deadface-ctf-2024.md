---
title: DEADFACE CTF 2024
description: It took me like 15 minutes to figure out what CTF these notes were for because I never labelled them and half of these challenges don't show up when you google them.
date: 2024-10-18
scheduled: 2024-10-18
tags: ctf
layout: layouts/post.njk
image: https://cdn.pixabay.com/photo/2020/08/30/20/54/rice-field-5530707_1280.jpg
---

It took me like 15 minutes to figure out what CTF these notes were for because I never labelled them and half of these challenges don't show up when you google them.

## Something in the Dark

Category: Steg
The challenge links an image of a tweet talking about flashing "RED GREEN BLUE" and another image. First instinct is using a tool like stegsolver to view the various planes (alpha, red, green, blue) both visually and as data. Going through each plan visually we can spot text on Red Plane 1 saying "flag{ar3_we_410N3??}"


## Price Check

Category: Steg
The challenge gives us a csv with a hint to "scan." Looking at the csv it is a 29x29 matrix of numbers from 0-255 (denoting a byte, and potentially a color if you get what I'm going with). These two things sound a lot like 29x29 node QR code. I don't believe there is any software to translate this file format and I don't have pillow memorized, so I decided to have chatgpt do it
```
See the following:
# CSV to Image Conversion

#### You:
I have a csv file denoting a 29x29 black and white image ie 255,255,0,255\n0,255... can you write a python script to convert it to an image

#### ChatGPT:
Sure! Below is a Python script that reads a CSV file representing a 29x29 black and white image and converts it into an image using the `Pillow` library. The assumption is that values in the CSV represent pixel intensities (0 for black, 255 for white):

\```python
import csv
from PIL import Image
import numpy as np

# Load the CSV file
csv_file = 'your_file.csv'  # Replace with your CSV file path
output_image = 'output_image.png'  # Replace with desired output image name

# Read the CSV file
with open(csv_file, newline='') as f:
    reader = csv.reader(f)
    data = list(reader)

# Convert the CSV data to a numpy array
image_data = np.array(data, dtype=np.uint8)

# Reshape into a 29x29 array
image_data = image_data.reshape((29, 29))

# Create an image from the numpy array
image = Image.fromarray(image_data)

# Save the image
image.save(output_image)
image.show()
\```

### Key Points:

- The script reads the CSV, converts it to a NumPy array, and reshapes it into a 29x29 grid.
- It assumes that the values are already in the form of pixel intensities (0 for black and 255 for white).
- You can replace the CSV file path with your actual file's name.

Let me know if you need any further customization!


This almost works perfectly, but needed to flip it in an image editor because the reshape was kind of weird. In the end we get "flag{that_will_be_five_dollars}"
```

## Syncopated Beat
Category: Steg

Challenge lists something about demon voices and includes a video, listen to video and you will hear reversed speech partway in the song, classic. Reversing audio in audacity gives us the voices (very good quality audio too)

The silly "demon" gives a hint that the flag is a band that did a song like "fly like an eagle, time keeps on slipping" in the 70s with all cap, spaces between the words (good song). The band is STEVE MILLER BAND


## Logical Left and Rational Right
Challenge is a file with a bunch of \ and /. Very binary looking

Used cyberchef
```
Find_/_Replace({'option':'Regex','string':'\\\\'},'0',true,false,true,false)
Find_/_Replace({'option':'Regex','string':'\\/'},'1',true,false,true,false)
From_Binary('Space',8)
```
Gives us "Just a little something to get started, hope you have fun this year Turbo Tacky!!!! flag{H3YY0UrF1N411Y4W4K3}"


## Ides-le Talk
Challenge is a txt file with text like "Gur Yvsr naq Qrngu bs Whyvhf Pnrfne." The patterns look a lot like a monoalphabetic substitution cipher, particularly a rotation so tested it versus rot13 in cyberchef and we get "The Life and Death of Julius Caesar.' Ctrl-F for "flag" and we find "flag: L3t_The#Mi$chiefs^8361n"

## Social Pressure
Similar challenge to Ides-le but this time ROT13 Bruteforcing didnt work example text: "Svb ororgs, yrt mvdh! Dv'iv tlrmt zugvi Wv Nlmmv Urmzmxrzo mvcg. Gsvri hvxfirgb nvzhfivh szev hlnv slovh gszg dv'iv tlmmz vckolrg yrt grnv! R'ev yvvm klprmt zilfmw zmw ulfmw hlnv HJO efomvizyrorgrvh dv xzm oveviztv uli nzcrnfn xszlh."

Since ROT13 didn't work I shoved it in dcode's monoalphabetic substitution cipher solver (https://www.dcode.fr/monoalphabetic-substitution). This gives us "HEY LILITH, BIG NEWS! WE'RE GOING AFTER DE MONNE FINANCIAL NEXT. THEIR SECURITY MEASURES HAVE SOME HOLES THAT WE'RE GONNA EXPLOIT BIG TIME! I'VE BEEN POKING AROUND AND FOUND SOME SQL VULNERABILITIES WE CAN LEVERAGE FOR MAXIMUM CHAOS." and two potential keys (ZYXWVUTSRAPONMLKJIHGFEDCBQ or JYXWVUTSRQPONMLKZIHGFEDCBA). Using these we can decrypt their chats and find that they are talking about "Elroy Ongaro" so the flag is "flag{Elroy_Ongaro}

## Cereal Killer 01
Using IDA to decompile the windows code we get something like 
```
  sub_791020("As in, which spooky cereal is best?\n", v27);
  sub_791020("Mr. Robert F. Kennedy, Jr. has a favorite spooky cereal.  Tear apart this\n", v28);
  sub_791020("binary and see if you can figure out what it is!\n", v29);
  sub_791020("\n\n", v30);
  sub_791020("Please enter the password: ", v31);
  sub_791060("%1023[^\n]", (char)Src);
  v8 = Src;
  for ( j = strlen(Src); isspace(ArgList[j + 47]); Src[j] = 0 )
    --j;
  for ( k = Src[0]; k; --j )
  {
    if ( !isspace(k) )
      break;
    k = *++v8;
  }
  memmove(Src, v8, j + 1);
  sub_7910A0(13);
  if ( !strncmp(Str1, "obboreel", 8u) )
  {
    v24 = "ACCESS DENIED!!!\n";
  }
```
so I tried "obboreel" as the password. That didn't work, so I did it again and looked to see what it was comparing for the strncmp. In this stack we could see "booberry" so I used that and it worked and spat out the flag

## She's Got Issues
"Head over to their code repo and see if you can gather some intel on the state of the develop team and other clues that might help you hack the Sweepstakes website."
Click repo, check issues tab, ctrl-f "flag", flag{CK06b-What-The-Director-Wants-The-Director-Gets!!!}


## Image of the Beast
Some sorta lore about a disgruntled employee, he left something for us in a repo. Link to a github. Click link to github, find image by the disgruntled employee, look at exif data "WebStatement	https://schnickschnock.lyttonlabs.org/schnickschnock/welp.html" Flag at the bottom of page "flag{CK06a-Clippy-Isnt-Disgruntled-He-Was-Never-Gruntled-In-The-First-Place!!!}"


## Cereal Killer 05
Use a java decompiler to decompile the code, notice it uses an incrementing xor cipher to decrypt the url with our supplied cipher and that the plaintext url starts with "https://'. Use the reversibility of xor with known plaintext as such:
```
encrypted_url=[42, 6, 68, 64, 7, 120, 93, 31, 83, 17, 48, 23, 81, 92, 90, 46, 11, 68, 68, 27, 44, 30, 81, 82, 7, 108, 29, 66, 87, 91, 33, 23, 66, 85, 21, 46, 1, 31, 86, 6, 45, 29, 68, 82, 6, 45, 29, 68, 30, 30, 50, 23, 87]
for i in range(len("https://")): print(chr(encrypted_url[i]^ord("https://"[i])),end='')
```
This gives us "Br00tBr0'
but we happen to know there is a modulus in the code so the key is reused, so we can assume the key is actually just "Br00t"
```
C:\Users\Cramik\Desktop>java -jar cerealkiller05.jar
President Donald Trump has a favorite cereal.  It is great... really great...
The reason it is so great, is because HE likes it... that makes it reall great...
Of course, to maintain utmost secrecy, it is protected with a password that is
HIGHLY secure (and backed up securely on a piece of paper somewhere in Mar Lago...)
Now, you, being a highly trained hacker, should be able to BYPASS this security and
discover what President Trump's favorite monster cereal is.

Enter password: Br00t
Decrypted URL: https://cereal.lyttonlabs.org/cereals/frootbroot.jpeg
Decrypted Flag: flag{Fr00t-Br00t-is-the-only-cereal-for-Prez-Trump!}
```
## Cereal Killer 02
I played around with inputs and noticed that the access denied output is hit when a DWORD (labelled v9 by IDA) fails an if comparison with another DWORD (v11). I also noticed that v11 is independent of our input so its likely the intended result of our input. With this, I patched the assembly above that sets 
"v9 = &v44;" to the equivalent of "v9 = &v45;" since v11 is set to &v45 right before the comparison
basically turned
```
.text:00FE1435 lea     ecx, [esp+760h+var_480]
.text:00FE143C mov     esi, 0Ch
.text:00FE1441 lea     edx, [esp+760h+var_470]
```
to
```
.text:00FE1435 lea     ecx, [esp+760h+var_470]
.text:00FE143C mov     esi, 0Ch
.text:00FE1441 lea     edx, [esp+760h+var_470]
```

## Data Breach
Downloaded the pcap file, pcapng so couldn't use networkminer free version :(. Sorted by protocol, skipped ARP, thought DNS looked suspicious but didnt see anything easy to solve, so went down to HTTP. Noticed an HTTP header "Not-Suppose-To-Be-Here: flag{Information_disclosure_in_the_head}"
#### (Future me here. You can just use wireshark to convert pcapng to pcap)

## Winning Factors
```
from pwn import *
from math import factorial
a=remote("147.182.245.126","33001");b=a.recvline();print(b);number=b[27:-2];print(number);answer=str(math.factorial(int(number)));print(answer);a.send(answer);b=a.recvall(timeout=1);print(b)
```

## Is This Vul-ner-ble?
```
hashcat -m 16500 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsIm5vbmNlIjoiIn0.eyJpc3MiOiJ0dXJib3RhY3RpY2FsLm5ldCIsImV4cCI6IjE0NTA2NTkxMDIiLCJ1cG4iOiJjZm9kZXJhIiwiZnVsbF9uYW1lIjoiQ2xhaXIgRm9kZXJhIiwidXNlcm5hbWUiOiJDRm9kZXJhOTEiLCJwaG9uZV9udW1iZXIiOiIiLCJqdGkiOiJmdGlkMjM0MmEtMzI0M2QtMjM0My1kMzR5OHlnZmZlIiwic3R1ZmYiOjExMjIyLCJncm91cHMiOlsibG93X2FkbWluIiwicmVtb3RlX3VzZXIiLCJsYWJ0ZWNoIl0sIm9yZyI6IlR1cmJvVGFjdGljYWwiLCJzdWJfb3JnIjoiR3JvdXBfRCIsIm5idCI6NTc1NDczNzU0ODI5NTI3NTAwMDAsImxkZV9zIjpbeyJhc3RhdHVzIjoibnVsbCIsImJzdGF0dXMiOiJudWxsIiwiY3N0YXR1cyI6InZhbGlkIiwiZHN0YXR1cyI6Im51bGwifV19.kQKRFPLj_SqVeEiBjfKi7FKOEVoV71JgdFRxDTjp7TQ fasttrack.txt
```