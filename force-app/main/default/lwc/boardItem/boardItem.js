import {LightningElement, api} from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

import getActivityAttachments from '@salesforce/apex/KanbanBoardController.getActivityAttachments';

export default class BoardItem extends NavigationMixin(LightningElement) {
    @api item = {};

    attachments = [];
    showModal = false;

    showActivityDetails(e) {
        e.preventDefault();

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.item.id,
                actionName: 'view'
            },
            state: {
                navigationLocation: 'RELATED_LIST'
            }
        });
    }

    async addAttachment(event) {
        // console.log(JSON.stringify(this.item))
        // const res = await getActivityAttachments({activityId: this.item.id});
        // console.log("ATTACHMENTS__", JSON.stringify(res))
        this.dispatchEvent(new CustomEvent('addattachment', {detail: {activityId: this.item.id}}))
    }

    async handleShowAttachmentModal(event) {
        event.preventDefault();

        //this.dispatchEvent(new CustomEvent('showattachment', {detail: {activityId: this.item.id}}))
        this.showModal = true;
        this.attachments = await getActivityAttachments({activityId: this.item.id});
        console.log('ATTT____ ',this.attachments)
        //await this.template.querySelector('c-attachment-modal')?.getAttachments(this.item.id);
    }

    handleCloseAttachmentModal(event) {
        this.showModal = false;
    }
}