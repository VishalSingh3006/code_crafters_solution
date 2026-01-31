using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResourceEngagementTrackingSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CreateBillingRatesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EngagementPosition_Engagement_EngagementId",
                table: "EngagementPosition");

            migrationBuilder.DropForeignKey(
                name: "FK_ResourceAllocation_Employees_EmployeeId",
                table: "ResourceAllocation");

            migrationBuilder.DropForeignKey(
                name: "FK_ResourceAllocation_EngagementPosition_EngagementPositionId",
                table: "ResourceAllocation");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ResourceAllocation",
                table: "ResourceAllocation");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EngagementPosition",
                table: "EngagementPosition");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Engagement",
                table: "Engagement");

            migrationBuilder.RenameTable(
                name: "ResourceAllocation",
                newName: "ResourceAllocations");

            migrationBuilder.RenameTable(
                name: "EngagementPosition",
                newName: "EngagementPositions");

            migrationBuilder.RenameTable(
                name: "Engagement",
                newName: "Engagements");

            migrationBuilder.RenameIndex(
                name: "IX_ResourceAllocation_EngagementPositionId",
                table: "ResourceAllocations",
                newName: "IX_ResourceAllocations_EngagementPositionId");

            migrationBuilder.RenameIndex(
                name: "IX_ResourceAllocation_EmployeeId",
                table: "ResourceAllocations",
                newName: "IX_ResourceAllocations_EmployeeId");

            migrationBuilder.RenameIndex(
                name: "IX_EngagementPosition_EngagementId",
                table: "EngagementPositions",
                newName: "IX_EngagementPositions_EngagementId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ResourceAllocations",
                table: "ResourceAllocations",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EngagementPositions",
                table: "EngagementPositions",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Engagements",
                table: "Engagements",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "BillingRates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Role = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Level = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UsdRate = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    InrRate = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Currency = table.Column<string>(type: "varchar(3)", maxLength: 3, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EffectiveDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BillingRates", x => x.Id);
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
                name: "BillingRates");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ResourceAllocations",
                table: "ResourceAllocations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Engagements",
                table: "Engagements");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EngagementPositions",
                table: "EngagementPositions");

            migrationBuilder.RenameTable(
                name: "ResourceAllocations",
                newName: "ResourceAllocation");

            migrationBuilder.RenameTable(
                name: "Engagements",
                newName: "Engagement");

            migrationBuilder.RenameTable(
                name: "EngagementPositions",
                newName: "EngagementPosition");

            migrationBuilder.RenameIndex(
                name: "IX_ResourceAllocations_EngagementPositionId",
                table: "ResourceAllocation",
                newName: "IX_ResourceAllocation_EngagementPositionId");

            migrationBuilder.RenameIndex(
                name: "IX_ResourceAllocations_EmployeeId",
                table: "ResourceAllocation",
                newName: "IX_ResourceAllocation_EmployeeId");

            migrationBuilder.RenameIndex(
                name: "IX_EngagementPositions_EngagementId",
                table: "EngagementPosition",
                newName: "IX_EngagementPosition_EngagementId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ResourceAllocation",
                table: "ResourceAllocation",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Engagement",
                table: "Engagement",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EngagementPosition",
                table: "EngagementPosition",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_EngagementPosition_Engagement_EngagementId",
                table: "EngagementPosition",
                column: "EngagementId",
                principalTable: "Engagement",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ResourceAllocation_Employees_EmployeeId",
                table: "ResourceAllocation",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ResourceAllocation_EngagementPosition_EngagementPositionId",
                table: "ResourceAllocation",
                column: "EngagementPositionId",
                principalTable: "EngagementPosition",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
