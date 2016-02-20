/* list commander component
 * To use add require('../cmds/list.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';

const _ = require('lodash');
const co = require('co');
const prompt = require('co-prompt');

module.exports = (program, cloudinary) => {

	function* listResources(program) {
		// Extract params -  a little dirty but we pull out all options from `program`
		const params = _.pick(program, program.options.map(opt => opt.long.replace('--', '')));
		params.type = 'upload'; // Required param when filtering images (by prefix)

		console.log('Fetching images with params:', params);
		return cloudinary.api.resources(params).catch(err => { console.error(err); });
	}

	function onError(err) {
	  // log any uncaught errors
	  // co will not throw any errors you do not handle!!!
	  // HANDLE ALL YOUR ERRORS!!!
	  console.error(err.stack);
	}

	program
		.command('list')
		.option('--prefix <value>', 'Optional. Find all resources with a public ID that starts with the given prefix.')
		.option('--public_ids <value>', 'Optional. (String, comma-separated list of public IDs). List resources with the given public IDs (up to 100).')
		.option('--max_results <number>', 'Optional. Max number of resources to return. Default=10. Maximum=500.')
		.option('--next_cursor <value>', 'Optional. When a listing request has more results to return than max_results, the next_cursor value is returned as part of the response. You can then specify this value as the next_cursor parameter of the following listing request.')
		.option('--start_at <value>', 'Optional. (Timestamp string). List resources that were created since the given timestamp. Supported if no prefix or public IDs were specified.')
		.option('--direction [value]', 'Optional. (String: "asc", "desc", 1 or -1, default: "desc" by time if no prefix specified, "asc" by public ID otherwise). Control the order of returned resources.')
		.option('--tags', 'Optional (Boolean, default: false). If true, include the list of tag names assigned each resource.')
		.option('--context', 'Optional (Boolean, default: false). If true, include key-value pairs of context associated with each resource.')
		.option('--moderations', 'Optional (Boolean, default: false). If true, include image moderation status of each listed resource.')
		.description('List all available images')
		.action(co.wrap(function* (program) {
			const result = yield listResources(program);
			console.log(JSON.stringify(result.resources, undefined, 2));
			console.log('Found ' + result.resources.length + ' resource(s)');
		}));

	program
		.command('delete')
		//.option('--public_ids <list>', 'Delete all resources with the given public IDs (array of up to 100 public_ids).')
		.option('--prefix <value>', 'Delete all resources including their derivatives, where their public ID starts with the given prefix (up to a maximum of 1000 original resources).')
		 //.option('--all <value>', 'Optional (Boolean, default: false). Delete all resources including their derivatives (up to a maximum of 1000 original resources).')
		.option('--keep_original', 'Optional (Boolean, default: false). If true, delete only the derived resources.')
		.option('--invalidate', 'Optional (Boolean, default: false). Whether to also invalidate the copies of the resource on the CDN. Note that it usually takes a few minutes (although it might take up to an hour) for the invalidation to fully propagate through the CDN.')
		.option('--next_cursor <value>', 'Optional. When a deletion request has more resources to delete than 1000, the next_cursor value is returned as part of the response. You can then specify this value as the next_cursor parameter of the following deletion request.')
		.option('--transformations <list>', 'Optional. Only the derived resources matching this array of transformation parameters will be deleted.')
		.description('Delete specified images by prefix')
		.action(co.wrap(function* (program) {
			const result = yield listResources(program);
			if(result.resources.length) {
				console.log('Found ' + result.resources.length + ' resource(s)');
				const ok = yield prompt.confirm('Are you sure you wish to delete?');
				if (ok) {
					if (!program.prefix) {
						console.log('--prefix must be defined!');
						return;
					}
					console.log('Deleting images using prefix:', program.prefix);
					let deleteResult = yield cloudinary.api.delete_resources_by_prefix(program.prefix);
					console.log('Result', deleteResult.deleted);
				}
			} else {
				console.log('No images with prefix ' + program.prefix + ' found');
			}
			process.stdin.pause();
 		}));

	program
		.command('test')
		.option('-p, --peppers [name]', 'Add peppers')
		.version('0.0.0')
		.description('List all available images')
		.action(program =>  {
			if (program.peppers) console.log('  - peppers:', program.peppers);
		});

};
