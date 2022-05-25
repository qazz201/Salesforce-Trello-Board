import {LightningElement, api} from 'lwc';

import {uniqueId, isEmpty, isNotEmpty} from 'c/commons'

const DRAG_ELEMENT_ID = 'dragElementId';

export default class BoardSection extends LightningElement {
    iterate = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    // dropAreas;
    someUniqueId;

    // renderedCallback() {
    //     this.dropAreas = this.template.querySelectorAll('.drop-area');
    // }

    get getUniqueId() {
        this.someUniqueId = uniqueId();
        return this.someUniqueId;
    }

    getItemById(itemId = '') {
        if (isEmpty(itemId)) return;
        return this.template.querySelector(`[data-id="${itemId}"]`);
    }

    allowDrop(event) {
        if (!event.dataTransfer.types.includes(DRAG_ELEMENT_ID.toLowerCase())) return;
        event.preventDefault();
    }

    handleDragStart(event) {
        event.dataTransfer.setData(DRAG_ELEMENT_ID, event.target.dataset.id);
    }

    handleDrop(event) {
        event.preventDefault();
        const dropItemId = event.dataTransfer.getData(DRAG_ELEMENT_ID);
        const draggedElement = this.getItemById(dropItemId);

        if (isEmpty(draggedElement)) return;

        const dragItems = [...event.currentTarget.querySelectorAll('.drag-item')];
        let isItemInserted = false;

        for (const item of dragItems) {
            const rect = item.getBoundingClientRect();
            const cord = rect.y + rect.height / 2;

            if (cord >= event.clientY) {
                event.currentTarget.insertBefore(draggedElement, item);
                isItemInserted = true;
                break;
            }
        }

        if (!isItemInserted) event.currentTarget.appendChild(draggedElement);
    }
}