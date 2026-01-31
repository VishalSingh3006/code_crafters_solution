-- =====================================================
-- Resource & Engagement Tracking System
-- Client and Designation Migration Script
-- Generated on: January 31, 2026
-- =====================================================

USE `resourceengagementtrackingsystem`;

-- =====================================================
-- 1. CHECK AND CREATE DEPARTMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `Departments` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(100) NOT NULL,
    `Description` TEXT NULL,
    `ManagerId` INT NULL,
    `CreatedBy` INT NOT NULL DEFAULT 1,
    `UpdatedBy` INT NOT NULL DEFAULT 1,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `IX_Departments_Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 2. CHECK AND CREATE DESIGNATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `Designations` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(100) NOT NULL,
    `Description` TEXT NULL,
    `Level` VARCHAR(50) NULL,
    `CreatedBy` INT NOT NULL DEFAULT 1,
    `UpdatedBy` INT NOT NULL DEFAULT 1,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `IX_Designations_Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 3. CHECK AND CREATE SKILLS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `Skills` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(100) NOT NULL,
    `Category` VARCHAR(50) NULL,
    `Description` TEXT NULL,
    `CreatedBy` INT NOT NULL DEFAULT 1,
    `UpdatedBy` INT NOT NULL DEFAULT 1,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`Id`),
    UNIQUE INDEX `IX_Skills_Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 4. UPDATE EMPLOYEES TABLE TO INCLUDE MISSING COLUMNS
-- =====================================================
-- Check if EmployeeCode column exists and add if missing
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
    AND TABLE_NAME = 'Employees' 
    AND COLUMN_NAME = 'EmployeeCode'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE `Employees` ADD COLUMN `EmployeeCode` VARCHAR(50) NOT NULL AFTER `Id`',
    'SELECT "EmployeeCode column already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if Phone column exists and add if missing
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
    AND TABLE_NAME = 'Employees' 
    AND COLUMN_NAME = 'Phone'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE `Employees` ADD COLUMN `Phone` VARCHAR(20) NULL AFTER `Email`',
    'SELECT "Phone column already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if DateOfJoining column exists and add if missing
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
    AND TABLE_NAME = 'Employees' 
    AND COLUMN_NAME = 'DateOfJoining'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE `Employees` ADD COLUMN `DateOfJoining` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) AFTER `Phone`',
    'SELECT "DateOfJoining column already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if DateOfBirth column exists and add if missing
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
    AND TABLE_NAME = 'Employees' 
    AND COLUMN_NAME = 'DateOfBirth'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE `Employees` ADD COLUMN `DateOfBirth` DATETIME(6) NOT NULL DEFAULT "1990-01-01" AFTER `DateOfJoining`',
    'SELECT "DateOfBirth column already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if ManagerId column exists and add if missing
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
    AND TABLE_NAME = 'Employees' 
    AND COLUMN_NAME = 'ManagerId'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE `Employees` ADD COLUMN `ManagerId` INT NULL AFTER `DateOfBirth`',
    'SELECT "ManagerId column already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if DepartmentId column exists and add if missing
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
    AND TABLE_NAME = 'Employees' 
    AND COLUMN_NAME = 'DepartmentId'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE `Employees` ADD COLUMN `DepartmentId` INT NOT NULL DEFAULT 1 AFTER `ManagerId`',
    'SELECT "DepartmentId column already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if DesignationId column exists and add if missing
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
    AND TABLE_NAME = 'Employees' 
    AND COLUMN_NAME = 'DesignationId'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE `Employees` ADD COLUMN `DesignationId` INT NOT NULL DEFAULT 1 AFTER `DepartmentId`',
    'SELECT "DesignationId column already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if EmploymentType column exists and add if missing
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
    AND TABLE_NAME = 'Employees' 
    AND COLUMN_NAME = 'EmploymentType'
);

SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE `Employees` ADD COLUMN `EmploymentType` INT NOT NULL DEFAULT 0 AFTER `DesignationId`',
    'SELECT "EmploymentType column already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- 5. CREATE EMPLOYEESKILLS JUNCTION TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `EmployeeSkills` (
    `EmployeeId` INT NOT NULL,
    `SkillId` INT NOT NULL,
    `ProficiencyLevel` INT NOT NULL DEFAULT 1, -- 1=Beginner, 2=Intermediate, 3=Advanced, 4=Expert
    `YearsOfExperience` DECIMAL(3,1) NULL,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (`EmployeeId`, `SkillId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 6. ADD FOREIGN KEY CONSTRAINTS
-- =====================================================

-- Department Manager self-reference
SET @fk_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem'
    AND TABLE_NAME = 'Departments'
    AND CONSTRAINT_NAME = 'FK_Departments_Employees_ManagerId'
);

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE `Departments` ADD CONSTRAINT `FK_Departments_Employees_ManagerId` FOREIGN KEY (`ManagerId`) REFERENCES `Employees` (`Id`) ON DELETE SET NULL',
    'SELECT "FK_Departments_Employees_ManagerId already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Employee Manager self-reference
