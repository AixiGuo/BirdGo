#!/usr/bin/env python

import socket


TCP_IP = '127.0.0.1'
TCP_PORT = 5005
BUFFER_SIZE = 1024
MESSAGE = "Hello, World!"

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((TCP_IP, TCP_PORT))
 
 
while 1:
    dat = input(">")
    edat=dat.encode()
    s.send(edat)

    dat = s.recv(BUFFER_SIZE)
    print("Server >"+dat.decode())

s.close()