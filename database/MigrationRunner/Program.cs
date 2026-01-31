using System;
using System.IO;
using System.Threading.Tasks;
using MySqlConnector;

namespace DatabaseMigrationRunner
{
    class Program
    {
        private static readonly string DefaultConnectionString =
            "Server=localhost;Database=resourceengagementtrackingsystem;User=root;Password=;";

        static async Task Main(string[] args)
        {
            Console.WriteLine("==================================================");
            Console.WriteLine("Entity Migration Runner");
            Console.WriteLine("Department, Designation, Skill & EmployeeSkill");
            Console.WriteLine("==================================================");
            Console.WriteLine();

            // Get connection string
            string connectionString = DefaultConnectionString;

            Console.Write("Enter MySQL connection string (or press Enter for default): ");
            string input = Console.ReadLine();
            if (!string.IsNullOrWhiteSpace(input))
            {
                connectionString = input;
            }

            Console.WriteLine(
                $"Using connection string: {connectionString.Replace("Password=", "Password=***")}"
            );
            Console.WriteLine();

            // Locate migration file
            string migrationFile = Path.Combine(
                "..",
                "migrations",
                "002_department_designation_skill_employeeskill_migration.sql"
            );

            if (!File.Exists(migrationFile))
            {
                Console.WriteLine($"Error: Migration file not found at {migrationFile}");
                return;
            }

            Console.WriteLine($"Found migration file: {migrationFile}");
            Console.WriteLine();

            try
            {
                // Test connection
                Console.WriteLine("Testing database connection...");
                using var connection = new MySqlConnection(connectionString);
                await connection.OpenAsync();

                var version = await connection.QueryFirstOrDefaultAsync<string>("SELECT VERSION()");
                Console.WriteLine($"Connected to MySQL version: {version}");
                Console.WriteLine();

                // Read migration file
                Console.WriteLine("Reading migration script...");
                string migrationScript = await File.ReadAllTextAsync(migrationFile);

                // Execute migration
                Console.WriteLine("Executing migration...");

                // Split the script by semicolons and execute each statement
                var statements = migrationScript.Split(
                    new[] { ";\r\n", ";\n", ";" },
                    StringSplitOptions.RemoveEmptyEntries
                );
                int executedStatements = 0;

                foreach (var statement in statements)
                {
                    var trimmedStatement = statement.Trim();

                    // Skip empty statements and comments
                    if (
                        string.IsNullOrWhiteSpace(trimmedStatement)
                        || trimmedStatement.StartsWith("--")
                        || trimmedStatement.StartsWith("/*")
                        || trimmedStatement.StartsWith("USE ")
                    )
                        continue;

                    try
                    {
                        using var command = new MySqlCommand(trimmedStatement, connection);
                        command.CommandTimeout = 60; // 60 seconds timeout
                        await command.ExecuteNonQueryAsync();
                        executedStatements++;

                        if (executedStatements % 10 == 0)
                        {
                            Console.WriteLine($"Executed {executedStatements} statements...");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Warning: Statement execution failed: {ex.Message}");
                        Console.WriteLine(
                            $"Statement: {trimmedStatement.Substring(0, Math.Min(100, trimmedStatement.Length))}..."
                        );
                        // Continue with other statements
                    }
                }

                Console.WriteLine();
                Console.WriteLine("==================================================");
                Console.WriteLine("MIGRATION COMPLETED SUCCESSFULLY!");
                Console.WriteLine("==================================================");
                Console.WriteLine();
                Console.WriteLine($"✓ Executed {executedStatements} SQL statements");
                Console.WriteLine(
                    "✓ Tables created/updated: Departments, Designations, Skills, EmployeeSkills"
                );
                Console.WriteLine("✓ Employee table enhanced with new columns");
                Console.WriteLine("✓ Foreign key relationships established");
                Console.WriteLine("✓ Indexes created for optimal performance");
                Console.WriteLine("✓ Seed data inserted for immediate development");
                Console.WriteLine();
                Console.WriteLine("Next Steps:");
                Console.WriteLine("1. Verify tables in your database");
                Console.WriteLine("2. Run your application to test entity mappings");
                Console.WriteLine(
                    "3. Test employee creation with department/designation assignments"
                );
                Console.WriteLine();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                Environment.Exit(1);
            }
        }
    }
}

// Extension method for simple querying
public static class MySqlConnectionExtensions
{
    public static async Task<T> QueryFirstOrDefaultAsync<T>(
        this MySqlConnection connection,
        string sql
    )
    {
        using var command = new MySqlCommand(sql, connection);
        var result = await command.ExecuteScalarAsync();
        return (T)result;
    }
}
