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
            migrationBuilder.DropForeignKey(
                name: "FK_EngagementPositions_Engagements_EngagementId",
                table: "EngagementPositions");

            migrationBuilder.DropForeignKey(
                name: "FK_ResourceAllocations_Employees_EmployeeId",
                table: "ResourceAllocations");

            migrationBuilder.DropForeignKey(
                name: "FK_ResourceAllocations_EngagementPositions_EngagementPositionId",
                table: "ResourceAllocations");

            migrationBuilder.DropTable(
                name: "Engagements");

            migrationBuilder.DropColumn(
                name: "AllocationEnd",
                table: "ResourceAllocations");

            migrationBuilder.DropColumn(
                name: "AllocationStart",
                table: "ResourceAllocations");

            migrationBuilder.RenameColumn(
                name: "EngagementPositionId",
                table: "ResourceAllocations",
                newName: "EngagementId");

            migrationBuilder.RenameIndex(
                name: "IX_ResourceAllocations_EngagementPositionId",
                table: "ResourceAllocations",
                newName: "IX_ResourceAllocations_EngagementId");

            migrationBuilder.AddForeignKey(
                name: "FK_EngagementPositions_ProjectClientEngagements_EngagementId",
                table: "EngagementPositions",
                column: "EngagementId",
                principalTable: "ProjectClientEngagements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ResourceAllocations_Employees_EmployeeId",
                table: "ResourceAllocations",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ResourceAllocations_ProjectClientEngagements_EngagementId",
                table: "ResourceAllocations",
                column: "EngagementId",
                principalTable: "ProjectClientEngagements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
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
