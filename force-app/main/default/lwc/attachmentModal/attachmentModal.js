import {LightningElement, api} from 'lwc';
import getActivityAttachments from '@salesforce/apex/KanbanBoardController.getActivityAttachments';

export default class AttachmentModal extends LightningElement {
    @api attachments = [];

    handleClose() {
        this.dispatchEvent(new CustomEvent('close'))
    }

    // @api
    // async getAttachments(activityId) {
    //     this.attachments = await getActivityAttachments({activityId});
    //     console.log('AAAAA_A_A_A__A_A_A', this.attachments)
    // }

    get isEmptyAttachments(){
    return !this.attachments.length
    }
}