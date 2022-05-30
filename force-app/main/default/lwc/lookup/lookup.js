import {LightningElement, api} from 'lwc';


export default class Lookup extends LightningElement {
    @api value = '';
    @api options = [];

    isSpinnerActive = false;

    @api
    showSpinner() {
        this.isSpinnerActive = true;
    }

    @api
    hideSpinner() {
        this.isSpinnerActive = false;
    }

    handleFocus() {
        this.eventDispatcher('focus');
    }

    handleChange(event) {
        this.value = event.detail.value;
        this.eventDispatcher('change', event.detail.value);
    }

    eventDispatcher(eventName = '', detail = {}) {
        this.dispatchEvent(new CustomEvent(eventName, {detail}));
    }

}