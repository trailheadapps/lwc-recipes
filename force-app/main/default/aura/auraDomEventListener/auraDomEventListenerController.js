({
    handleFilterChange: function(component, event) {
        var filters = event.getParam('filters');
        component.set('v.message', filters.length > 0 ? 'Your selection: ' + filters.join() : 'No selection');
    },
});
