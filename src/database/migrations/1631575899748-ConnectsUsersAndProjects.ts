import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
    TableForeignKey
  } from "typeorm";
  
  export default class ConnectsUsersAndProjects1631575899748
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn(
        "projects",
        new TableColumn({
          name: "user_id",
          type: "uuid",
          isNullable: true
        })
      );
  
      await queryRunner.createForeignKey(
        "projects",
        new TableForeignKey({
          name: "ProjectUser",
          columnNames: ["user_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "users",
          onDelete: "SET NULL",
          onUpdate: "CASCADE"
        })
      );
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey("projects", "ProjectUser");
  
      await queryRunner.dropColumn("projects", "user_id");
  
      await queryRunner.addColumn(
        "projects",
        new TableColumn({
          name: "provider",
          type: "varchar"
        })
      );
    }
  }