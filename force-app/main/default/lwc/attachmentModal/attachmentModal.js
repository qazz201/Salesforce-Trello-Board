import {LightningElement, api} from 'lwc';

export default class AttachmentModal extends LightningElement {
    @api attachments = [];
    @api activityId = '';

    _showSpinner = false;

    @api
    showSpinner() {
        this._showSpinner = true;
    }

    @api
    hideSpinner() {
        this._showSpinner = false;
    }

    handleClose() {
        this.dispatchEvent(new CustomEvent('close'))
    }

    get isEmptyAttachments() {
        return !this.attachments.length
    }

    async addAttachment(event) {
        this.dispatchEvent(new CustomEvent(event.type, {detail: event.detail}));
    }
}