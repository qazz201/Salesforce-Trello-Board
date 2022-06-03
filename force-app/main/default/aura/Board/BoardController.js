({
    doInit: function (component, event, helper) {
        const CHANNEL_NAME = '/event/RefreshKanbanBoard__e';
        const empApi = component.find('empApi');

        empApi.subscribe(CHANNEL_NAME, -1, $A.getCallback(eventReceived => {
            console.log('Received event ', JSON.stringify(eventReceived));
            helper.getRecords(component);
        }));

        // Need to unsubscribe from event!

        // .then(subscription => {
        //     // Subscription response received.
        //     // We haven't received an event yet.
        //     console.log('Subscription request sent to: ', subscription.channel);
        //     // Save subscription to unsubscribe later
        //     component.set('v.subscription', subscription);
        // });
    },

    handleBoardSelection: function (component, event, helper) {
        const {boardId} = event.getParams();
        component.set('v.boardId', boardId);
        helper.getRecords(component);
    },

    handleCreateNewBoard: function (component, event, helper) {
        event.preventDefault();
        const navService = component.find("navService");
        const pageReference = {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'KanbanBoard__c',
                actionName: 'new'
            },
            state: {
                navigationLocation: 'RELATED_LIST'
            }
        };
        navService.navigate(pageReference);
    },

    handleChangeActivityType: function (component, event, helper) {
        const {activityTypeId, activityId} = event.getParams();

        console.log('AURA___activityId', activityId);
        console.log('AURA___activityTypeId', activityTypeId);

        const action = component.get("c.updateActivityType");
        action.setParams({activityTypeId, activityId});
        $A.enqueueAction(action);
    },
});