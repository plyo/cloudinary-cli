#cloudinary-cli

## Description

A CLI tool for the Cloudinary Admin API

### Current feature set
* `list` - list resources (images) using optional [params/filters](http://cloudinary.com/documentation/admin_api#browse_resources)
* `delete` - delete images by prefix

### Wanted feature set
* Upload image
* Folder management
* TBD...

### TODO
* Error handling - `co` swallows errors, how to get do error handling when using `co.wrap(fn)`?

## Usage

To use cloudinary-cli, clone this repo and run:

```
$ cd cloudinary-cli
$ npm link
```

Then the following should give you an overview of available actions:

```cloudinary-cli --help```

**Note:** Requires Node with harmony (generators, destructing). v4+ works no problem

## License

Copyright (c) 2016 Aksel G. Gresvig
[Plyo Labs](http://plyo.io)

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

## Acknowledgments

Built using [generator-commader](https://github.com/Hypercubed/generator-commander).
