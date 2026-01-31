using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using System;

#nullable disable

namespace ResourceEngagementTrackingSystem.Infrastructure.Migrations
{
    /// <summary>
    /// Migration for creating Department, Designation, Skill, and EmployeeSkill tables
    /// Generated manually to ensure proper table creation and relationships
    /// </summary>
    public partial class CreateDepartmentDesignationSkillEmployeeSkillTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Create Departments table
            migrationBuilder.CreateTable(
                name: "Departments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedBy = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    UpdatedBy = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP(6)"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Departments", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            // Create Designations table
            migrationBuilder.CreateTable(
                name: "Designations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedBy = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    UpdatedBy = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP(6)"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Designations", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            // Create Skills table
            migrationBuilder.CreateTable(
                name: "Skills",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedBy = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    UpdatedBy = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP(6)"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Skills", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            // Update Employees table to add Department and Designation relationships
            migrationBuilder.AddColumn<int>(
                name: "DepartmentId",
                table: "Employees",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "DesignationId",
                table: "Employees",
                type: "int",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<string>(
                name: "EmployeeCode",
                table: "Employees",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "EMP001")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Employees",
                type: "varchar(20)",
                maxLength: 20,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfJoining",
                table: "Employees",
                type: "datetime(6)",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP(6)");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfBirth",
                table: "Employees",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1990, 1, 1));

            migrationBuilder.AddColumn<int>(
                name: "ManagerId",
                table: "Employees",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "EmploymentType",
                table: "Employees",
                type: "int",
                nullable: false,
                defaultValue: 0); // Permanent

            // Create EmployeeSkills junction table
            migrationBuilder.CreateTable(
                name: "EmployeeSkills",
                columns: table => new
                {
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    SkillId = table.Column<int>(type: "int", nullable: false),
                    ProficiencyLevel = table.Column<int>(type: "int", nullable: false, defaultValue: 0), // Beginner
                    CreatedBy = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    UpdatedBy = table.Column<int>(type: "int", nullable: false, defaultValue: 1),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP(6)"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmployeeSkills", x => new { x.EmployeeId, x.SkillId });
                    table.ForeignKey(
                        name: "FK_EmployeeSkills_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EmployeeSkills_Skills_SkillId",
                        column: x => x.SkillId,
                        principalTable: "Skills",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            // Add foreign key constraints
            migrationBuilder.CreateIndex(
                name: "IX_Employees_DepartmentId",
                table: "Employees",
                column: "DepartmentId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_DesignationId",
                table: "Employees",
                column: "DesignationId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_ManagerId",
                table: "Employees",
                column: "ManagerId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_EmployeeCode",
                table: "Employees",
                column: "EmployeeCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeSkills_SkillId",
                table: "EmployeeSkills",
                column: "SkillId");

            migrationBuilder.CreateIndex(
                name: "IX_Departments_Name",
                table: "Departments",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Designations_Name",
                table: "Designations",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Skills_Name",
                table: "Skills",
                column: "Name",
                unique: true);

            // Add foreign key relationships
            migrationBuilder.AddForeignKey(
                name: "FK_Employees_Departments_DepartmentId",
                table: "Employees",
                column: "DepartmentId",
                principalTable: "Departments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_Designations_DesignationId",
                table: "Employees",
                column: "DesignationId",
                principalTable: "Designations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Employees_Employees_ManagerId",
                table: "Employees",
                column: "ManagerId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            // Insert seed data
            migrationBuilder.InsertData(
                table: "Departments",
                columns: new[] { "Id", "Name", "CreatedBy", "UpdatedBy", "CreatedAt", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "Information Technology", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 2, "Human Resources", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 3, "Finance", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 4, "Marketing", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 5, "Operations", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Designations",
                columns: new[] { "Id", "Name", "CreatedBy", "UpdatedBy", "CreatedAt", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "Software Engineer", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 2, "Senior Software Engineer", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 3, "Tech Lead", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 4, "Project Manager", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 5, "Business Analyst", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 6, "HR Manager", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 7, "DevOps Engineer", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 8, "Quality Assurance Engineer", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.InsertData(
                table: "Skills",
                columns: new[] { "Id", "Name", "CreatedBy", "UpdatedBy", "CreatedAt", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "C#", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 2, "ASP.NET Core", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 3, "React", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 4, "TypeScript", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 5, "SQL Server", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 6, "MySQL", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 7, "Entity Framework", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 8, "Azure", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 9, "Docker", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 10, "Kubernetes", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 11, "JavaScript", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 12, "HTML/CSS", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 13, "Git", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 14, "Project Management", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) },
                    { 15, "Agile/Scrum", 1, 1, new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc), new DateTime(2026, 1, 31, 18, 0, 14, 0, DateTimeKind.Utc) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove foreign key constraints
            migrationBuilder.DropForeignKey(
                name: "FK_Employees_Departments_DepartmentId",
                table: "Employees");

            migrationBuilder.DropForeignKey(
                name: "FK_Employees_Designations_DesignationId",
                table: "Employees");

            migrationBuilder.DropForeignKey(
                name: "FK_Employees_Employees_ManagerId",
                table: "Employees");

            // Drop EmployeeSkills table
            migrationBuilder.DropTable(
                name: "EmployeeSkills");

            // Drop main tables
            migrationBuilder.DropTable(
                name: "Departments");

            migrationBuilder.DropTable(
                name: "Designations");

            migrationBuilder.DropTable(
                name: "Skills");

            // Remove columns from Employees table
            migrationBuilder.DropIndex(
                name: "IX_Employees_DepartmentId",
                table: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_Employees_DesignationId",
                table: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_Employees_ManagerId",
                table: "Employees");

            migrationBuilder.DropIndex(
                name: "IX_Employees_EmployeeCode",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "DepartmentId",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "DesignationId",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "EmployeeCode",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "DateOfJoining",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "DateOfBirth",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "ManagerId",
                table: "Employees");

            migrationBuilder.DropColumn(
                name: "EmploymentType",
                table: "Employees");
        }
    }
}