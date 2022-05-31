import {LightningElement} from 'lwc';

import getBoardActivities from '@salesforce/apex/KanbanBoardController.getBoardActivities';

import {isEmpty, isNotEmpty} from 'c/commons';

export default class BoardContainer extends LightningElement {

    sections = [];

    async connectedCallback() {
      //  this.sections = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];//['To Do', 'In Progress']; // await getSprintTasks();

    }

    async handleBoardSelection(event) {
        const {sections} = await getBoardActivities({boardId: event.detail.boardId});
        this.sections = sections;
        console.log(JSON.stringify(sections))
    }


    // // iterate = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
    // iterate = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    //
    // boardSections = [];
    //
    // renderedCallback() {
    //     this.boardSections = [...this.template.querySelectorAll('c-board-section')];
    // }
    //
    // handleDrop(event) {
    //     try {
    //         const {dropItemId, dropSectionId} = event.detail;
    //         const itemHtml = this.boardSections.find((section) => isNotEmpty(section.getItemById(dropItemId)));
    //         const section = this.boardSections.find((section) => isNotEmpty(section.getItemById(dropSectionId)))
    //
    //         console.log('itemHtml',itemHtml)
    //         console.log('section',section)
    //        section.addItem(itemHtml);
    //     } catch (e) {
    //         console.error(e)
    //     }
    //
    //     // this.dispatchEvent(new CustomEvent(event.type, {detail: {...event.detail}}));
    //     //
    //     // console.log('AAAA',this.template.querySelector(`#${itemId}`))
    // }
}