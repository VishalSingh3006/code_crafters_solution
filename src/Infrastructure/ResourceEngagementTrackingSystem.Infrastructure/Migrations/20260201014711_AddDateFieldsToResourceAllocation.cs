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
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "ResourceAllocations");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "ResourceAllocations");

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
