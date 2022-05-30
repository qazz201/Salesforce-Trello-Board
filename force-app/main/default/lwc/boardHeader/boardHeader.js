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
        console.log('SELECTED', event.detail);
        this.selectedBoardId = event.detail;
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

}
