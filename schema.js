const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value: clean })
                return clean;
            }
        }
    }
});

const joi = BaseJoi.extend(extension);

module.exports.communitySchema = joi.object({
    community: joi.object({
        name: joi.string().required().escapeHTML(),
    }).required(),
});

module.exports.postSchema = joi.object({
    post: joi.object({
        title: joi.string().required().escapeHTML(),
        body: joi.string().required().escapeHTML()
    }).required()
})

module.exports.commentSchema = joi.object({
    comment: joi.object({
        body: joi.string().required().escapeHTML()
    }).required()
})