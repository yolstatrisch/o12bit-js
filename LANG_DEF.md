Language definition
---

### The program

A valid o12bit program requires to have a main function. To define the main function, you need to use the `def` instruction with either no parameter or a parameter of `🐰🐰` which just means you define a function named `🐰🐰`, i.e. function `🐰🐰` is the main function. The program also needs to know where the function ends so an `end` instruction is needed at the end. Also, each line contains at most 1 instruction. Therefore an o12bit program may look something like this:

```
🐰
--some instruction here
--another instruction here
🐺

--other function definitions here
```

### Data types

o12bit has 3 data types: LOOΠΔ 1/3, LOOΠΔ Odd Eye Circle, and LOOΠΔ yyxy. Just kidding, it's functions, registers, and numbers.

Functions and register names in o12bit are two characters wide. That means that the allowed values for function and register names range from `🐰🐰` up to `🐺🦋`. `🐺🐺` is a reserved keyword for defining constant numbers and thus is not a valid function or register name. Moreover, functions and registers are stored independently so you can have a function named `🐰🐰` and a register named `🐰🐰` without having any conflicts or issues.

Numbers on the other hand are unsigned 8-digit integers in base 12. This means that a constant number has a range from 0 to 5 159 780 351. Numbers in o12bit are prepended with `🐺🐺` followed by the number itself so the number 314159 for example looks like this: `🐺🐺🐱🐸🐱🐧🦇🐺` which is the reserved keyword `🐺🐺` followed by `🐱🐸🐱🐧🦇🐺` which is 314159 in base 12(13197B).

While you can't declare a negative number using the `🐺🐺` keyword, registers in o12bit supports negative numbers. This can be achieved with the `sub` instruction.

### Instruction set

o12bit has 12 instructions, two of which are already mentioned in the previous section. 🐰 which is the define function and 🐺 which is the end function. Here are the rest of the instructions:

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

#### 🐰 def/define

###### Syntax: 🐰(function_name)

This instruction defines a function. All `def` instructions requires a corresponding `end` instruction at the end of the function.

#### 🐱 cpy/copy

###### Syntax: 🐱[register_name][register_name|number]

The `cpy` instruction copies the data from the 2nd parameter to the 1st parameter.

#### 🕊 in/input

###### Syntax: 🕊[register_name]

The `in` instruction ask for a user input and stores it to the first parameter. The user input should be a base 12 number otherwise, the first parameter is set to 0.

#### 🐸 je/jump if equal

###### Syntax: 🐸[function_name][register_name][register_name|number]

The `jmp` instruction calls the function if the register in the 2nd parameter is equal to the 3rd parameter.

#### 🦌 raw/raw output

###### Syntax: 🦌[register_name|number]

The `raw` instruction outputs the value of the parameter as a character. The value of the parameter must be a code point.

#### 🦉 out/output

###### Syntax: 🦉[register_name|number]

The `out` instruction outputs the value of the parameter as a number.


#### 🐟 dp/data pointer

###### Syntax: 🐟[register_name][🐺🐺][register_name]

The `dp` instruction copies the value of the 2nd parameter to the register pointed at the 1st parameter. For example, in this piece of code:

```
🐰
🐱🐰🐱🐺🐺🦉🦉
🐱🐟🦉🐺🐺🍎🐰
🐟🐰🐱🐟🦉
🐺
```

The 2nd and 3rd line sets the value of registers `🐰🐱` and `🐟🦉` to `🐺🐺🦉🦉`(Number: 32) and `🐺🐺🍎🐰`(Number: 96) respectively. In the 4th line, there is a `dp` instruction. This means that the value of the 1st parameter (The parameter in this case is `🐰🐱` and its value is `🦉🦉`) is treated as a register. Therefore the value of the 2nd parameter, `🐺🐺🍎🐰` is copied to register `🦉🦉` instead of `🐰🐱`.

If however there's a `🐺🐺` in between the two registers, the instruction is flipped and instead will copy the value of the register pointed at the 2nd parameter to the 1st parameter. So in the code below, the final value of `🐰🐱` would be 3 because `🐰🐱` copies the value of the register pointed at `🐟🦉`.

```
🐰
🐱🐟🦉🐺🐺🍎🐰
🐱🍎🐰🐺🐺🐰🐸
🐟🐰🐱🐺🐺🐟🦉
🐺
```

#### 🦇 itr/iterate

###### Syntax: 🦇[register_name]

The `itr` instruction iterates through its contents while the value of the register is not 0. The start of the loop is the line after `itr` instruction and the end is the nearest `end` instruction.

#### 🍎 add

###### Syntax: 🍎[register_name][register_name|number]

The `add` instruction updates the value of the 1st parameter by adding its current value to the value of the 2nd parameter. The 2nd parameter is not affected by this operation.

#### 🐧 sub/subtract

###### Syntax: 🐧[register_name][register_name|number]

The `sub` instruction updates the value of the 1st parameter by subtracting its current value to the value of the 2nd parameter. The 2nd parameter is not affected by this operation.

#### 🦋 rnd/random

###### Syntax: 🦋[register_name]

The `rnd` instruction generates a random integer from 1 to 12, inclusive and stores it to the register.

#### 🐺 end

###### Syntax: 🐺

The `end` instruction marks the end of a function or an end of a loop.
