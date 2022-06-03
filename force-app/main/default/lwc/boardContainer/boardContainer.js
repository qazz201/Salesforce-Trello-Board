import {LightningElement} from 'lwc';
import {subscribe, unsubscribe, onError} from 'lightning/empApi';

import getBoardActivities from '@salesforce/apex/KanbanBoardController.getBoardActivities';
import updateActivityType from '@salesforce/apex/KanbanBoardController.updateActivityType';

import {isEmpty, isNotEmpty} from 'c/commons';

const CHANNEL_NAME = '/event/RefreshKanbanBoard__e';

export default class BoardContainer extends LightningElement {
    // sections = [];
    // boardId = '';
    // $boardSection;
    // subscription = {};
    //
    // renderedCallback() {
    //     this.$boardSection = this.template.querySelector('c-board-section');
    // }
    //
    // connectedCallback() {
    //     subscribe(CHANNEL_NAME, -1, this.getRecords).then(response => {
    //         this.subscription = response;
    //     });
    //     onError(error => {
    //         console.error('Server Error--->' + error);
    //     });
    // }
    //
    // disconnectedCallback() {
    //     unsubscribe(this.subscription);
    // }
    //
    // async handleBoardSelection(event) {
    //     const {boardId} = event.detail;
    //     this.boardId = boardId;
    //     await this.getRecords(boardId);
    // }
    //
    // // async foo() {
    // //     let boardId = prompt("Please enter your name", "a00IY000001NRaVYAW");
    // //     if (boardId != null) {
    // //         this.boardId = boardId;
    // //         await this.getRecords(boardId);
    // //     }
    // // }
    //
    // getRecords = async () => {
    //
    //     this.$boardSection?.showSpinner();
    //     try {
    //         if (!this.boardId) return [];
    //         const {sections} = await getBoardActivities({boardId: this.boardId});
    //         this.sections = sections;
    //     } catch (err) {
    //         console.error(err);
    //         return []
    //     }
    //     this.$boardSection?.hideSpinner();
    // }
    //
    // handleChangeActivityType(event) {
    //     const {activityTypeId, activityId} = event.detail;
    //     // updateActivityType({activityTypeId, activityId});
    //
    //     console.log('activityId', activityId);
    //     console.log('activityTypeId', activityTypeId);
    // }
}