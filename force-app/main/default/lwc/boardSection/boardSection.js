import {LightningElement, api} from 'lwc';

import {uniqueId, isEmpty, isNotEmpty} from 'c/commons'

export default class BoardSection extends LightningElement {
    iterate = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    dropAreas;

    // sectionId = uniqueId();
    // itemId = uniqueId();
    someUniqueId;

    renderedCallback() {
        this.dropAreas = this.template.querySelectorAll('.drop-area');
    }


    getItemById(itemId = '') {
        if (isEmpty(itemId)) return;
        return this.template.querySelector(`[data-id="${itemId}"]`);
    }

    //
    // @api
    // addItem(itemToAdd) {
    //     this.dropArea.appendChild(itemToAdd);
    // }

    addItem(itemToAdd) {
        this.dropArea.appendChild(itemToAdd);
    }

    get getUniqueId() {
        this.someUniqueId = uniqueId();
        return this.someUniqueId;
    }

    allowDrop(event) {
        event.preventDefault();
        const html = event.dataTransfer.types.includes('dragelementid');
        // console.log('DROP TARGET__', event)

        if (html) {
            event.preventDefault();
        }
    }

    handleDragStart(event) {
        console.log('Start_ ITEM ID', event.target.dataset.id)
        event.dataTransfer.setData('dragElementId', event.target.dataset.id);
    }

    // handleDrop(event) {
    //     console.log('DROP')
    //     event.preventDefault();
    //     const dropItemId = event.dataTransfer.getData('dragElementId');
    //     const dropSectionId = this.dropArea.getAttribute('data-id');
    //
    //     let div = document.createElement('div');
    //     div.innerHTML = `
    //                     SECTION ID: <b>${dropSectionId}</b> <br/>
    //                     ITEM ID: <b>${dropItemId}</b>
    //                     <br/><br/>`;
    //
    //     this.template.querySelector('.drop-area').appendChild(div);
    //
    //     this.dispatchEvent(new CustomEvent('dropelement', {detail: {dropItemId, dropSectionId}}));
    //
    // }

    handleDrop(event) {
        try {

            event.preventDefault();
            const dropItemId = event.dataTransfer.getData('dragElementId');
            const draggedElement = this.template.querySelector(`[data-id="${dropItemId}"]`);
            event.currentTarget.appendChild(draggedElement);

        } catch (e) {
            console.error(e)
        }
    }
}