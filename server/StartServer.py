import socket
import _thread as thread
import time
import csv 

locker = thread.allocate_lock() 
class OneConnect: 

    def __init__(self,socket,ip):
        global clients
        self.socket=socket
        self.ip = ip
        self.isRun=True
        self.buff=[]
         
        thread.start_new_thread(self.handle_client ,(self.socket,))

    def handle_client(self,client_socket):
        global locker

        while True:
            try:
                data = client_socket.recv(1024)
                if not data: break
                data = data.decode()
                print('Client says: ' + data) 

                cmds=data.split(' ')

                if(len(cmds)<1):
                    self.ACK(0) 
                    continue

                if(cmds[0]=='Hello'):
                    self.ACK(1)
                    continue
                if(cmds[0]=='Report'):
                    if(len(cmds)<5):
                        self.ACK(0)
                        continue
                    with locker:
                        self.buff.append({'name':cmds[1],
                                        'positionX':cmds[2],
                                        'positionY':cmds[3],
                                        'possibility':cmds[4],
                                        'time':cmds[5]
                        })


                    self.ACK(1)
                    continue
                self.ACK(0)
            except:
                print("Close Client "+str(self.ip)) 
                self.isRun=False
                client_socket.close()
                
                with locker:
                    clients.remove(self)
                
                break


    def ACK(self,value):
        self.socket.send(('ACK '+str(value)).encode())
#################################################

clients = []
def StartConnection():
    
    while True:
        client_socket, addr = s.accept()
        print('Connect from: '+str(addr))

        one=OneConnect(client_socket,addr)
        clients.append(one)
################################################
def Timer(): 
    enable=True

    with open('database.csv', mode='r') as csv_file:  
        readCSV = csv.reader(csv_file, delimiter=',')
    if(readCSV.line_num==0):
        with open('database.csv', mode='w') as csv_file: 
            fieldnames = ['Name', 'Latitude', 'Longtitude','Possibility','Time']
            writer = csv.DictWriter(csv_file, fieldnames=fieldnames) 
            writer.writeheader()


    while(enable):
        time.sleep(5)
        with locker:
            with open('database.csv', mode='a') as csv_file: 
                writer = csv.writer(csv_file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

                for one in clients: 
                    dat = one.buff
                    pack = []
                    for oneDat in dat:
                        
                        pack = []
                        for oneStr in oneDat:
                            pack.append(oneDat[oneStr])
                        writer.writerow(pack) 
                    
                    one.buff=[]
          

################################################
host = '127.0.0.1'
port = 5005

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
print('Socket Ready...')

s.bind((host, port))
print('Bind Ready...')

print('Listening...')
s.listen(1)

thread.start_new_thread(StartConnection)
thread.start_new_thread(Timer)
while 1:
    cmd = input("CMD:")
    if(cmd == 'quit'):
        break

s.close() 