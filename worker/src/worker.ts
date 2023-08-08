import { makeWorkerUtils, run } from 'graphile-worker';
import { env } from '@app/config/env.ts';
import { convertImageTask } from './tasks/convert-image.ts';
import { deleteImageTask } from './tasks/delete-image.ts';
import { notifyUserTask } from './tasks/notify-user.ts';
import type {} from '../types/node.d.ts';
import type {} from '../types/global.d.ts';

const taskList = {
  convert_image: convertImageTask,
  delete_image: deleteImageTask,
  notify_user: notifyUserTask,
};

const workerUtils = await makeWorkerUtils({
  connectionString: env.DATABASE_URL,
});

try {
  await workerUtils.migrate();
} finally {
  await workerUtils.release();
}

const runner = await run({
  connectionString: env.DATABASE_URL,
  concurrency: 1,
  pollInterval: 1000,
  noHandleSignals: false,
  taskList,
});

await runner.promise;
