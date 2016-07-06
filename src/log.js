import $ from 'jquery';

export function print(title, log){
    let $log = $('<div></div>');
    $log.text(`${title} - ${log}`);
    $('#logContainer').append($log).scrollTop(100000);
}

export function clear(title, log){
    $('#logContainer').html('');
}
