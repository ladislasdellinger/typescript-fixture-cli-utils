import { BaseEntity, DeepPartial, getMetadataArgsStorage } from "typeorm";

type TFixturesConfig<T extends BaseEntity, K extends string = never> = {
  entity: string;
  locale?: string;
  parameters?: { [key: string]: any };
  processor?: string;
  resolvedFields?: string[];
  items: Record<K, T>;
};

type TFixtureBuilder<T extends BaseEntity, K1 extends string> = Omit<
  TFixturesConfig<T>,
  "items"
> & {
  items: Record<K1, T> | Record<never, T>;
  addItem<K2 extends string>(
    key: K2,
    values: DeepPartial<T>
  ): TFixtureBuilder<T, K1 | K2>;
  getConfig(): TFixturesConfig<T, K1>;
};
export type TItemKeys<T extends TFixturesConfig<BaseEntity>> = keyof T["items"];
type TEntityConstructor<T extends BaseEntity> = new (...args: any[]) => T;

const buildEntity = <T extends BaseEntity>(
  entity: TEntityConstructor<T>,
  values: DeepPartial<T>
): T => {
  return Object.assign(new entity(), values);
};

function getEntityName<T extends BaseEntity>(
  entityClass: TEntityConstructor<T>
): string {
  const entityMetadata = getMetadataArgsStorage().tables.find(
    (table) => table.target === entityClass
  );
  return entityMetadata?.name ?? entityClass.name;
}

export const buildFixture = <T extends BaseEntity, K extends string = never>(
  entity: TEntityConstructor<T>,
  partialFixture?: Partial<TFixturesConfig<T>>
): TFixtureBuilder<T, K> => {
  return {
    entity: getEntityName(entity),
    items: {},
    ...partialFixture,
    addItem(key, values) {
      this.items[key] = buildEntity(entity, { id: key, ...values });
      return this;
    },
    getConfig() {
      return {
        entity: this.entity,
        items: this.items,
      };
    },
  };
};

export const refTo = <
  T extends TFixturesConfig<any>,
  K extends TItemKeys<T> & string
>(
  _fixture: T,
  key: K
): `@${K}` => {
  return `@${key}`;
};

export const refToGlobal = <
  T extends TFixturesConfig<any>,
  K extends TItemKeys<T> & string
>(
  fixture: T,
  key: K
): string => {
  return (fixture.items as any)[key].id;
};
