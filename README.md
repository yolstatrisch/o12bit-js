o12bit
======

o12bit (pronunciation: /ˈɔːbɪt/) is a 12-instruction set esoteric programming language where function names, register names, numbers, and instructions are duodecimal in nature i.e. using these 12 Unicode characters: 🐰🐱🕊🐸🦌🦉🐟🦇🍎🐧🦋🐺.

The interpreter is available for testing here: https://yolstatrisch.github.io/o12bit-js/

Language definition
---

This section is explained in detail here: https://github.com/yolstatrisch/o12bit-js/blob/master/LANG_DEF.md

Quick reference
---

The table below are the instruction sets and its corresponding Unicode character:

 Base 12 | Instruction | Code Point | Character
:------- |:----------- |:---------- |:---------:
 0       | def         |  U+1F430   | 🐰
 1       | cpy         |  U+1F431   | 🐱
 2       | in          |  U+1F54A   | 🕊
 3       | je          |  U+1F438   | 🐸
 4       | raw         |  U+1F98C   | 🦌
 5       | out         |  U+1F989   | 🦉
 6       | dp          |  U+1F41F   | 🐟
 7       | itr         |  U+1F987   | 🦇
 8       | add         |  U+1F34E   | 🍎
 9       | sub         |  U+1F427   | 🐧
 A       | rnd         |  U+1F98B   | 🦋
 B       | end         |  U+1F43A   | 🐺

Example Programs:
-----------------

#### Hello world
```
🐰
🐱🐰🐰🐺🐺🐟🐰
🐱🐰🐱🐺🐺🍎🦉
🐱🐰🕊🐺🐺🕊🍎
🦌🐰🐰
🦌🐰🐱
🍎🐰🐱🐺🐺🦇
🦌🐰🐱
🦌🐰🐱
🐱🐰🐸🐰🐱
🍎🐰🐱🐺🐺🐸
🦌🐰🐱
🦌🐰🕊
🍎🐰🐰🐺🐺🐱🐸
🦌🐰🐰
🦌🐰🐱
🍎🐰🐱🐺🐺🐸
🦌🐰🐱
🦌🐰🐸
🐧🐰🐸🐺🐺🍎
🦌🐰🐸
🐺
```

#### Lucas Numbers

This program outputs the first 24 Lucas Numbers
```
🐰
🐱🐱🐱🐺🐺🕊🍎
🐱🐰🐰🐺🐺🕊
🐱🐰🐱🐺🐺🐱
🐱🐰🕊🐺🐺🐱🐺
🦉🐰🐰
🦌🐱🐱
🦇🐰🕊
🍎🐰🐰🐰🐱
🐱🐰🐸🐰🐰
🐱🐰🐰🐰🐱
🐱🐰🐱🐰🐸
🦉🐰🐰
🦌🐱🐱
🐧🐰🕊🐺🐺🐱
🐺
🐺
```

##### Word from the creator:

idk why i'm making this
