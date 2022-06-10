import {LightningElement, api} from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

import {uniqueId, isEmpty, isNotEmpty} from 'c/commons'

const DRAG_ELEMENT_ID = 'dragElementId';
const CLASS_DRAGGED = 'dragged';
const HORIZONTAL_SEPARATOR_TAG = 'hr';

export default class BoardSection extends NavigationMixin(LightningElement) {
    @api sections = [];
    @api boardId = '';

    _showSpinner = false;
    $dropContainers = [];
    $currentDropContainer;
    $currentDraggedElement;
    horizontalSeparator = document.createElement(HORIZONTAL_SEPARATOR_TAG);
    someUniqueId;

    @api showSpinner() {
        this._showSpinner = true;
    }

    @api hideSpinner() {
        this._showSpinner = false;
    }

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
        try {
            this.removeHorizontalSeparatorInDropContainers(this.$dropContainers);
            this.removeDraggedClassNameInDropContainers(this.$dropContainers);

            this.dispatchEvent(new CustomEvent('dropitem', {
                detail: {
                    activityTypeId: this.$currentDropContainer?.dataset.dropContainerId,
                    activityId: this.$currentDraggedElement?.dataset.dragItemId,
                }
            }))
        } catch (e) {
            console.error(e)
        }
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

    handleCreateNewActivityType(event) {

        console.log('Section Id: ' + this.boardId);

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'BoardActivityType__c',
                actionName: 'new'
            },
            state: {
                defaultFieldValues: `Board__c=${this.boardId}`,
                navigationLocation: 'RELATED_LIST'
            }
        })

    }

    handleCreateNewActivityItem(event) {
        const sectionId = event.target.dataset.sectionId;
        console.log('Section Id: ' + sectionId);

        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'BoardActivity__c',
                actionName: 'new'
            },
            state: {
                defaultFieldValues: `ActivityType__c=${sectionId}`,
                navigationLocation: 'RELATED_LIST'
            }
        });
    }

    // handleAddAttachment(event) {
    //     console.log('handleAddAttachment', event, JSON.stringify(event.detail))
    //     this.dispatchEvent(new CustomEvent(event.type, {detail: event.detail}));
    // }
    //
    // handleShowAttachment(event) {
    //     console.log('handleShowAttachment', event, JSON.stringify(event.detail))
    //     this.dispatchEvent(new CustomEvent(event.type, {detail: event.detail}));
    // }

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