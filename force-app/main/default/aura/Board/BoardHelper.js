({
    createDropdownArea: function (component, params, helper) {
        const {sections, boardId} = params;
        $A.createComponent(
            'c:boardSection',
            {
                sections,
                boardId,
                ondropitem: component.getReference('c.handleChangeActivityType'),
            },
            function (newButton, status, errorMessage) {
                if (status === 'SUCCESS') {
                    const body = component.get('v.body');

                    body.push(newButton);
                    component.set('v.body', body);
                } else if (status === 'ERROR') {
                    console.error('Error: ' + errorMessage);
                }
            }
        );
    },

    getRecords: function (component, params, helper) {
        const boardId = component.get('v.boardId');
        if (!boardId) return;

        const action = component.get("c.getBoardActivities");
        action.setParams({boardId});

        action.setCallback(this, function (response) {
            const state = response.getState();
            if (state === "SUCCESS") {
                const {sections} = response.getReturnValue();
                component.set("v.body", []);

                this.createDropdownArea(component, {sections, boardId});
            } else if (state === "ERROR") {
                console.error(response.getError());
            }
        });

        $A.enqueueAction(action);
    },
});