import net from 'net';
import { print } from './log'

var server      = null;
let listened    = false;
let clients     = [];

export function serverStart(port){
    if(listened){
        serverPrintLog('already create server');
        return;
    }

    serverPrintLog('create server');

    listened = true;
    server = net.createServer((client)=>{
        let id = clients.length;
        let logTitle = `client ${id}`;
        let printLog = ((log) => print(logTitle, log));

        printLog(`client connected id:${clients.length}`);
        clients.push({
            client, id, logTitle
        });

        client.on('data', (data)=>{
            printLog(`get data: ${data} (client num: ${clients.length})`);
        });

        client.on('error', () => {
            clients = clients.filter((_client) => _client.id !== id );
            printLog('client error');
        });

        client.on('close', () => {
            clients = clients.filter((_client) => _client.id !== id );
            printLog('client close');
        });

        client.on('end', () => {
            clients = clients.filter((_client) => _client.id !== id );
            printLog('client disconnected');
        });
    });

    server.on('error', (error)=>{
        serverPrintLog('server error');
        serverPrintLog(error.message);
        serverPrintLog('Will soon be restarted');
        setTimeout(() => {
            try{
                serverStop(()=>serverStart(port));
            }catch(err){

            }finally{
                serverStart(port);
            }
        }, 1000);
    });

    server.on('close', ()=>{
        serverPrintLog('server closed');
        listened = false;
    });

    server.listen(port, ()=>{
        serverPrintLog(`server listen. port: ${port}`);
    });
}

export function serverStop(callback){
    if(!listened){
        serverPrintLog('not create server');
        callback();
        return;
    }

    server.close(callback);
    server = null;
}

export function sendData(data){
    if(!listened){
        serverPrintLog('not create server');
        return;
    }

    if(clients.length == 0){
        serverPrintLog('No clients are connected.');
        return;
    }

    clients.forEach(({client, logTitle})=>{
        print(logTitle, `send data: ${data}`);
        client.write(data);
    })
}


function serverPrintLog(log){
    print('server', log);
}
