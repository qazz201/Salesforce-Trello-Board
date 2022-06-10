import {LightningElement, api} from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

import getActivityAttachments from '@salesforce/apex/KanbanBoardController.getActivityAttachments';
import createAttachment from '@salesforce/apex/DropBoxApi.uploadFile';

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

    addAttachment(event) {

        const file = event.target.files[0];
        const reader = new FileReader();
        console.log('FILEEEE__', file)

        reader.onload = async () => {

            let base64 = reader.result.split(',')[1]
            const fileData = {
                'filename': file.name,
                'base64': base64,
                'recordId': this.item.id
            }
            console.log(file, '__', fileData)
            const res = await createAttachment({activityId: this.item.id, fileName: file.name, bodyBase64: base64});
            console.log('CREATED FILE', res);
        }
        reader.readAsDataURL(file)

        // console.log(JSON.stringify(this.item))
        // const res = await getActivityAttachments({activityId: this.item.id});
        // console.log("ATTACHMENTS__", JSON.stringify(res))
        // this.dispatchEvent(new CustomEvent('addattachment', {detail: {activityId: this.item.id}}))
    }

    async handleShowAttachmentModal(event) {
        event.preventDefault();

        //this.dispatchEvent(new CustomEvent('showattachment', {detail: {activityId: this.item.id}}))
        this.showModal = true;
        this.attachments = await getActivityAttachments({activityId: this.item.id});
        console.log('ATTT____ ', this.attachments)
    }

    handleCloseAttachmentModal(event) {
        this.showModal = false;
    }
}