({
    handleElementDrop: function (component, event, helper) {

        const {itemId, sectionId} = event.getParams();
        console.log('AURA___', itemId, sectionId)
    },
});