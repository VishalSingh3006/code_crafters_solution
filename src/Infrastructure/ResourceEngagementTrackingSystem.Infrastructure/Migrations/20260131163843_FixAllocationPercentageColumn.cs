using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResourceEngagementTrackingSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixAllocationPercentageColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "AllocationPercentage",
                table: "StaffingRecords",
                type: "decimal(5,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,4)"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "AllocationPercentage",
                table: "StaffingRecords",
                type: "decimal(5,4)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)"
            );
        }
    }
}
