/* test commander component
 * To use add require('../cmds/test.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';

const co = require('co');
const prompt = require('co-prompt');

module.exports = function(program) {

	program
		.command('testCo')
		.version('0.0.0')
		.description('A commander command')
		.action(program => co(function* (program) {
			console.log('program: ', program);
				var ok = yield prompt('Are you sure you wish to delete? ');
				console.log(error) // this should result in stack err
				process.stdin.pause();
			}).catch(err => console.log(err.stack)));

	program
		.command('testCoWrap')
		.version('0.0.0')
		.description('A commander command')
		.action(co.wrap(function* (program) {
				console.log('program: ', program);
				var ok = yield prompt('Are you sure you wish to delete? ');
				console.log(error) // this should result in stack err
				process.stdin.pause();
			}));

};
