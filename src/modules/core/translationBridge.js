/**
 * Small DOM-based bridge for cooperating with other userscripts.
 *
 * Userscripts may run in isolated JavaScript worlds, so a DOM attribute and a
 * DOM event are used instead of a property on window.
 */

export const TRANSLATION_STATE_ATTRIBUTE = 'data-qing-web-translate-state';
export const TRANSLATION_STATE_EVENT = 'qing-web-translate:state';

export const TRANSLATION_STATES = Object.freeze({
    INITIALIZING: 'initializing',
    TRANSLATING: 'translating',
    IDLE: 'idle',
});

export function setTranslationState(state) {
    if (document.documentElement) {
        document.documentElement.setAttribute(TRANSLATION_STATE_ATTRIBUTE, state);
    }

    // Do not put DOM nodes in detail. This keeps the bridge safe across
    // userscript sandboxes and lets consumers read the state from the marker.
    document.dispatchEvent(new CustomEvent(TRANSLATION_STATE_EVENT));
}
