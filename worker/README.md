# Worker

This is the worker service that runs background jobs for the app.

## Stack

- nodejs >= 20.5
- [graphile-worker](https://github.com/graphile/worker) - background jobs runner for postgres
- ffmpeg 6.0 - image processing
- [nodemailer](https://nodemailer.com/about/) - email sending
- [exifr](https://github.com/MikeKovarik/exifr) - exif data parsing
- [@react-email](https://react.email/) - email templating with react
- [juice](https://github.com/Automattic/juice) - inline css and images in html

## Architecture

Each task is implemented as a separate worker. 

All the tasks are located in [src/tasks](src/tasks) directory.
- convert-image - converts image to multiple sizes and formats, extracts exif data, uploads to s3, triggered by postgres trigger
- delete-image - deletes image from s3, triggered by postgres trigger
- notify-user - sends email notification to user, triggered by postgres trigger


## TODO:
- [ ] add tests
- [ ] split convert-image task into subtasks