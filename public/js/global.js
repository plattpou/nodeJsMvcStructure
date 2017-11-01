let layout = {

    webRoot : '',

    initFormElements : function () {

        // noinspection JSUnresolvedFunction, JSCheckFunctionSignatures
        $('body').on('keyup','select,input,textarea',function () {
            // noinspection JSUnresolvedFunction
            $(this).attr('value',this.value);
        }).find('select,input,textarea').each(function () {
            // noinspection JSUnresolvedFunction
            $(this).attr('value',this.value);
        });

    },


    init: function (webRoot) {
        this.webRoot = webRoot;
        this.initFormElements();
    }
};
