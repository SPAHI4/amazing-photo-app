import pg, { QueryResult, QueryConfig, QueryResultRow } from 'pg';
import { FastifyBaseLogger } from 'fastify';
import { env } from '@app/config/env.js';

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
});

process.on('exit', async () => {
  try {
    await pool.end();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error ending pg pool', error);
  }
});

/**
 * A wrapper around pg.PoolClient that handles transactions and logging.
 *
 * Implements AsyncDisposable to ensure that the connection is closed when the client and transaction are disposed.
 */

export class PgClient implements AsyncDisposable {
  #logger: FastifyBaseLogger;

  connection: pg.PoolClient | null = null;

  #transacting = false;

  #committed = false;

  constructor(logger: FastifyBaseLogger) {
    this.#logger = logger;
  }

  async startTransaction(): Promise<void> {
    if (this.#transacting) {
      throw new Error('Cannot start transaction while already in transaction');
    }

    try {
      await this.#connect();
      await this.connection!.query('BEGIN');
      this.#transacting = true;
    } catch (error) {
      this.#logger.error('Error starting transaction', error);
      throw error;
    }
  }

  async #connect(): Promise<void> {
    if (this.connection == null) {
      this.connection = await pool.connect();
    }
  }

  async query<T extends QueryResultRow>(
    queryText: string | QueryConfig,
    values?: unknown[],
  ): Promise<QueryResult<T>> {
    if (!this.#transacting) {
      return pool.query<T>(queryText, values);
    }

    this.#logger.debug('Executing query', queryText, values);

    try {
      return await this.connection!.query<T>(queryText, values);
    } catch (error) {
      this.#logger.error('Error executing query', error);
      throw error;
    }
  }

  async commit(): Promise<void> {
    if (!this.#transacting) {
      throw new Error('Cannot commit without transaction');
    }

    await this.connection!.query('COMMIT');

    this.#logger.debug('Committed transaction');

    this.#transacting = false;
    this.#committed = true;
  }

  async rollback(): Promise<void> {
    if (!this.#transacting) {
      throw new Error('Cannot rollback without transaction');
    }

    if (this.#committed) {
      throw new Error('Cannot rollback after commit');
    }

    this.#transacting = false;
    this.#committed = false;

    await this.connection!.query('ROLLBACK');

    this.#logger.debug('Rolled back transaction');
  }

  async [Symbol.asyncDispose](): Promise<void> {
    if (this.#transacting && !this.#committed) {
      await this.rollback();

      throw new Error('Transaction was not either committed or rolled back');
    }

    if (this.connection != null) {
      this.connection.release();
    }

    this.#logger.debug('Released connection');

    this.connection = null;
  }
}