SET @fk_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem'
    AND TABLE_NAME = 'Employees'
    AND CONSTRAINT_NAME = 'FK_Employees_Employees_ManagerId'
);

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE `Employees` ADD CONSTRAINT `FK_Employees_Employees_ManagerId` FOREIGN KEY (`ManagerId`) REFERENCES `Employees` (`Id`) ON DELETE SET NULL',
    'SELECT "FK_Employees_Employees_ManagerId already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Employee Department reference
SET @fk_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem'
    AND TABLE_NAME = 'Employees'
    AND CONSTRAINT_NAME = 'FK_Employees_Departments_DepartmentId'
);

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE `Employees` ADD CONSTRAINT `FK_Employees_Departments_DepartmentId` FOREIGN KEY (`DepartmentId`) REFERENCES `Departments` (`Id`) ON DELETE RESTRICT',
    'SELECT "FK_Employees_Departments_DepartmentId already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Employee Designation reference
SET @fk_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem'
    AND TABLE_NAME = 'Employees'
    AND CONSTRAINT_NAME = 'FK_Employees_Designations_DesignationId'
);

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE `Employees` ADD CONSTRAINT `FK_Employees_Designations_DesignationId` FOREIGN KEY (`DesignationId`) REFERENCES `Designations` (`Id`) ON DELETE RESTRICT',
    'SELECT "FK_Employees_Designations_DesignationId already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- EmployeeSkills references
SET @fk_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem'
    AND TABLE_NAME = 'EmployeeSkills'
    AND CONSTRAINT_NAME = 'FK_EmployeeSkills_Employees_EmployeeId'
);

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE `EmployeeSkills` ADD CONSTRAINT `FK_EmployeeSkills_Employees_EmployeeId` FOREIGN KEY (`EmployeeId`) REFERENCES `Employees` (`Id`) ON DELETE CASCADE',
    'SELECT "FK_EmployeeSkills_Employees_EmployeeId already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem'
    AND TABLE_NAME = 'EmployeeSkills'
    AND CONSTRAINT_NAME = 'FK_EmployeeSkills_Skills_SkillId'
);

