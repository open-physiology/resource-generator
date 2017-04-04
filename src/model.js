/**
 * Created by Natallia on 4/4/2017.
 */
var $ = require('jQuery');
var modelFactory = require('open-physiology-model/dist/open-physiology-model.js');

function toCamelCase(str) {
    return str.replace(/\s(.)/g, function (l) {
        return l.toUpperCase();
    }).replace(/\s/g, '').replace(/^(.)/, function (l) {
        return l.toLowerCase();
    });
}

function ajaxBackend() {
    /* a way for test suites to register the environment to these mock-handlers */
    let environment, ajax, baseURL;
    function register({environment: e, ajax: ajx, baseURL: burl}) {
        environment = e;
        ajax        = (...args) => Promise.resolve(ajx(...args));
        baseURL     = burl;
    }

    /* the interface to hand to the library when instantiating a module */
    const backend = {
        commit_new({values}) {
            let cls = model[values.class];
            let classPath = cls.isResource ? toCamelCase(cls.plural) : cls.name;
            console.log("Committing value", JSON.stringify(values));
            return ajax({
                url:    `${baseURL}/${classPath}`,
                method: 'POST',
                contentType: 'application/json',
                data:   JSON.stringify(values)
            });
        },
        commit_edit({entity, newValues}) {
            let cls = entity.constructor;
            let classPath = cls.isResource ? toCamelCase(cls.plural) : cls.name;
            return ajax({
                url:    entity.href ||
                `${baseURL}/${classPath}/${entity.id}`,
                method: 'POST',
                contentType: 'application/json',
                data:   JSON.stringify(newValues)
            });
        },
        commit_delete({entity}) {
            let cls = entity.constructor;
            let classPath = cls.isResource ? toCamelCase(cls.plural) : cls.name;
            return ajax({
                url:    entity.href ||
                `${baseURL}/${classPath}/${entity.id}`,
                method: 'DELETE',
                contentType: 'application/json'
            });
        },
        load(addresses, options = {}) {
            //TODO: this is a quick implementation for testing, needs rewriting to stack requests for the same entity class
            (async function() {
                let responses = [];
                await Promise.all(Object.values(addresses).map(address => {
                        let cls = address.class;
                let classPath = cls.isResource ? toCamelCase(cls.plural) : cls.name;
                const href2Id = (href) => Number.parseInt(href.substring(href.lastIndexOf("/") + 1));
                let id = href2Id(address.href);
                ajax({
                    url:    `${baseURL}/${classPath}/${id}`,
                    method: 'GET',
                    contentType: 'application/json'
                }).then((res) => {
                    responses.push(res);
            }).catch((e) => {
                    console.log("Error in load ", address);
                throw e;
            });
            }));
                return responses;
            })();
        },
        loadAll(cls, options = {}) {
            return ajax({
                url:    `${baseURL}/${cls.isResource ? cls.plural : cls.name}`,
                method: 'GET',
                contentType: 'application/json'
            })
        }
    };

    return { backend, register };
}

let {backend, register} = ajaxBackend();

export const modelRef = modelFactory(backend);
register({
    environment: modelRef,
    baseURL:     'http://open-physiology.org:8880',
    ajax:        $.ajax
});

export const model = modelRef.classes;
window.module = modelRef;
