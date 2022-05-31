import {LightningElement, api} from 'lwc';

import {uniqueId, isEmpty, isNotEmpty} from 'c/commons'

const DRAG_ELEMENT_ID = 'dragElementId';
const CLASS_DRAGGED = 'dragged';
const HORIZONTAL_SEPARATOR_TAG = 'hr';

export default class BoardSection extends LightningElement {
    @api sections = [];

    // @api set sections(value) {
    //     this._sections = value;
    //     this.sectionItems = value.reduce((aggregator, section) => {
    //         const {sectionItems} = section;
    //         if (isNotEmpty(sectionItems)) aggregator = [...aggregator, sectionItems];
    //         return aggregator
    //     }, []);
    // }
    //
    // get sections() {
    //     return this._sections;
    // }
    //
    // sectionItems = [];
    // _sections = [];

    $dropContainers = [];
    $currentDropContainer;
    $currentDraggedElement;
    horizontalSeparator = document.createElement(HORIZONTAL_SEPARATOR_TAG);
    someUniqueId;

    renderedCallback() {
        this.$dropContainers = [...this.template.querySelectorAll('.drop-container')];
    }

    get getUniqueId() {
        this.someUniqueId = uniqueId();
        return this.someUniqueId;
    }

    getItemById(itemId = '') {
        if (isEmpty(itemId)) return;
        return this.template.querySelector(`[data-id="${itemId}"]`);
    }

    handleDragOver(event) {
        const {currentTarget: dropContainer, dataTransfer, clientY} = event;
        if (!dataTransfer.types.includes(DRAG_ELEMENT_ID.toLowerCase())) return;
        event.preventDefault();

        const itemToInsertBefore = this.getItemToInsertBefore(this.getArrayDragItemsFromDropContainer(dropContainer), clientY);
        dropContainer.insertBefore(this.horizontalSeparator, itemToInsertBefore);
    }

    handleDragStart(event) {
        const {currentTarget, dataTransfer} = event;

        dataTransfer.setData(DRAG_ELEMENT_ID, event.target.dataset.id);
        currentTarget.classList.add(CLASS_DRAGGED);
        this.$currentDraggedElement = currentTarget;
    }

    handleDragEnd() {
        this.removeHorizontalSeparatorInDropContainers(this.$dropContainers);

        // if (this.$currentDropContainer) {
        //     this.$currentDropContainer.querySelector(`.${CLASS_DRAGGED}`)?.classList.remove(CLASS_DRAGGED);
        // } else {
        this.removeDraggedClassNameInDropContainers(this.$dropContainers);
        // }
    }

    handleDrop(event) {
        event.preventDefault();
        const {currentTarget: dropContainer, dataTransfer, clientY} = event;
        this.$currentDropContainer = dropContainer;

        const dropItemId = dataTransfer.getData(DRAG_ELEMENT_ID);
        const draggedElement = this.$currentDraggedElement || this.getItemById(dropItemId);

        if (isEmpty(draggedElement)) return;
        const itemToInsertBefore = this.getItemToInsertBefore(this.getArrayDragItemsFromDropContainer(dropContainer), clientY);

        dropContainer.insertBefore(draggedElement, itemToInsertBefore);
    }

    getArrayDragItemsFromDropContainer(dropContainer) {
        if (isEmpty(dropContainer)) return;
        return [...dropContainer.querySelectorAll('.drag-item')];
    }

    removeHorizontalSeparatorInDropContainers(dropContainers = []) {
        dropContainers.forEach(section => {
            section.querySelectorAll(HORIZONTAL_SEPARATOR_TAG).forEach(elem => elem.remove());
        });
    }

    removeDraggedClassNameInDropContainers(dropContainers = []) {
        dropContainers.forEach((section) => section.querySelector(`.${CLASS_DRAGGED}`)?.classList.remove(CLASS_DRAGGED));
    }

    getItemToInsertBefore(dragItems = [], clientY = 0) {
        if (isEmpty(dragItems)) return;

        for (const item of dragItems) {
            const rect = item.getBoundingClientRect();
            const cord = rect.y + rect.height / 2;

            if (!item.classList.contains(CLASS_DRAGGED) && cord >= clientY) return item
        }
    }
}