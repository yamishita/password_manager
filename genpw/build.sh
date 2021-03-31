#!/bin/bash
gcc -fpic -o consDict.o -c consDict.c
gcc -fpic -o genPw.o -c genPw.c
gcc -fpic -I/usr/include/python3.6m -o genPassWrapper.o -c genPassWrapper.c
gcc -shared consDict.o genPw.o genPassWrapper.o -o genPassModule.so
