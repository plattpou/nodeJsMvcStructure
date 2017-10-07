# nodeJsMvcStructure
Express Web Application starting point, allows to remove all routes from the main app into a config file and provides a better model view controller organization.

Download as a zip to start building a new Express Project.

# Setup

* /config.json = App global config, all properties entered become available using global.config['property']
* /routes.json = Routes config, array of { "url" : "{express_url}", "controller" : "{controller_name}","actions" : ["get","post","put","delete"]}
         
                                         