import {LightningElement, api, track} from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

import getActivityAttachments from '@salesforce/apex/KanbanBoardController.getActivityAttachments';
import createAttachment from '@salesforce/apex/DropBoxApi.uploadFile';

export default class BoardItem extends NavigationMixin(LightningElement) {
    @api item = {};

    attachmentModal;
    attachments = [];
    showModal = false;
    _showSpinner = false;

    renderedCallback() {
        this.attachmentModal = this.template.querySelector('c-attachment-modal');
    }

    async addAttachmentFromModal(event) {
        const attachmentModal = this.template.querySelector('c-attachment-modal');
        attachmentModal?.showSpinner();

        await this.addAttachment(event);
        this.attachments = await getActivityAttachments({activityId: this.item.id});

        attachmentModal?.hideSpinner();
    }

    async addAttachment(event) {
        this._showSpinner = true;
        const {bodyBase64, fileName} = event.detail;

        const isSuccess = await createAttachment({
            activityId: this.item.id, fileName, bodyBase64
        });

        if (isSuccess) {
            this.item = {...this.item, attachments: this.item.attachments + 1};
        }

        this._showSpinner = false;
    }

    showActivityDetails(e) {
        e.preventDefault();

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.item.id, actionName: 'view'
            }
        });
    }

    async handleShowAttachmentModal(event) {
        event.preventDefault();

        this.showModal = true;
        this.attachments = await getActivityAttachments({activityId: this.item.id});
    }

    handleCloseAttachmentModal() {
        this.showModal = false;
    }

    get attachmentClassName() {
        if (this.item.attachments > 0) return 'attachment-has-count';
        return;
    }
}