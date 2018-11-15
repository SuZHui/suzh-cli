// 注入joi 用于验证schema
exports.createSchema = fn => fn(require('joi'));

exports.validate = (obj, schema, cb) => {
    require('joi').validate(obj, schema, {}, err => {
        if (err) {
            cb(err.message);

            process.exit(1);
        }
    })
}

exports.validateSync = (obj, schema) => {
    const result = require('joi').validate(obj, schema);
    if (result.error) {
        throw result.error;
    }
}