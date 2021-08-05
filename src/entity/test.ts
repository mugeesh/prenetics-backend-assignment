import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('test')
export class Test {

    @PrimaryGeneratedColumn('uuid', { name: 'testid' })
    testId: string;

    @Column('text', { name: 'name', nullable: false })
    name: string;

    @Column('text', { name: 'value', nullable: false, default: 'none' })
    value: string;

    @Column('text', { name: 'comment', nullable: true })
    comment: string;

    @Column('text', { name: 'user', nullable: false })
    user: string;

}
