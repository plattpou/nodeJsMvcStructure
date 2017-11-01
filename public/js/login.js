let login = {

    init: function (config) {
        console.log(config);

        // noinspection JSUnresolvedFunction
        $('.login-form').unbind('submit').submit(function (event) {

            event.stopPropagation();
            event.preventDefault();

            let form = $(this);
            $.ajax({
                url : config['webRoot'] + "/login",
                type: 'post',
                data : form.serialize()
            }).done(function (response) {
                console.log(response);
            });


        });

    }
};