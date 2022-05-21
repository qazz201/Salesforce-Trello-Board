import {LightningElement, api} from 'lwc';

import {uniqueId, isEmpty} from 'c/commons'

export default class BoardSection extends LightningElement {

    dropArea;
    sectionId = uniqueId();
    itemId = uniqueId();

    renderedCallback() {
        this.dropArea = this.template.querySelector('.drop-area');
    }

    @api
    getItemById(itemId = '') {
        if (isEmpty(itemId)) return;
        return this.template.querySelector(`[data-id="${itemId}"]`);
    }

    @api
    addItem(itemToAdd) {
        this.dropArea.appendChild(itemToAdd);
    }

    get getUniqueId() {
        return uniqueId()
    }

    allowDrop(event) {
        const html = event.dataTransfer.types.includes('dragelementid');

        if (html) {
            event.preventDefault();
        }
    }

    handleDragStart(event) {
        console.log('Start_ ITEM ID', event.target.dataset.id)
        event.dataTransfer.setData('dragElementId', event.target.dataset.id);
    }

    handleDrop(event) {
        console.log('DROP')
        event.preventDefault();
        const dropItemId = event.dataTransfer.getData('dragElementId');
        const dropSectionId = this.dropArea.getAttribute('data-id');

        let div = document.createElement('div');
        div.innerHTML = `
                        SECTION ID: <b>${dropSectionId}</b> <br/> 
                        ITEM ID: <b>${dropItemId}</b> 
                        <br/><br/>`;

        this.template.querySelector('.drop-area').appendChild(div);

        this.dispatchEvent(new CustomEvent('dropelement', {detail: {dropItemId, dropSectionId}}));

    }
}