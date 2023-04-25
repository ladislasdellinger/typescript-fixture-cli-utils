# typescript-fixtures-cli-utils

Utility functions for [typeorm-fixtures-cli](https://github.com/RobinCK/typeorm-fixtures) package


## Usage

### `buildFixture`

This is a builder for exporting fixtures in TS files for `typeorm-fixtures-cli`.

#### Example

User.ts
```ts
@Entity('user')
class User{
  @Column()
  id: string;

  @Column()
  name: string;
}
```

User.fixture.ts
```ts
export default t
  .buildFixture(User)
  .addItem('user1', {
    id: 'user-1',
    name: 'John',
  })
  .getConfig()
```


### `refTo`

`typeorm-fixtures-cli` allows to reference other fixtures using `@ + key of the item`.
This package provide a utility function `refTo` to add type safety and intellisense for these reference:

Organization.ts
```ts
@Entity('organization')
class Organization{
  @Column()
  id: string;

  @Column()
  name: string;
}
```


User.ts
```ts
@Entity('user')
class User{
  @Column()
  id: string;

  @Column()
  name: string;

  @OneToOne()
  organization: Organization;

  @Column()
  organizationId: string;
}
```

Organization.fixture.ts
```ts
export default t
  .buildFixture(Organization)
  .addItem('organization1', {
    id: 'organizationId-1',
    name: 'Organization 1',
  })
    .addItem('organization2', {
    id: 'organizationId-2',
    name: 'Organization 2',
  })
  .addItem('organization3', {
    id: 'organizationId-3',
    name: 'Organization 3',
  })
  .getConfig();
```

User.fixture.ts
```ts
import OrganizationFixture from "./Organization.fixture.ts"

export default t
  .buildFixture(User)
  .addItem('user1', {
    id: 'user-1',
    name: 'John',
    organizationId: t.refTo(OrganizationFixture, "organization1")
    // here you have intellisense and the return type is `@organization1`
  })
  .addItem('user2', {
    id: 'user-2',
    name: 'John 2',
    organizationId: t.refTo(OrganizationFixture, "organization4")
    // here you have a type error because `organization4` does not exist
  })
  .getConfig()
```
