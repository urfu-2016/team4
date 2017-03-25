/* eslint quote-props: ["error", "as-needed", { "keywords": true, "unnecessary": false }] */
const assert = require('assert');
const parseQuery = require('../src/controllers/query-parser');
describe('quests', () => {
    it('test parseQuery function', () => {
        assert.deepEqual(parseQuery({
            'Model__field_name': 'value',
            'Model__opt__sort__field2': -1,
            'Model__opt__limit': 10,
            'Model__field2__include': 'includeValue',
            'AnotherModel__field_sub_name__gt': 1,
            'AnotherModel__field_sub_name2__include': 'includeValue'
        }),
            {
                'Model': {
                    find: {
                        'field.name': 'value',
                        'field2': /.*includeValue.*/
                    },
                    options: {
                        'sort': {'field2': 1},
                        'limit': 10
                    }
                },
                'AnotherModel': {
                    find: {
                        'field.sub.name': {'$gt': 1},
                        'field.sub.name2': /.*includeValue.*/
                    },
                    options: {}
                }
            });
    });
});
