({
    createDropdownArea: function (component, params, helper) {
        const {sections, boardId} = params;
        $A.createComponent(
            'c:boardSection',
            {
                sections,
                boardId,
                ondropitem: component.getReference('c.handleChangeActivityType'),
                //       onshowattachment: component.getReference('c.handleShowAttachment')
            },
            function (newButton, status, errorMessage) {
                if (status === 'SUCCESS') {
                    const boardSection = component.get('v.boardSection');

                    boardSection.push(newButton);
                    component.set('v.boardSection', boardSection);
                } else if (status === 'ERROR') {
                    console.error('Error: ' + errorMessage);
                }
            }
        );
    },

    getRecords: function (component, params, helper) {
        component.set('v.showSpinner', true);
        const boardId = component.get('v.boardId');
        if (!boardId) return;

        const action = component.get('c.getBoardActivities');
        action.setParams({boardId});

        action.setCallback(this, function (response) {
            const state = response.getState();
            if (state === 'SUCCESS') {
                const {sections} = response.getReturnValue();
                component.set('v.boardSection', []);

                this.createDropdownArea(component, {sections, boardId});
            } else if (state === 'ERROR') {
                console.error(response.getError());
            }
            component.set('v.showSpinner', false);
        });

        $A.enqueueAction(action);
    },

    // createAttachmentModal: function (component, params, helper) {
    //     console.log('AURA__ createAttachmentModal_', params)
    //     $A.createComponent(
    //         'c:modal',
    //         {'aura:id': 'findableAuraId'},
    //
    //         function (newButton, status, errorMessage) {
    //             if (status === 'SUCCESS') {
    //                 const body = component.get('v.secondPanel');
    //                 console.log(status)
    //                 body.push(newButton);
    //                 component.set('v.secondPanel', body);
    //             } else if (status === 'ERROR') {
    //                 console.error('Error: ' + errorMessage);
    //             }
    //         }
    //     );
    // }
});