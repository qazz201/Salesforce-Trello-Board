import {LightningElement, api} from 'lwc';

import {uniqueId, isEmpty, isNotEmpty} from 'c/commons'

const DRAG_ELEMENT_ID = 'dragElementId';
const CLASS_DRAGGED = 'dragged';
const HORIZONTAL_SEPARATOR_TAG = 'hr';


export default class BoardSection extends LightningElement {
    iterate = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    dropAreas;
    someUniqueId;

    renderedCallback() {
        this.dropAreas = this.template.querySelectorAll('.drop-area');
    }

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
        this.removeHorizontalSeparatorOnDrag([...this.dropAreas]);

        const itemToInsertBefore = this.getItemToInsertBefore([...event.currentTarget.querySelectorAll('.drag-item')], event.clientY);
        event.currentTarget.insertBefore(document.createElement(HORIZONTAL_SEPARATOR_TAG), itemToInsertBefore);
    }


    handleDragStart(event) {
        event.dataTransfer.setData(DRAG_ELEMENT_ID, event.target.dataset.id);
        event.currentTarget.classList.add(CLASS_DRAGGED);
    }

    handleDragEnd() {
        this.removeHorizontalSeparatorOnDrag(this.dropAreas);
        this.dropAreas.forEach(area => area.querySelector(`.${CLASS_DRAGGED}`)?.classList.remove(CLASS_DRAGGED));
    }

    handleDrop(event) {
        event.preventDefault();

        const dropItemId = event.dataTransfer.getData(DRAG_ELEMENT_ID);
        const draggedElement = this.getItemById(dropItemId);

        if (isEmpty(draggedElement)) return;
        const itemToInsertBefore = this.getItemToInsertBefore([...event.currentTarget.querySelectorAll('.drag-item')], event.clientY);

        if (itemToInsertBefore) {
            event.currentTarget.insertBefore(draggedElement, itemToInsertBefore);
        } else {
            event.currentTarget.appendChild(draggedElement);
        }
    }

    removeHorizontalSeparatorOnDrag(dropSections = []) {
        dropSections.forEach(section => {
            section.querySelectorAll(HORIZONTAL_SEPARATOR_TAG).forEach(elem => elem.remove());
        });
    }

    getItemToInsertBefore(dragItems = [], clientY = 0) {
        if (isEmpty(dragItems)) return;

        for (const item of dragItems) {
            const rect = item.getBoundingClientRect();
            const cord = rect.y + rect.height / 2;

            if (cord >= clientY) return item
        }

        return;
    }
}