import { ChildEntity, Column } from 'typeorm';

import { Member, Membership } from '.';

export enum RelationshipWithDeceased {
  Father = 'Father',
  Mother = 'Mother',
  Brother = 'Brother',
  Sister = 'Sister',
  Son = 'Son',
  Daughter = 'Daughter',
  GrandMa = 'GrandMa',
  GrandPa = 'GrandPa',
  Uncle = 'Uncle',
  Aunt = 'Aunt',
  Nephew = 'Nephew',
  Niece = 'Niece',
  Cousin = 'Cousin',
}
@ChildEntity(Membership.Bereaved)
export class BereavedMember extends Member {
  @Column()
  bereavement_date: Date;

  @Column()
  deceased: string;

  @Column({ type: 'enum', enum: RelationshipWithDeceased })
  relationship_with_deceased: RelationshipWithDeceased;

  constructor() {
    super();
  }
}
