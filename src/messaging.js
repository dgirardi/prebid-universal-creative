import {parseUrl} from './utils.js';
export const PREBID_EVENT = 'Prebid Event';
export const AD_RENDER_SUCCEEDED = 'adRenderSucceeded';
export const AD_RENDER_FAILED = 'adRenderFailed';

export function prebidMessenger(publisherURL, win = window) {
    const prebidDomain = (() => {
        if (publisherURL == null) {
            return null;
        }
        const parsedUrl = parseUrl(publisherURL);
        return parsedUrl.protocol + '://' + parsedUrl.host;
    })();

    return function sendMessage(message, onResponse) {
        if (prebidDomain == null) {
            throw new Error('Missing pubUrl')
        }
        message = JSON.stringify(message);
        let messagePort;
        if (onResponse == null) {
            win.parent.postMessage(message, prebidDomain);
        } else {
            const channel = new MessageChannel();
            messagePort = channel.port1;
            messagePort.onmessage = onResponse;
            win.addEventListener('message', windowListener);
            win.parent.postMessage(message, prebidDomain, [channel.port2]);
        }

        return function stopListening() {
            if (messagePort != null) {
                win.removeEventListener('message', windowListener);
                messagePort.onmessage = null;
                messagePort = null;
            }
        }

        function windowListener(ev) {
            if ((ev.origin || (ev.originalEvent && ev.originalEvent.origin)) === prebidDomain) {
                onResponse(ev);
            }
        }

    }
}

export function renderEventMessage(adId, errorInfo) {
    return Object.assign({
        adId,
        message: PREBID_EVENT,
        event: errorInfo ? AD_RENDER_FAILED : AD_RENDER_SUCCEEDED,
    }, errorInfo ? {info: errorInfo} : null)
}
