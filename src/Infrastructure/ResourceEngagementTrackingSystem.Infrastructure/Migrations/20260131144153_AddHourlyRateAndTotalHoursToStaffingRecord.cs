using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ResourceEngagementTrackingSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddHourlyRateAndTotalHoursToStaffingRecord : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "HourlyRate",
                table: "StaffingRecords",
                type: "decimal(10,2)",
                nullable: true
            );

            migrationBuilder.AddColumn<int>(
                name: "TotalHours",
                table: "StaffingRecords",
                type: "int",
                nullable: true
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "HourlyRate", table: "StaffingRecords");

            migrationBuilder.DropColumn(name: "TotalHours", table: "StaffingRecords");
        }
    }
}
