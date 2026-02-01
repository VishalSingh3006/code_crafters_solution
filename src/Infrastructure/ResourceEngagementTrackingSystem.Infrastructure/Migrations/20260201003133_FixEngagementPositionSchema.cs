using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResourceEngagementTrackingSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixEngagementPositionSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
                        // Idempotent: Drop old FK from EngagementPositions to Engagements if present
                        migrationBuilder.Sql(@"
                                SET @sql = (
                                    SELECT IF(
                                        EXISTS (
                                            SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
                                            WHERE CONSTRAINT_SCHEMA = DATABASE()
                                                AND TABLE_NAME = 'EngagementPositions'
                                                AND CONSTRAINT_NAME = 'FK_EngagementPositions_Engagements_EngagementId'
                                        ),
                                        'ALTER TABLE `EngagementPositions` DROP FOREIGN KEY `FK_EngagementPositions_Engagements_EngagementId`',
                                        'SELECT 1'
                                    )
                                );
                                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                        ");

                        // Idempotent: Drop old FK from ResourceAllocations to EngagementPositions if present
                        migrationBuilder.Sql(@"
                                SET @sql = (
                                    SELECT IF(
                                        EXISTS (
                                            SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
                                            WHERE CONSTRAINT_SCHEMA = DATABASE()
                                                AND TABLE_NAME = 'ResourceAllocations'
                                                AND CONSTRAINT_NAME = 'FK_ResourceAllocations_EngagementPositions_EngagementPositionId'
                                        ),
                                        'ALTER TABLE `ResourceAllocations` DROP FOREIGN KEY `FK_ResourceAllocations_EngagementPositions_EngagementPositionId`',
                                        'SELECT 1'
                                    )
                                );
                                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                        ");

                        // Idempotent: Drop old FK from ResourceAllocations to Employees if present (to change delete behavior)
                        migrationBuilder.Sql(@"
                                SET @sql = (
                                    SELECT IF(
                                        EXISTS (
                                            SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
                                            WHERE CONSTRAINT_SCHEMA = DATABASE()
                                                AND TABLE_NAME = 'ResourceAllocations'
                                                AND CONSTRAINT_NAME = 'FK_ResourceAllocations_Employees_EmployeeId'
                                        ),
                                        'ALTER TABLE `ResourceAllocations` DROP FOREIGN KEY `FK_ResourceAllocations_Employees_EmployeeId`',
                                        'SELECT 1'
                                    )
                                );
                                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                        ");

                        // Idempotent: Drop Engagements table if it exists
                        migrationBuilder.Sql(@"
                                SET @sql = (
                                    SELECT IF(
                                        EXISTS (
                                            SELECT 1 FROM INFORMATION_SCHEMA.TABLES
                                            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Engagements'
                                        ),
                                        'DROP TABLE `Engagements`',
                                        'SELECT 1'
                                    )
                                );
                                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                        ");

                        // Note: Do NOT drop AllocationStart/AllocationEnd; current model uses these columns.

                        // Idempotent: Rename column EngagementPositionId -> EngagementId if the old column exists
                        migrationBuilder.Sql(@"
                                SET @hasOld = (
                                    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
                                    WHERE TABLE_SCHEMA = DATABASE()
                                        AND TABLE_NAME = 'ResourceAllocations'
                                        AND COLUMN_NAME = 'EngagementPositionId'
                                );
                                SET @hasNew = (
                                    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
                                    WHERE TABLE_SCHEMA = DATABASE()
                                        AND TABLE_NAME = 'ResourceAllocations'
                                        AND COLUMN_NAME = 'EngagementId'
                                );
                                SET @sql = (
                                    SELECT IF(@hasOld > 0 AND @hasNew = 0,
                                        'ALTER TABLE `ResourceAllocations` CHANGE COLUMN `EngagementPositionId` `EngagementId` INT NOT NULL',
                                        'SELECT 1'
                                    )
                                );
                                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                        ");

                        // Idempotent: Ensure FK from EngagementPositions to ProjectClientEngagements
                        migrationBuilder.Sql(@"
                                SET @sql = (
                                    SELECT IF(
                                        EXISTS (
                                            SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
                                            WHERE CONSTRAINT_SCHEMA = DATABASE()
                                                AND TABLE_NAME = 'EngagementPositions'
                                                AND CONSTRAINT_NAME = 'FK_EngagementPositions_ProjectClientEngagements_EngagementId'
                                        ),
                                        'SELECT 1',
                                        'ALTER TABLE `EngagementPositions` ADD CONSTRAINT `FK_EngagementPositions_ProjectClientEngagements_EngagementId` FOREIGN KEY (`EngagementId`) REFERENCES `ProjectClientEngagements`(`Id`) ON DELETE CASCADE'
                                    )
                                );
                                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                        ");

                        // Idempotent: Ensure FK from ResourceAllocations to Employees
                        migrationBuilder.Sql(@"
                                SET @sql = (
                                    SELECT IF(
                                        EXISTS (
                                            SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
                                            WHERE CONSTRAINT_SCHEMA = DATABASE()
                                                AND TABLE_NAME = 'ResourceAllocations'
                                                AND CONSTRAINT_NAME = 'FK_ResourceAllocations_Employees_EmployeeId'
                                        ),
                                        'SELECT 1',
                                        'ALTER TABLE `ResourceAllocations` ADD CONSTRAINT `FK_ResourceAllocations_Employees_EmployeeId` FOREIGN KEY (`EmployeeId`) REFERENCES `Employees`(`Id`) ON DELETE RESTRICT'
                                    )
                                );
                                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                        ");

                        // Idempotent: Ensure FK from ResourceAllocations to ProjectClientEngagements
                        migrationBuilder.Sql(@"
                                SET @sql = (
                                    SELECT IF(
                                        EXISTS (
                                            SELECT 1 FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
                                            WHERE CONSTRAINT_SCHEMA = DATABASE()
                                                AND TABLE_NAME = 'ResourceAllocations'
                                                AND CONSTRAINT_NAME = 'FK_ResourceAllocations_ProjectClientEngagements_EngagementId'
                                        ),
                                        'SELECT 1',
                                        'ALTER TABLE `ResourceAllocations` ADD CONSTRAINT `FK_ResourceAllocations_ProjectClientEngagements_EngagementId` FOREIGN KEY (`EngagementId`) REFERENCES `ProjectClientEngagements`(`Id`) ON DELETE CASCADE'
                                    )
                                );
                                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                        ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EngagementPositions_ProjectClientEngagements_EngagementId",
                table: "EngagementPositions");

            migrationBuilder.DropForeignKey(
                name: "FK_ResourceAllocations_Employees_EmployeeId",
                table: "ResourceAllocations");

            migrationBuilder.DropForeignKey(
                name: "FK_ResourceAllocations_ProjectClientEngagements_EngagementId",
                table: "ResourceAllocations");

            migrationBuilder.RenameColumn(
                name: "EngagementId",
                table: "ResourceAllocations",
                newName: "EngagementPositionId");

            migrationBuilder.RenameIndex(
                name: "IX_ResourceAllocations_EngagementId",
                table: "ResourceAllocations",
                newName: "IX_ResourceAllocations_EngagementPositionId");

            migrationBuilder.AddColumn<DateTime>(
                name: "AllocationEnd",
                table: "ResourceAllocations",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "AllocationStart",
                table: "ResourceAllocations",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "Engagements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "varchar(1000)", maxLength: 1000, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EndDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Name = table.Column<string>(type: "varchar(200)", maxLength: 200, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OutcomeStatus = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedBy = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Engagements", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddForeignKey(
                name: "FK_EngagementPositions_Engagements_EngagementId",
                table: "EngagementPositions",
                column: "EngagementId",
                principalTable: "Engagements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ResourceAllocations_Employees_EmployeeId",
                table: "ResourceAllocations",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ResourceAllocations_EngagementPositions_EngagementPositionId",
                table: "ResourceAllocations",
                column: "EngagementPositionId",
                principalTable: "EngagementPositions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
