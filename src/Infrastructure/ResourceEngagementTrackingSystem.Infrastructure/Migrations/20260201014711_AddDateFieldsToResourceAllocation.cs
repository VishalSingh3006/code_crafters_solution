using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResourceEngagementTrackingSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDateFieldsToResourceAllocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
                        // Idempotent: Drop legacy audit columns if they exist
                        migrationBuilder.Sql(@"
                                SET @sql = (
                                    SELECT IF(
                                        EXISTS (
                                            SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
                                            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ResourceAllocations' AND COLUMN_NAME = 'CreatedBy'
                                        ),
                                        'ALTER TABLE `ResourceAllocations` DROP COLUMN `CreatedBy`',
                                        'SELECT 1'
                                    )
                                );
                                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                        ");

                        migrationBuilder.Sql(@"
                                SET @sql = (
                                    SELECT IF(
                                        EXISTS (
                                            SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
                                            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ResourceAllocations' AND COLUMN_NAME = 'UpdatedBy'
                                        ),
                                        'ALTER TABLE `ResourceAllocations` DROP COLUMN `UpdatedBy`',
                                        'SELECT 1'
                                    )
                                );
                                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                        ");

                        // Idempotent: Add date fields only if missing
                        migrationBuilder.Sql(@"
                                SET @sql = (
                                    SELECT IF(
                                        EXISTS (
                                            SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
                                            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ResourceAllocations' AND COLUMN_NAME = 'AllocationEnd'
                                        ),
                                        'SELECT 1',
                                        'ALTER TABLE `ResourceAllocations` ADD `AllocationEnd` datetime(6) NULL'
                                    )
                                );
                                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                        ");

                        migrationBuilder.Sql(@"
                                SET @sql = (
                                    SELECT IF(
                                        EXISTS (
                                            SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
                                            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ResourceAllocations' AND COLUMN_NAME = 'AllocationStart'
                                        ),
                                        'SELECT 1',
                                        'ALTER TABLE `ResourceAllocations` ADD `AllocationStart` datetime(6) NOT NULL DEFAULT ''0001-01-01 00:00:00''' 
                                    )
                                );
                                PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
                        ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AllocationEnd",
                table: "ResourceAllocations");

            migrationBuilder.DropColumn(
                name: "AllocationStart",
                table: "ResourceAllocations");

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "ResourceAllocations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UpdatedBy",
                table: "ResourceAllocations",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
