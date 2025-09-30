import {FindManyOptions, FindOneOptions, FindOptionsWhere, ObjectLiteral, Repository} from 'typeorm';
import {FindOptionsSelect} from 'typeorm/find-options/FindOptionsSelect';

export interface BaseRepository<Entity> {
  save(entity: Entity): Promise<Entity>;

  findOne(where: FindManyOptions<Entity>): Promise<Entity | null>;

  findAll(where: FindManyOptions<Entity>): Promise<Entity[]>;

  update(id: number, entity: Entity): Promise<Entity>;

  delete(id: number): Promise<boolean>;

  findByFilter(
    where: FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity>
  ): Promise<Entity | null>;
}

export class TypeOrmRepository<Entity extends ObjectLiteral>
  implements BaseRepository<Entity> {
  constructor(private readonly repository: Repository<Entity>) {
  }

  public createQueryBuilder(alias: string) {
    return this.repository.createQueryBuilder(alias);
  }

  public async save(entity: Entity): Promise<Entity> {
    return this.repository.save(entity);
  }

  // вставка или игнор, если используется уникальные записи
  public async insertIgnore(entity: Entity): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .insert()
      .into(this.repository.metadata.tableName) // либо .target
      .values(entity)
      .orIgnore()
      .execute();
  }

  public async findOne(
    where: FindOptionsWhere<Entity>,
    select?: FindOptionsSelect<Entity>
  ): Promise<Entity | null> {
    return await this.repository.findOne({where, select});
  }

  public async findAll(where: FindManyOptions<Entity>): Promise<Entity[]> {
    return this.repository.find(where);
  }

  public async update(id: number, entity: Entity): Promise<Entity> {
    return this.repository.save({id, ...entity});
  }

  public async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);

    return Boolean(result.affected);
  }

  public async findAllByFilter(
    where: FindManyOptions<Entity>,
    options?: FindManyOptions<Entity>
  ): Promise<Entity[]> {
    return this.repository.find({...where, ...options});
  }

  async findByFilter(
    where: FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity>,
    options?: FindOneOptions<Entity>
  ): Promise<Entity | null> {
    return this.repository.findOne({
      where,
      ...options
    });
  }
}
