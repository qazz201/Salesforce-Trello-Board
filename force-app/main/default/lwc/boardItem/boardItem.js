import {LightningElement, api, track} from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

import getActivityAttachments from '@salesforce/apex/KanbanBoardController.getActivityAttachments';
import createAttachment from '@salesforce/apex/DropBoxApi.uploadFile';

export default class BoardItem extends NavigationMixin(LightningElement) {
    @api item = {};

    attachments = [];
    showModal = false;
    _showSpinner = false;

    showActivityDetails(e) {
        e.preventDefault();

        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.item.id,
                actionName: 'view'
            }
        });
    }

    addAttachment(event) {
        try {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = async () => {
                this._showSpinner = true;
                const base64 = reader.result.split(',')[1];

                const isSuccess = await createAttachment({
                    activityId: this.item.id,
                    fileName: file.name,
                    bodyBase64: base64
                });

                if (isSuccess) {
                    this.item = {...this.item, attachments: this.item.attachments + 1};
                }

                this._showSpinner = false;
                console.log('CREATED FILE isSuccess', isSuccess);
            }

            reader.readAsDataURL(file)
        } catch (error) {
            console.error(error);
            this._showSpinner = false;
        }
    }

    async handleShowAttachmentModal(event) {
        event.preventDefault();

        this.showModal = true;
        this.attachments = await getActivityAttachments({activityId: this.item.id});
        console.log('ATTT____ ', this.attachments)
    }

    handleCloseAttachmentModal() {
        this.showModal = false;
    }
}