SET @sql = IF(@fk_exists = 0, 
    'ALTER TABLE `EmployeeSkills` ADD CONSTRAINT `FK_EmployeeSkills_Skills_SkillId` FOREIGN KEY (`SkillId`) REFERENCES `Skills` (`Id`) ON DELETE CASCADE',
    'SELECT "FK_EmployeeSkills_Skills_SkillId already exists"'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================================
-- 7. SEED INITIAL DATA
-- =====================================================

-- Insert default departments
INSERT IGNORE INTO `Departments` (`Id`, `Name`, `Description`, `CreatedBy`, `UpdatedBy`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 'Information Technology', 'Software development and IT infrastructure', 1, 1, NOW(6), NOW(6)),
(2, 'Human Resources', 'Employee relations and recruitment', 1, 1, NOW(6), NOW(6)),
(3, 'Finance', 'Financial planning and accounting', 1, 1, NOW(6), NOW(6)),
(4, 'Marketing', 'Marketing and business development', 1, 1, NOW(6), NOW(6)),
(5, 'Operations', 'Business operations and project management', 1, 1, NOW(6), NOW(6));

-- Insert default designations
INSERT IGNORE INTO `Designations` (`Id`, `Name`, `Description`, `CreatedBy`, `UpdatedBy`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 'Software Engineer', 'Develops and maintains software applications', 1, 1, NOW(6), NOW(6)),
(2, 'Senior Software Engineer', 'Lead developer with advanced technical skills', 1, 1, NOW(6), NOW(6)),
(3, 'Tech Lead', 'Technical leadership and architecture decisions', 1, 1, NOW(6), NOW(6)),
(4, 'Project Manager', 'Manages projects and coordinates teams', 1, 1, NOW(6), NOW(6)),
(5, 'Business Analyst', 'Analyzes business requirements and processes', 1, 1, NOW(6), NOW(6)),
(6, 'HR Manager', 'Manages human resources and employee relations', 1, 1, NOW(6), NOW(6)),
(7, 'DevOps Engineer', 'Manages infrastructure and deployment pipelines', 1, 1, NOW(6), NOW(6)),
(8, 'Quality Assurance Engineer', 'Tests and ensures quality of software products', 1, 1, NOW(6), NOW(6));

-- Insert default skills
INSERT IGNORE INTO `Skills` (`Id`, `Name`, `Category`, `Description`, `CreatedBy`, `UpdatedBy`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 'C#', 'Programming Language', 'Microsoft C# programming language', 1, 1, NOW(6), NOW(6)),
(2, 'ASP.NET Core', 'Framework', '.NET Core web application framework', 1, 1, NOW(6), NOW(6)),
(3, 'React', 'Frontend Framework', 'JavaScript library for building user interfaces', 1, 1, NOW(6), NOW(6)),
(4, 'TypeScript', 'Programming Language', 'Typed superset of JavaScript', 1, 1, NOW(6), NOW(6)),
(5, 'SQL Server', 'Database', 'Microsoft SQL Server database management', 1, 1, NOW(6), NOW(6)),
(6, 'MySQL', 'Database', 'Open source relational database', 1, 1, NOW(6), NOW(6)),
(7, 'Entity Framework', 'ORM', 'Object-relational mapping framework for .NET', 1, 1, NOW(6), NOW(6)),
(8, 'Azure', 'Cloud Platform', 'Microsoft Azure cloud services', 1, 1, NOW(6), NOW(6)),
(9, 'Docker', 'Containerization', 'Container platform for applications', 1, 1, NOW(6), NOW(6)),
(10, 'Kubernetes', 'Container Orchestration', 'Container orchestration platform', 1, 1, NOW(6), NOW(6)),
(11, 'JavaScript', 'Programming Language', 'Dynamic programming language for web development', 1, 1, NOW(6), NOW(6)),
(12, 'HTML/CSS', 'Web Technology', 'Web markup and styling technologies', 1, 1, NOW(6), NOW(6)),
(13, 'Git', 'Version Control', 'Distributed version control system', 1, 1, NOW(6), NOW(6)),
(14, 'Project Management', 'Soft Skill', 'Planning and managing project execution', 1, 1, NOW(6), NOW(6)),
(15, 'Agile/Scrum', 'Methodology', 'Agile software development methodology', 1, 1, NOW(6), NOW(6));

-- Insert sample clients (if not exists)
INSERT IGNORE INTO `Clients` (`Id`, `Name`, `Email`, `ContactName`, `ContactPhone`, `CreatedBy`, `UpdatedBy`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 'TechCorp Solutions', 'contact@techcorp.com', 'John Smith', '+1-555-0101', 1, 1, NOW(6), NOW(6)),
(2, 'Digital Innovations Ltd', 'info@digitalinnovations.com', 'Sarah Johnson', '+1-555-0102', 1, 1, NOW(6), NOW(6)),
(3, 'Global Enterprises', 'admin@globalent.com', 'Michael Brown', '+1-555-0103', 1, 1, NOW(6), NOW(6)),
(4, 'StartupHub Inc', 'hello@startuphub.com', 'Emily Davis', '+1-555-0104', 1, 1, NOW(6), NOW(6)),
(5, 'Enterprise Systems Co', 'contact@enterprise-sys.com', 'Robert Wilson', '+1-555-0105', 1, 1, NOW(6), NOW(6));

-- =====================================================
-- 8. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Indexes for Employees table
CREATE INDEX IF NOT EXISTS `IX_Employees_DepartmentId` ON `Employees` (`DepartmentId`);
CREATE INDEX IF NOT EXISTS `IX_Employees_DesignationId` ON `Employees` (`DesignationId`);
CREATE INDEX IF NOT EXISTS `IX_Employees_ManagerId` ON `Employees` (`ManagerId`);
CREATE INDEX IF NOT EXISTS `IX_Employees_Email` ON `Employees` (`Email`);
CREATE INDEX IF NOT EXISTS `IX_Employees_EmployeeCode` ON `Employees` (`EmployeeCode`);

-- Indexes for EmployeeSkills table
CREATE INDEX IF NOT EXISTS `IX_EmployeeSkills_SkillId` ON `EmployeeSkills` (`SkillId`);
CREATE INDEX IF NOT EXISTS `IX_EmployeeSkills_EmployeeId` ON `EmployeeSkills` (`EmployeeId`);

-- =====================================================
-- 9. VERIFICATION QUERIES
-- =====================================================

-- Verify table creation
SELECT 'Table Verification' AS Status;
SELECT TABLE_NAME, TABLE_ROWS 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
AND TABLE_NAME IN ('Clients', 'Designations', 'Departments', 'Skills', 'Employees', 'EmployeeSkills')
ORDER BY TABLE_NAME;

-- Verify foreign key constraints
SELECT 'Foreign Key Verification' AS Status;
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = 'resourceengagementtrackingsystem' 
AND REFERENCED_TABLE_NAME IS NOT NULL
AND TABLE_NAME IN ('Employees', 'EmployeeSkills', 'Departments')
ORDER BY TABLE_NAME, CONSTRAINT_NAME;

-- Verify seed data
SELECT 'Seed Data Verification' AS Status;
SELECT 'Departments' AS TableName, COUNT(*) AS RecordCount FROM `Departments`
UNION ALL
SELECT 'Designations' AS TableName, COUNT(*) AS RecordCount FROM `Designations`
UNION ALL
SELECT 'Skills' AS TableName, COUNT(*) AS RecordCount FROM `Skills`
UNION ALL
SELECT 'Clients' AS TableName, COUNT(*) AS RecordCount FROM `Clients`;

SELECT 'Migration completed successfully!' AS Result;

-- =====================================================
-- END OF SCRIPT
-- =====================================================