using MySqlConnector;

var connectionString = "server=localhost;port=3306;database=resourceengagementtrackingsystem;user=root;password=mysql";

try
{
    using var connection = new MySqlConnection(connectionString);
    await connection.OpenAsync();
    
    // Drop the Engagements table if it exists
    Console.WriteLine("Dropping Engagements table...");
    var dropEngagementsTableSql = "DROP TABLE IF EXISTS Engagements";
    using var dropCommand = new MySqlCommand(dropEngagementsTableSql, connection);
    await dropCommand.ExecuteNonQueryAsync();
    Console.WriteLine("✓ Dropped Engagements table");
    
    // Also drop ResourceAllocations table if it exists (as it might have FK to Engagements)
    Console.WriteLine("Dropping ResourceAllocations table...");
    var dropResourceAllocationsTableSql = "DROP TABLE IF EXISTS ResourceAllocations";
    using var dropResourceAllocationsCommand = new MySqlCommand(dropResourceAllocationsTableSql, connection);
    await dropResourceAllocationsCommand.ExecuteNonQueryAsync();
    Console.WriteLine("✓ Dropped ResourceAllocations table");
    
    // Remove the migration record from history so it can be reapplied
    Console.WriteLine("Removing migration from history...");
    var deleteMigrationSql = @"
        DELETE FROM `__EFMigrationsHistory` 
        WHERE `MigrationId` = '20260131173633_AddEngagementAndResourceAllocation'";
    
    using var deleteMigrationCommand = new MySqlCommand(deleteMigrationSql, connection);
    var rowsDeleted = await deleteMigrationCommand.ExecuteNonQueryAsync();
    Console.WriteLine($"✓ Removed migration record ({rowsDeleted} rows deleted)");
    
    Console.WriteLine("\n✅ Database cleanup completed successfully!");
    Console.WriteLine("\nNext steps:");
    Console.WriteLine("1. Run: dotnet ef database update");
    Console.WriteLine("2. This will recreate the Engagements and ResourceAllocations tables");
}
catch (Exception ex)
{
    Console.WriteLine($"❌ Error: {ex.Message}");
    Console.WriteLine($"Stack trace: {ex.StackTrace}");
}
