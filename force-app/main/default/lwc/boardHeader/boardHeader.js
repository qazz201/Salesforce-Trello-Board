import {LightningElement, wire} from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

import getBoards from '@salesforce/apex/KanbanBoardController.getBoards';


export default class BoardHeader extends NavigationMixin(LightningElement) {
    boards = [];
    selectedBoardId = '';

    async getAvailableBoards() {
        this.$lookup?.showSpinner();

        const boards = await getBoards();
        this.boards = boards.map((board) => {
            return {label: board.Name, value: board.Id}
        });

        this.$lookup?.hideSpinner();
        console.log(this.boards)
    }

    handleSelect(event) {
        this.selectedBoardId = event.detail.value;
        this.eventDispatcher('select', {boardId: this.selectedBoardId});
    }

    navigateToCreateNewBoard() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'KanbanBoard__c',
                actionName: 'new'
            },
            state: {
                navigationLocation: 'RELATED_LIST'
            }
        });
    }

    get $lookup() {
        return this.template.querySelector('c-lookup');
    }

    eventDispatcher(eventName = '', detail = {}) {
        this.dispatchEvent(new CustomEvent(eventName, {detail}));
    }
}
