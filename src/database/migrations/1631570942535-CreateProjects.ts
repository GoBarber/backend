import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateProjects1631570942535 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: "projects",
            columns: [
              {
                name: "id",
                type: "uuid",
                isPrimary: true,
                generationStrategy: "uuid",
                default: 'uuid_generate_v4()'
              },
              {
                name: "url",
                type: "varchar",
                isNullable: false
              },
              {
                name: "name",
                type: "varchar",
                isNullable: false
              },
              {
                name: "description",
                type: "varchar",
                isNullable: false
              },
              {
                name: "created_at",
                type: "timestamp",
                default: "now()"
              },
              {
                name: "updated_at",
                type: "timestamp",
                default: "now()"
              }
            ]
          })
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("projects");
      }

}
