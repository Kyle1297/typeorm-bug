import { Connection, getConnection } from 'typeorm';

export interface Class<T> extends Function {
  new (...args: any[]): T;
}

export class TypeOrmTestUtils {
  private connection: Connection;

  constructor() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('NODE_ENV !== test');
    }
  }

  async startServer() {
    this.connection = await getConnection();
  }

  async closeServer() {
    await this.connection.close();
  }

  saveOne = async <T>(entity: T): Promise<T> => {
    const name = (entity as unknown as Class<T>).constructor.name;
    try {
      const repository = this.connection.getRepository(name);
      return await repository.save(entity);
    } catch (error) {
      throw new Error(
        `Error saving entity: ${name}
        ${error}`,
      );
    }
  };

  saveMany = async <T>(entities: T[]): Promise<T[]> => {
    const savedEntities: T[] = [];

    for (const entity of entities) {
      const name = (entity as unknown as Class<T>).constructor.name;

      try {
        const repository = this.connection.getRepository(name);
        const created = repository.create({ ...entity }) as T;
        const savedEntity = await repository.save(created);
        savedEntities.push(savedEntity);
      } catch (error) {
        throw new Error(
          `Error saving entity: ${name}
          ${error}`,
        );
      }
    }
    return savedEntities;
  };
}
