// import in caolan forms
const forms = require('forms');

// create some shortcuts
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

const bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

// create a function that will create a form object
const createProductForm = (categories, tags) => {
    // object in the parameter is the form definition
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }

        }),
        'cost': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [ validators.min(0), validators.regexp(/^\d+(\.\d{1,2})?$/)]
        }),
        'description':fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'quantity': fields.number({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [ validators.min(0),validators.integer()]
        }),
        'category_id': fields.string({
            label: 'Category',
            required: true,
            errorAfterField: true,
            widget: widgets.select(), // use the select dropdown
            choices: categories
        }),
        'brand_id':fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'tags': fields.string({
            required:true,
            errorAfterField:true,
            widget: widgets.multipleSelect(),
            choices:tags
        })
    })
}

const createRegistrationForm = () => {
    return forms.create({
        'username': fields.string({
            required: true,
            errorAfterField:true
        }),
        'email': fields.email({
            required:true,
            errorAfterField:true,
            widget: widgets.email(),
            validators:[validators.email()]
        }),
        'password':fields.password({
            required:true,
            errorAfterField:true,
            validators:[validators.alphanumeric()]
        }),
        'confirm_password':fields.password({
            required:true,
            errorAfterField:true,
            validators:[validators.matchField('password'),validators.minlength(8)]
        })
    })
}

const createLoginForm = () => {
    return forms.create({
        'email': fields.email({
            required:true,
            errorAfterField:true,
            widget: widgets.email(),
            validators:[validators.email()]
        }),
        'password':fields.password({
            required:true,
            errorAfterField:true,
            validators:[validators.alphanumeric()]
        })
    })
}


module.exports = {createProductForm, createRegistrationForm, createLoginForm, bootstrapField};