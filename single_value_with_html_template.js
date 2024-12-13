looker.plugins.visualizations.add({
    options: {
        html_template: {
            type: "string",
            label: "HTML Template",
            default: `{{ value }}`,
            iframe_template: `<iframe src="{{ value }}" width=100% height=800px>`
        }
    },

    create: function(element, config) {},

    updateAsync: function(data, element, config, queryResponse, details, doneRendering) {
        this.clearErrors();

        const firstRow = data[0];
        const qFields = queryResponse.fields;

        if (qFields.dimension_like.length === 0 &&
            qFields.measure_like.length === 0) {
            this.addError({
                title: `No visible fields`,
                message: `At least one dimension, measure or table calculation needs to be visible.`
            })
        }

        const firstCell = firstRow[qFields.dimension_like.length > 0 ? qFields.dimension_like[0].name : qFields.measure_like[0].name];

        const htmlForCell = LookerCharts.Utils.filterableValueForCell(firstCell);
        const htmlTemplate = config && config.html_template || this.options.html_template.default;

        const htmlFormatted = htmlTemplate.replace(/{{.*}}/g, htmlForCell);

        element.innerHTML = htmlFormatted;

        doneRendering();
    }
});
