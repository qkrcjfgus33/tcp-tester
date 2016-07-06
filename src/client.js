import jQuery from 'jquery';
import net from 'net';
import { print } from './log'

var client    = null;
var connected = false;

jQuery(($)=> {
    let $clientIp         = $('#clientIp');
    let $clientPort       = $('#clientPort');
    let $clientConnect    = $('#clientConnect');
    let $clientDisconnect = $('#clientDisconnect');
    let $clientData       = $('#clientData');
    let $clientSend       = $('#clientSend');

    $clientConnect.on('click', ()=>connect($clientPort.val(), $clientIp.val()))
    $clientDisconnect.on('click', disconnect)
    $clientSend.on('click', ()=>sendData($clientData.val()))
})

function connect(port, address){
    if(connected){
        printTestLog('already connected');
        return;
    }

    printTestLog('connected');
    connected = true;
    client = net.connect(port, address, ()=>{
        printTestLog('connected to server!');
    });

    client.on('data', (data)=>{
        printTestLog(`get data: ${data}`);
    });

    client.on('error', (data)=>{
        printTestLog('error client!');
        connected = false;
    });

    client.on('end', (data)=>{
        printTestLog('end client!');
        connected = false;
    });

    client.on('close', ()=>{
        printTestLog('disconnected to server!');
        connected = false;
    });
}

function disconnect(){
    if(!connected){
        printTestLog('already disconnected');
        return;
    }

    client.destroy();
}

function sendData(data){
    if(!connected){
        printTestLog('not connected');
        return;
    }

    printTestLog(`send data: ${data}`);
    client.write(data);
}

function printTestLog(log){
    return print('client', log);
}
