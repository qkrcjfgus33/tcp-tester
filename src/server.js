import $ from 'jquery';
import os from 'os';
import {
    serverStart,
    serverStop,
    sendData
} from './tcp'
import * as log from './log'

$(($)=> {
    init();

    let $serverRestart = $('#serverRestart');
    let $port = $('#port');

    $serverRestart.on('click', ()=>{
        serverStop(()=>serverStart($port.val()));
    });

    let $serverStart = $('#serverStart');

    $serverStart.on('click', ()=>serverStart($port.val()));

    let $serverStop = $('#serverStop');

    $serverStop.on('click', serverStop);

    let $serverData = $('#serverData');
    let $serverSend = $('#serverSend');

    $serverSend.on('click', ()=> sendData($serverData.val()));

    let $logClear = $('#logClear');

    $logClear.on('click', log.clear);
});

function init(){
    $('#ip').text(getAdresses().join(' 또는 '));
}

function getAdresses(){
    let interfaces = os.networkInterfaces();
    let addresses = [];
    for (let k in interfaces) {
        for (let k2 in interfaces[k]) {
            let address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }

    return addresses;
}
